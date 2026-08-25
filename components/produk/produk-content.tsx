'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCategories } from '@/hooks/category.hook';
import {
	useAllProducts,
	useProducts,
} from '@/hooks/product.hook';
import { searchProductsFuzzy } from '@/lib/utils/levenshtein';
import { ProductCard } from '@/components/product-card';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { SectionHeader } from '@/components/section-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaginationNav } from '@/components/pagination-nav';
import { FlaskConicalIcon } from 'lucide-react';
import type { Product } from '@/types/product';

const PAGE_SIZE = 12;
const LD_PAGE_SIZE = 24;

function CategoryFilterBar({
	activeCategoryId,
}: {
	activeCategoryId?: string;
}) {
	const { data: categories, isPending } = useCategories();

	const chipClass = (active: boolean) =>
		`shrink-0 rounded-full border px-4 py-2 text-label-sm transition-colors ${
			active
				? 'border-primary bg-primary text-primary-foreground'
				: 'border-border bg-surface text-foreground hover:border-primary hover:bg-primary-soft hover:text-primary'
		}`;

	return (
		<nav
			aria-label="Filter kategori"
			className="-mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			<div className="flex w-max min-w-full items-center gap-2">
				<Link
					href="/produk"
					aria-current={activeCategoryId ? undefined : 'page'}
					className={chipClass(!activeCategoryId)}
				>
					Semua
				</Link>
				{isPending
					? Array.from({ length: 5 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-9 w-28 shrink-0 rounded-full"
							/>
						))
					: categories?.map((category) => (
							<Link
								key={category.id}
								href={`/produk?category=${category.id}`}
								aria-current={
									activeCategoryId === category.id
										? 'page'
										: undefined
								}
								className={chipClass(
									activeCategoryId === category.id,
								)}
							>
								{category.name}
							</Link>
						))}
			</div>
		</nav>
	);
}

function ProductGrid({ products }: { products: Product[] }) {
	return (
		<div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
			{products.map((product, index) => (
				<ProductCard
					key={product.id}
					product={product}
					eager={index === 0}
				/>
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
	const hasQuery = Boolean(query);
	const showBadge = hasQuery || method === 'ld';

	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div className="flex flex-wrap items-center gap-2">
				{hasQuery ? (
					<p className="text-body-sm text-muted-foreground">
						{count} hasil untuk{' '}
						<span className="font-semibold text-foreground">
							&quot;{query}&quot;
						</span>
					</p>
				) : (
					<p className="text-body-sm text-muted-foreground">
						{count} produk tersedia
					</p>
				)}
				{showBadge && (
					<Badge variant="outline" className="text-caption">
						{method === 'ld' ? 'Levenshtein Distance' : 'Normal'}
					</Badge>
				)}
			</div>
			{hasQuery && (
				<Link
					href="/produk"
					className="text-label-sm text-primary transition-colors hover:text-primary/80 hover:underline"
				>
					Tampilkan semua produk
				</Link>
			)}
		</div>
	);
}

function NormalResults({
	search,
	category,
}: {
	search: string;
	category?: string;
}) {
	const searchParams = useSearchParams();
	const page = Math.max(1, Number(searchParams.get('page')) || 1);

	const { data, isPending, isError } = useProducts({
		page,
		limit: PAGE_SIZE,
		search: search || undefined,
		category_id: category,
	});

	if (isPending) {
		return <ProductGridSkeleton count={8} />;
	}

	if (isError) {
		return (
			<>
				<ResultSummary query={search} count={0} method="normal" />
				<EmptyState
					title="Gagal memuat produk"
					description="Terjadi kesalahan saat menghubungi server. Silakan coba lagi beberapa saat lagi."
				/>
			</>
		);
	}

	const products = data?.data ?? [];
	const totalPages = data?.meta.total_pages ?? 1;
	const total = data?.meta.total ?? products.length;

	function buildHref(pageNumber: number) {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (category) params.set('category', category);
		params.set('method', 'normal');
		params.set('page', String(pageNumber));
		return `/produk?${params.toString()}`;
	}

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
				<PaginationNav
					page={page}
					totalPages={totalPages}
					buildHref={buildHref}
				/>
			)}

			<p className="text-center text-caption text-muted-foreground">
				Menampilkan {products.length} dari {total} produk
			</p>
		</>
	);
}

function LdResults({
	search,
	category,
}: {
	search: string;
	category?: string;
}) {
	const { data, isPending, isError } = useAllProducts();

	if (isPending) {
		return <ProductGridSkeleton count={8} />;
	}

	if (isError) {
		return (
			<>
				<ResultSummary query={search} count={0} method="ld" />
				<EmptyState
					title="Gagal memuat produk"
					description="Terjadi kesalahan saat menghubungi server. Silakan coba lagi beberapa saat lagi."
				/>
			</>
		);
	}

	const all = (data ?? []).filter(
		(product) => !category || product.category_id === category,
	);
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

	const visible = results.slice(0, LD_PAGE_SIZE);

	return (
		<>
			<ResultSummary query={search} count={results.length} method="ld" />
			<ProductGrid products={visible.map((r) => r.product)} />
			{results.length > LD_PAGE_SIZE && (
				<p className="text-center text-caption text-muted-foreground">
					Menampilkan {LD_PAGE_SIZE} dari {results.length} hasil
				</p>
			)}
		</>
	);
}

export function ProdukContent() {
	const searchParams = useSearchParams();
	const search = (searchParams.get('search') ?? '').trim();
	const method = searchParams.get('method') ?? 'normal';
	const category = searchParams.get('category') ?? undefined;
	const isLD = method === 'ld';

	return (
		<main className="flex flex-1 flex-col">
			<section className="border-b border-border bg-surface-muted">
				<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 md:px-6">
					<SectionHeader
						label="Katalog produk"
						title="Produk"
						description="Telusuri semua produk kebutuhan keluarga Anda. Gunakan pencarian untuk menemukan yang lebih spesifik."
					/>
					<div className="mt-2">
						<Button
							render={<Link href="/produk/research" />}
							variant="outline"
							size="sm"
							data-testid="research-entry"
						>
							<FlaskConicalIcon className="size-4" />
							Penelitian
						</Button>
					</div>
				</div>
			</section>

			<section className="border-b border-border">
				<div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:px-6 md:py-20">
					<CategoryFilterBar activeCategoryId={category} />
					{isLD ? (
						<LdResults search={search} category={category} />
					) : (
						<NormalResults search={search} category={category} />
					)}
				</div>
			</section>
		</main>
	);
}
