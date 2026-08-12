import { EmptyState } from '@/components/empty-state';
import { Price } from '@/components/price';
import { ProductImage } from '@/components/product-image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { isApiError } from '@/lib/api';
import type { Product } from '@/types/product';
import {
	AlertTriangleIcon,
	ArrowRightIcon,
	Loader2Icon,
	PackageCheckIcon,
	PlusIcon,
	RefreshCcwIcon,
} from 'lucide-react';
import Link from 'next/link';
import {
	LOW_STOCK_LIST_LIMIT,
	LOW_STOCK_THRESHOLD,
	URGENT_STOCK_THRESHOLD,
} from './dashboard-utils';

type Props = {
	products: Product[];
	loading: boolean;
	error: Error | null;
	onRetry: () => void;
	stockBusyId: string | null;
	onQuickStock: (product: Product) => void;
};

export function DashboardLowStockSection({
	products,
	loading,
	error,
	onRetry,
	stockBusyId,
	onQuickStock,
}: Props) {
	return (
		<div className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-border">
			<div className="flex flex-col gap-0.5">
				<h2 className="text-headline-sm text-foreground">Stok Menipis</h2>
				<p className="text-caption text-muted-foreground">
					Produk dengan stok kurang dari atau sama dengan{' '}
					{LOW_STOCK_THRESHOLD}.
				</p>
			</div>

			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Gagal memuat produk</AlertTitle>
					<AlertDescription>
						{isApiError(error) ? error.message : 'Terjadi kesalahan. Coba lagi.'}
					</AlertDescription>
					<div className="pt-2">
						<Button variant="outline" size="sm" onClick={onRetry}>
							<RefreshCcwIcon />
							Coba lagi
						</Button>
					</div>
				</Alert>
			) : loading ? (
				<div className="flex flex-col gap-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="size-10 shrink-0 rounded-lg" />
							<div className="flex flex-1 flex-col gap-2">
								<Skeleton className="h-4 w-2/3" />
								<Skeleton className="h-3 w-24" />
							</div>
							<Skeleton className="h-5 w-12 rounded-full" />
						</div>
					))}
				</div>
			) : products.length === 0 ? (
				<EmptyState
					icon={PackageCheckIcon}
					title="Stok semua aman"
					description="Tidak ada produk yang perlu diisi ulang."
					className="rounded-xl bg-surface-muted py-8"
				/>
			) : (
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Produk</TableHead>
								<TableHead>Kategori</TableHead>
								<TableHead>Stok</TableHead>
								<TableHead>Harga</TableHead>
								<TableHead className="text-right">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.slice(0, LOW_STOCK_LIST_LIMIT).map((product) => {
								const stockBusy = stockBusyId === product.id;
								return (
									<TableRow key={product.id}>
										<TableCell>
											<div className="flex items-center gap-3">
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
												<span className="line-clamp-1 max-w-40 font-medium text-foreground">
													{product.name}
												</span>
											</div>
										</TableCell>
										<TableCell className="text-muted-foreground">
											{product.category.name}
										</TableCell>
										<TableCell>
											<span
												className={
													product.stock <= URGENT_STOCK_THRESHOLD
														? 'inline-flex h-5 items-center gap-1 rounded-full bg-destructive/10 px-2 text-xs font-medium text-red-700'
														: 'inline-flex h-5 items-center rounded-full bg-warning/10 px-2 text-xs font-medium text-amber-700'
												}
											>
												{product.stock <= URGENT_STOCK_THRESHOLD && (
													<AlertTriangleIcon className="size-3" />
												)}
												{product.stock} tersisa
											</span>
										</TableCell>
										<TableCell>
											<Price value={product.price} />
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<Button
													variant="outline"
													size="icon-sm"
													disabled={stockBusy}
													onClick={() => onQuickStock(product)}
													aria-label={`Tambah 1 stok ${product.name}`}
												>
													{stockBusy ? (
														<Loader2Icon className="size-4 animate-spin" />
													) : (
														<PlusIcon className="size-4" />
													)}
												</Button>
												<Button
													variant="outline"
													size="sm"
													nativeButton={false}
													render={
														<Link
															href={`/dashboard/produk/${product.id}/update`}
														/>
													}
												>
													Isi Ulang
													<ArrowRightIcon />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}