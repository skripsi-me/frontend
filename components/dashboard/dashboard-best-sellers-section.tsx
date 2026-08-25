import { EmptyState } from '@/components/empty-state';
import { Price } from '@/components/price';
import { ProductImage } from '@/components/product-image';
import { SectionError } from '@/components/dashboard/dashboard-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { Product } from '@/types/product';
import { FlameIcon, PackageCheckIcon } from 'lucide-react';

function BestSellerRowsSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, i) => (
				<TableRow key={i}>
					<TableCell>
						<div className="flex items-center gap-3">
							<Skeleton className="size-10 shrink-0 rounded-lg" />
							<div className="flex flex-col gap-1.5">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-20" />
							</div>
						</div>
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-16" />
					</TableCell>
					<TableCell className="text-right">
						<Skeleton className="ml-auto h-6 w-14 rounded-full" />
					</TableCell>
					<TableCell className="text-right">
						<Skeleton className="ml-auto h-4 w-16" />
					</TableCell>
				</TableRow>
			))}
		</>
	);
}

type Props = {
	products: Product[];
	loading: boolean;
	error: Error | null;
	onRetry: () => void;
};

export function DashboardBestSellersSection({
	products,
	loading,
	error,
	onRetry,
}: Props) {
	return (
		<div className="flex flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-border">
			<div className="flex flex-col gap-0.5">
				<h2 className="text-headline-sm text-foreground">
					Produk Best Seller
				</h2>
				<p className="text-caption text-muted-foreground">
					Berdasarkan total penjualan.
				</p>
			</div>

			{error ? (
				<SectionError
					title="Gagal memuat produk"
					error={error}
					onRetry={onRetry}
				/>
			) : loading ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Produk</TableHead>
							<TableHead>Kategori</TableHead>
							<TableHead className="text-right">
								Terjual
							</TableHead>
							<TableHead className="text-right">Harga</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<BestSellerRowsSkeleton />
					</TableBody>
				</Table>
			) : products.length === 0 ? (
				<EmptyState
					icon={FlameIcon}
					title="Belum ada produk terlaris"
					description="Data penjualan akan tampil di sini."
					className="rounded-xl bg-surface-muted py-8"
				/>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Produk</TableHead>
							<TableHead>Kategori</TableHead>
							<TableHead className="text-right">
								Terjual
							</TableHead>
							<TableHead className="text-right">Harga</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.map((product, index) => (
							<TableRow key={product.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold tabular-nums text-success">
											{index + 1}
										</span>
										<div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
											{product.image_url ? (
												<ProductImage
													src={product.image_url}
													alt={product.name}
													sizes="40px"
													className="h-full w-full object-cover"
												/>
											) : (
												<div className="flex h-full items-center justify-center text-muted-foreground">
													<PackageCheckIcon className="size-4" />
												</div>
											)}
										</div>
										<span className="line-clamp-1 max-w-32 font-medium text-foreground">
											{product.name}
										</span>
									</div>
								</TableCell>
								<TableCell className="text-muted-foreground">
									{product.category.name}
								</TableCell>
								<TableCell className="text-right">
									<span className="inline-flex h-5 items-center gap-1 rounded-full bg-primary-soft px-2 text-xs font-medium tabular-nums text-success">
										<FlameIcon className="size-3" />
										{product.total_sold ?? 0} terjual
									</span>
								</TableCell>
								<TableCell className="text-right tabular-nums">
									<Price value={product.price} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
