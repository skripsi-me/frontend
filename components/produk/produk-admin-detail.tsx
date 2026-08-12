'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/empty-state';
import { Price } from '@/components/price';
import { ProductImage } from '@/components/product-image';
import { StockBadge } from '@/components/stock-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteProduct, useProductById } from '@/hooks/product.hook';
import { isApiError } from '@/lib/api';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
	ArrowLeftIcon,
	Loader2Icon,
	PencilIcon,
	RefreshCcwIcon,
	Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function formatDateTime(value: string) {
	return format(new Date(value), 'd MMMM yyyy, HH:mm', { locale: localeId });
}

export function ProdukAdminDetail({ productId }: { productId: string }) {
	const router = useRouter();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const {
		data: product,
		isPending,
		isError,
		error,
		refetch,
	} = useProductById(productId);
	const deleteProduct = useDeleteProduct();

	async function handleDelete() {
		if (deleteProduct.isPending) return;
		try {
			await deleteProduct.mutateAsync(productId);
			toast.success(`Produk "${product?.name}" dihapus.`);
			router.push('/dashboard/produk');
		} catch (err) {
			toast.error(
				isApiError(err) ? err.message : 'Gagal menghapus produk.',
			);
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
			<div className="flex items-center gap-3 pb-6">
				<Button
					variant="ghost"
					size="icon-sm"
					nativeButton={false}
					render={<Link href="/dashboard/produk" />}
					aria-label="Kembali ke daftar produk"
				>
					<ArrowLeftIcon />
				</Button>
				<h1 className="text-headline-lg text-foreground">
					Detail Produk
				</h1>
			</div>

			{isError ? (
				<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
					<EmptyState
						icon={RefreshCcwIcon}
						title="Gagal memuat produk"
						description={
							isApiError(error)
								? error.message
								: 'Terjadi kesalahan.'
						}
						className="rounded-xl bg-surface-muted py-10"
					/>
					<div className="flex justify-center gap-3">
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link href="/dashboard/produk" />}
						>
							Kembali ke daftar
						</Button>
						<Button onClick={() => refetch()}>
							<RefreshCcwIcon />
							Coba lagi
						</Button>
					</div>
				</div>
			) : isPending ? (
				<div className="grid gap-6 rounded-xl bg-white p-6 ring-1 ring-border lg:grid-cols-2">
					<Skeleton className="aspect-square w-full rounded-xl" />
					<div className="flex flex-col gap-4">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-6 w-28 rounded-full" />
						<Skeleton className="h-10 w-40" />
						<Skeleton className="h-6 w-24 rounded-full" />
						<Skeleton className="h-24 w-full" />
						<div className="flex gap-3">
							<Skeleton className="h-10 w-28 rounded-full" />
							<Skeleton className="h-10 w-24 rounded-full" />
						</div>
					</div>
				</div>
			) : !product ? (
				<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
					<EmptyState
						icon={RefreshCcwIcon}
						title="Produk tidak ditemukan"
						description="Produk mungkin telah dihapus atau tautan tidak valid."
						className="rounded-xl bg-surface-muted py-10"
					/>
					<div className="flex justify-center">
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link href="/dashboard/produk" />}
						>
							Kembali ke daftar
						</Button>
					</div>
				</div>
			) : (
				<div className="grid gap-6 rounded-xl bg-white p-6 ring-1 ring-border lg:grid-cols-2">
					<div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-muted">
						{product.image_url ? (
							<ProductImage
								src={product.image_url}
								alt={product.name}
								sizes="(min-width: 1024px) 50vw, 100vw"
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full items-center justify-center text-muted-foreground">
								<p className="text-body-sm">Tidak ada gambar</p>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-5">
						<div className="flex flex-wrap items-center gap-3">
							<Badge
								variant="outline"
								className="bg-primary-soft text-green-700"
							>
								{product.category.name}
							</Badge>
							<StockBadge stock={product.stock} />
						</div>

						<h2 className="text-headline-md text-foreground">
							{product.name}
						</h2>

						<p className="text-headline-lg font-semibold text-primary tabular-nums">
							<Price value={product.price} />
						</p>

						<div className="flex flex-col gap-2 rounded-xl bg-surface-muted p-4">
							<div className="flex items-center justify-between gap-3">
								<span className="text-caption text-muted-foreground">
									Total terjual
								</span>
								<span className="text-body-sm font-medium tabular-nums text-foreground">
									{product.total_sold ?? 0}
								</span>
							</div>
							<div className="flex items-center justify-between gap-3">
								<span className="text-caption text-muted-foreground">
									Dibuat
								</span>
								<span className="text-body-sm font-medium text-foreground">
									{formatDateTime(product.created_at)}
								</span>
							</div>
							<div className="flex items-center justify-between gap-3">
								<span className="text-caption text-muted-foreground">
									Diperbarui
								</span>
								<span className="text-body-sm font-medium text-foreground">
									{formatDateTime(product.updated_at)}
								</span>
							</div>
						</div>

						{product.description && (
							<div className="flex flex-col gap-1.5">
								<h3 className="text-label-sm text-muted-foreground">
									Deskripsi
								</h3>
								<p className="text-body-sm text-foreground whitespace-pre-line">
									{product.description}
								</p>
							</div>
						)}

						<div className="mt-auto flex flex-wrap gap-3 pt-2">
							<Button
								size="lg"
								className="font-semibold"
								nativeButton={false}
								render={
									<Link
										href={`/dashboard/produk/${product.id}/update`}
									/>
								}
							>
								<PencilIcon />
								Ubah Produk
							</Button>
							<Button
								variant="destructive"
								size="lg"
								onClick={() => setDeleteOpen(true)}
							>
								<Trash2Icon />
								Hapus
							</Button>
						</div>
					</div>
				</div>
			)}

			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Hapus produk?</DialogTitle>
						<DialogDescription>
							Produk &quot;{product?.name}&quot; akan dihapus
							secara permanen. Tindakan ini tidak dapat
							dibatalkan.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteOpen(false)}
						>
							Batal
						</Button>
						<Button
							variant="destructive"
							disabled={deleteProduct.isPending}
							onClick={handleDelete}
						>
							{deleteProduct.isPending && (
								<Loader2Icon className="animate-spin" />
							)}
							{deleteProduct.isPending ? 'Menghapus...' : 'Hapus'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
