'use client';

import { RequireAuth } from '@/components/auth/require-auth';
import { EmptyState } from '@/components/empty-state';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
	useCart,
	useDeleteCartItem,
	useUpdateCartItem,
} from '@/hooks/cart.hook';
import { isApiError } from '@/lib/api';
import { formatRupiah } from '@/lib/utils/format';
import type { CartItem } from '@/types/cart';
import {
	ArrowRightIcon,
	BadgeCheckIcon,
	RefreshCcwIcon,
	ShoppingCartIcon,
	TruckIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { KeranjangItem, KeranjangItemSkeleton } from './keranjang-item';

function KeranjangSkeleton() {
	return (
		<div className="grid items-start gap-6 lg:grid-cols-3">
			<div className="flex flex-col gap-3 lg:col-span-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<KeranjangItemSkeleton key={i} />
				))}
			</div>
			<div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-border">
				<Skeleton className="h-6 w-40" />
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-2/3" />
				<Skeleton className="h-10 w-full rounded-full" />
			</div>
		</div>
	);
}

function ErrorCart({
	message,
	onRetry,
}: {
	message: string;
	onRetry: () => void;
}) {
	return (
		<Alert variant="destructive" className="mx-auto max-w-2xl">
			<AlertTitle>Keranjang gagal dimuat</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
			<div className="pt-2">
				<Button variant="outline" size="lg" onClick={onRetry}>
					<RefreshCcwIcon />
					Coba lagi
				</Button>
			</div>
		</Alert>
	);
}

export function KeranjangContent() {
	const { data: cart, isPending, isError, error, refetch } = useCart();
	const updateMutation = useUpdateCartItem();
	const deleteMutation = useDeleteCartItem();
	const [busyId, setBusyId] = useState<string | null>(null);

	const items = cart?.items ?? [];
	const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
	const totalPrice = items.reduce(
		(sum, i) => sum + Number(i.product.price) * i.quantity,
		0,
	);

	async function updateQuantity(item: CartItem, quantity: number) {
		if (busyId || quantity < 1) return;
		setBusyId(item.id);
		try {
			await updateMutation.mutateAsync({
				itemId: item.id,
				data: { quantity },
			});
		} catch {
			// toast di luar, cukup hentikan
		} finally {
			setBusyId(null);
		}
	}

	async function removeItem(itemId: string) {
		if (busyId) return;
		setBusyId(itemId);
		try {
			await deleteMutation.mutateAsync(itemId);
		} catch {
			// toast di luar, cukup hentikan
		} finally {
			setBusyId(null);
		}
	}

	const errorMessage = isApiError(error)
		? error.message
		: 'Terjadi kesalahan saat memuat keranjang.';

	return (
		<RequireAuth>
			<main className="flex flex-1 flex-col">
				<section className="border-b border-border bg-surface-muted">
					<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 md:px-6 md:py-14">
						<h1 className="text-headline-lg text-foreground">
							Keranjang Saya
						</h1>
						<p className="text-body-sm text-muted-foreground">
							Belanjaan kamu tampil di sini. Atur jumlah, lalu
							lanjut ke checkout — bayar saat barang sampai di
							rumah.
						</p>
					</div>
				</section>

				<section className="flex flex-1">
					<div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
						{isPending ? (
							<KeranjangSkeleton />
						) : isError ? (
							<ErrorCart
								message={errorMessage}
								onRetry={() => refetch()}
							/>
						) : items.length === 0 ? (
							<div className="flex flex-col items-center gap-2">
								<EmptyState
									icon={ShoppingCartIcon}
									title="Keranjang masih kosong"
									description="Yuk mulai belanja kebutuhan keluarga dari katalog produk."
								/>
								<Button
									size="lg"
									nativeButton={false}
									render={<Link href="/produk" />}
								>
									Mulai Belanja
									<ArrowRightIcon />
								</Button>
							</div>
						) : (
							<div className="grid items-start gap-6 lg:grid-cols-3">
								<div className="flex flex-col gap-3 lg:col-span-2">
									<div className="flex items-center justify-between px-1">
										<h2 className="text-headline-sm text-foreground">
											Item belanjaan
										</h2>
										<span className="text-caption text-muted-foreground">
											{totalQuantity} item
										</span>
									</div>
									{items.map((item) => (
										<KeranjangItem
											key={item.id}
											item={item}
											busy={busyId === item.id}
											onUpdateQuantity={updateQuantity}
											onDelete={removeItem}
										/>
									))}
								</div>

								<aside className="lg:sticky lg:top-24">
									<div className="flex flex-col gap-5 rounded-2xl bg-white p-6 ring-1 ring-border">
										<h2 className="text-headline-sm text-foreground">
											Ringkasan Belanja
										</h2>
										<dl className="flex flex-col gap-3 text-body-sm">
											<div className="flex items-center justify-between">
												<dt className="text-muted-foreground">
													Total Item
												</dt>
												<dd className="font-medium text-foreground">
													{totalQuantity} item
												</dd>
											</div>
											<div className="flex items-center justify-between">
												<dt className="text-muted-foreground">
													Total Harga
												</dt>
												<dd className="text-label-lg font-semibold text-primary">
													{formatRupiah(totalPrice)}
												</dd>
											</div>
										</dl>

										<div className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2.5">
											<TruckIcon className="size-4 shrink-0 text-primary" />
											<p className="text-caption text-muted-foreground">
												Bayar di rumah saat pesanan tiba
												(COD), tanpa biaya tersembunyi.
											</p>
										</div>

										<div className="flex flex-col gap-2">
											<Button
												size="lg"
												nativeButton={false}
												render={
													<Link href="/keranjang-saya/konfirmasi-checkout" />
												}
											>
												Lanjut ke Checkout
												<ArrowRightIcon />
											</Button>
											<Button
												variant="ghost"
												size="lg"
												nativeButton={false}
												render={<Link href="/produk" />}
											>
												Lanjut Belanja
											</Button>
										</div>

										<p className="flex items-center justify-center gap-1 text-caption text-muted-foreground">
											<BadgeCheckIcon className="size-4 text-primary" />
											Harga tetap sesuai label produk
										</p>
									</div>
								</aside>
							</div>
						)}
					</div>
				</section>
			</main>
		</RequireAuth>
	);
}
