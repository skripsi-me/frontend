'use client';

import { RequireAuth } from '@/components/auth/require-auth';
import { EmptyState } from '@/components/empty-state';
import { Price } from '@/components/price';
import { ProductImage } from '@/components/product-image';
import { Button } from '@/components/ui/button';
import { QueryError } from '@/components/query-error';
import { useCart } from '@/hooks/cart.hook';
import { useCreateOrder } from '@/hooks/order.hook';
import { isApiError } from '@/lib/api';
import { sumCart } from '@/lib/utils/cart';
import {
	ArrowRightIcon,
	CheckIcon,
	LoaderIcon,
	PackageIcon,
	ShoppingCartIcon,
	TruckIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CartSummary } from './cart-summary';

function SkeletonRow() {
	return (
		<div className="flex gap-3 rounded-xl bg-white p-4 ring-1 ring-border">
			<div className="aspect-square w-16 shrink-0 rounded-lg bg-muted md:w-20" />
			<div className="flex flex-1 flex-col gap-2 py-1">
				<div className="h-4 w-2/3 rounded-lg bg-muted" />
				<div className="h-4 w-1/3 rounded-lg bg-muted" />
			</div>
		</div>
	);
}

export function KonfirmasiCheckoutContent() {
	const router = useRouter();
	const { data: cart, isPending, isError, error, refetch } = useCart();
	const createOrder = useCreateOrder();

	const items = cart?.items ?? [];
	const { quantity: totalQuantity, price: totalPrice } = sumCart(items);

	async function handleSubmit() {
		try {
			await createOrder.mutateAsync();
			toast.success('Pesanan berhasil dibuat');
		} catch (err) {
			toast.error(
				isApiError(err)
					? err.message
					: 'Gagal membuat pesanan. Coba lagi.',
			);
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
							Konfirmasi Checkout
						</h1>
						<p className="text-body-sm text-muted-foreground">
							Periksa kembali belanjaan sebelum pesanan dibuat.
							Bayar tunai saat barang tiba di rumah.
						</p>
					</div>
				</section>

				{createOrder.isSuccess ? (
					<section className="flex flex-1 items-start">
						<div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-12 md:px-6 md:py-16">
							<div className="flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">
								<CheckIcon className="size-8" />
							</div>
							<div className="flex flex-col items-center gap-2 text-center">
								<h2 className="text-headline-lg text-foreground">
									Pesanan Berhasil Dibuat
								</h2>
								<p className="text-body-sm text-muted-foreground">
									Terima kasih! Pesanan kamu sudah kami
									terima. Siapkan uang tunai, kami akan
									menghubungimu untuk konfirmasi pengiriman.
								</p>
							</div>

							<div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-border">
								<div className="flex items-center justify-between">
									<span className="text-caption text-muted-foreground">
										No. Pesanan
									</span>
									<span className="text-label-md font-medium text-foreground">
										{createOrder.data?.id}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-caption text-muted-foreground">
										Total Pembayaran
									</span>
									<Price
										value={
											createOrder.data?.total_amount ?? 0
										}
										className="text-label-lg font-semibold text-primary"
									/>
								</div>

								<div className="my-1 h-px bg-border" />

								<div className="flex flex-col gap-2">
									<p className="text-label-sm text-foreground">
										Rincian belanjaan
									</p>
									{createOrder.data?.items.map((item) => (
										<div
											key={item.id}
											className="flex items-center justify-between gap-3"
										>
											<p className="line-clamp-1 flex-1 text-body-sm text-foreground">
												{item.product.name}
												<span className="text-muted-foreground">
													{' '}
													x{item.quantity}
												</span>
											</p>
											<Price
												value={item.price_at_purchase}
												className="text-label-sm"
											/>
										</div>
									))}
								</div>

								<div className="flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2.5">
									<TruckIcon className="size-4 shrink-0 text-primary" />
									<p className="text-caption text-primary">
										Bayar di rumah saat pesanan tiba (COD).
									</p>
								</div>
							</div>

							<div className="flex flex-wrap items-center justify-center gap-3">
								<Button
									size="lg"
									nativeButton={false}
									render={<Link href="/" />}
								>
									Kembali ke Beranda
								</Button>
								<Button
									variant="outline"
									size="lg"
									nativeButton={false}
									render={<Link href="/produk" />}
								>
									Belanja Lagi
								</Button>
							</div>
						</div>
					</section>
				) : (
					<section className="flex flex-1">
						<div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
							{isPending ? (
								<div className="grid items-start gap-6 lg:grid-cols-3">
									<div className="flex flex-col gap-3 lg:col-span-2">
										{Array.from({ length: 3 }).map(
											(_, i) => (
												<SkeletonRow key={i} />
											),
										)}
									</div>
									<div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-border">
										<div className="h-6 w-40 rounded-lg bg-muted" />
										<div className="h-5 w-full rounded-lg bg-muted" />
										<div className="h-10 w-full rounded-full bg-muted" />
									</div>
								</div>
							) : isError ? (
								<QueryError
									title="Checkout gagal dimuat"
									message={errorMessage}
									onRetry={() => refetch()}
								/>
							) : items.length === 0 ? (
								<div className="flex flex-col items-center gap-2">
									<EmptyState
										icon={ShoppingCartIcon}
										title="Tidak ada yang perlu dikonfirmasi"
										description="Keranjang kamu kosong. Pilih dulu produk untuk belanja."
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
												Ringkasan Pesanan
											</h2>
											<span className="text-caption text-muted-foreground">
												{totalQuantity} item
											</span>
										</div>
										{items.map((item) => (
											<div
												key={item.id}
												className="flex gap-3 rounded-xl bg-white p-4 ring-1 ring-border"
											>
												<div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted md:w-20">
													{item.product.image_url ? (
														<ProductImage
															src={
																item.product
																	.image_url
															}
															alt={
																item.product
																	.name
															}
															sizes="(max-width: 768px) 64px, 80px"
															className="h-full w-full object-cover"
														/>
													) : (
														<div className="flex h-full items-center justify-center text-muted-foreground">
															<PackageIcon className="size-6" />
														</div>
													)}
												</div>
												<div className="flex min-w-0 flex-1 flex-col gap-1 py-1">
													<p className="line-clamp-2 text-body-md text-foreground">
														{item.product.name}
													</p>
													<p className="text-caption text-muted-foreground">
														Jumlah: {item.quantity}
													</p>
													<Price
														value={
															Number(
																item.product
																	.price,
															) * item.quantity
														}
														className="mt-auto text-label-md text-primary"
													/>
												</div>
											</div>
										))}
									</div>

									<CartSummary
										totalQuantity={totalQuantity}
										totalPrice={totalPrice}
									>
										<Button
											size="lg"
											onClick={handleSubmit}
											disabled={createOrder.isPending}
											className="w-full"
										>
											{createOrder.isPending ? (
												<>
													<LoaderIcon className="size-4 animate-spin" />
													Membuat pesanan...
												</>
											) : (
												<>
													Buat Pesanan
													<ArrowRightIcon />
												</>
											)}
										</Button>
										<Button
											variant="ghost"
											size="lg"
											onClick={() =>
												router.push(
													'/keranjang-saya',
												)
											}
										>
											Kembali ke Keranjang
										</Button>
									</CartSummary>
								</div>
							)}
						</div>
					</section>
				)}
			</main>
		</RequireAuth>
	);
}
