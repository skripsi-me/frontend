'use client';

import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/product.hook';
import { searchProductsFuzzy } from '@/lib/utils/levenshtein';
import { ProductCard } from '@/components/product-card';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';
import { EmptyState } from '@/components/empty-state';
import { SectionHeader } from '@/components/section-header';
import { Badge } from '@/components/ui/badge';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import type { Product } from '@/types/product';

const PAGE_SIZE = 12;

function ProductGrid({ products }: { products: Product[] }) {
	return (
		<div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}

function ResultSummary({
	query,
	count,
	method,
}: {
	query: string;
	count: number;
	method: string;
}) {
	if (!query) {
		return (
			<p className="text-body-sm text-muted-foreground">
				{count} produk tersedia
			</p>
		);
	}
	return (
		<div className="flex flex-wrap items-center gap-2">
			<p className="text-body-sm text-muted-foreground">
				{count} hasil untuk{' '}
				<span className="font-semibold text-foreground">
					&quot;{query}&quot;
				</span>
			</p>
			<Badge variant="outline" className="text-caption">
				{method === 'ld' ? 'Levenshtein Distance' : 'Normal'}
			</Badge>
		</div>
	);
}

function NormalResults({ search }: { search: string }) {
	const searchParams = useSearchParams();
	const page = Math.max(1, Number(searchParams.get('page')) || 1);

	const { data, isPending } = useProducts({
		page,
		limit: PAGE_SIZE,
		search: search || undefined,
	});

	if (isPending) {
		return <ProductGridSkeleton count={8} />;
	}

	const products = data?.data ?? [];
	const totalPages = data?.meta.total_pages ?? 1;
	const total = data?.meta.total ?? products.length;

	function buildHref(pageNumber: number) {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		params.set('method', 'normal');
		params.set('page', String(pageNumber));
		return `/produk?${params.toString()}`;
	}

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<>
			<ResultSummary query={search} count={total} method="normal" />
			{products.length === 0 ? (
				<EmptyState
					title="Produk tidak ditemukan"
					description="Coba kata kunci lain atau ganti metode pencarian."
				/>
			) : (
				<ProductGrid products={products} />
			)}

			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								text="Sebelumnya"
								href={buildHref(Math.max(1, page - 1))}
								className={
									page <= 1
										? 'pointer-events-none opacity-50'
										: undefined
								}
							/>
						</PaginationItem>
						{pages.map((p, i) => {
							const show =
								p === 1 ||
								p === totalPages ||
								Math.abs(p - page) <= 1;
							if (!show) {
								const prevShown = pages[i - 1];
								if (
									prevShown !== undefined &&
									p - prevShown > 1
								) {
									return (
										<PaginationItem key={p}>
											<PaginationEllipsis />
										</PaginationItem>
									);
								}
								return null;
							}
							return (
								<PaginationItem key={p}>
									<PaginationLink
										href={buildHref(p)}
										isActive={p === page}
									>
										{p}
									</PaginationLink>
								</PaginationItem>
							);
						})}
						<PaginationItem>
							<PaginationNext
								text="Berikutnya"
								href={buildHref(Math.min(totalPages, page + 1))}
								className={
									page >= totalPages
										? 'pointer-events-none opacity-50'
										: undefined
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}

			<p className="text-center text-caption text-muted-foreground">
				Menampilkan {products.length} dari {total} produk
			</p>
		</>
	);
}

function LdResults({ search }: { search: string }) {
	const { data, isPending } = useProducts({ page: 1, limit: 1000 });

	if (isPending) {
		return <ProductGridSkeleton count={8} />;
	}

	const all = data?.data ?? [];
	const results = search
		? searchProductsFuzzy(all, search)
		: all.map((product) => ({ product, distance: 0 }));

	if (results.length === 0) {
		return (
			<>
				<ResultSummary query={search} count={0} method="ld" />
				<EmptyState
					title="Produk tidak ditemukan"
					description="Tidak ada produk yang mirip dengan kata kunci tersebut."
				/>
			</>
		);
	}

	return (
		<>
			<ResultSummary query={search} count={results.length} method="ld" />
			<ProductGrid products={results.map((r) => r.product)} />
		</>
	);
}

export function ProdukContent() {
	const searchParams = useSearchParams();
	const search = (searchParams.get('search') ?? '').trim();
	const method = searchParams.get('method') ?? 'normal';
	const isLD = method === 'ld';

	return (
		<main className="flex flex-1 flex-col">
			<section className="border-b border-border bg-surface-muted">
				<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 md:px-6">
					<SectionHeader label="Katalog produk" title="Produk" />
				</div>
			</section>

			<section className="border-b border-border">
				<div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14">
					{isLD ? (
						<LdResults search={search} />
					) : (
						<NormalResults search={search} />
					)}
				</div>
			</section>
		</main>
	);
}
