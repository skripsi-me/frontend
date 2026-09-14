'use client';

import { RequireAuth } from '@/components/auth/require-auth';
import { Price } from '@/components/price';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrder } from '@/hooks/order.hook';
import { isApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDate, formatRupiah } from '@/lib/utils/format';
import type { Order } from '@/types/order';
import {
	CheckIcon,
	ChevronLeftIcon,
	MapPinIcon,
	PackageIcon,
	RefreshCcwIcon,
	TruckIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const STATUS_STEPS = [
	{ key: 'pending', label: 'Pesanan Dibuat', icon: PackageIcon },
	{ key: 'shipped', label: 'Sedang Dikirim', icon: TruckIcon },
	{ key: 'delivered', label: 'Selesai', icon: CheckIcon },
] as const;

function statusIndex(status: string): number {
	if (status === 'delivered') return 3;
	if (status === 'shipped') return 2;
	return 1;
}

function DetailSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			<Skeleton className="h-10 w-40 rounded-lg" />
			<Skeleton className="h-40 w-full rounded-2xl" />
			<Skeleton className="h-52 w-full rounded-2xl" />
		</div>
	);
}

function StatusTimeline({ status }: { status: Order['status'] }) {
	const index = statusIndex(status);

	return (
		<ol className="flex items-center gap-2">
			{STATUS_STEPS.map((step, i) => {
				const Icon = step.icon;
				const done = i < index;
				const active = i === index - 1;
				return (
					<li
						key={step.key}
						className={cn(
							'flex items-center gap-2',
							i < STATUS_STEPS.length - 1 && 'flex-1',
						)}
					>
						<div className="flex flex-col items-center gap-1.5">
							<div
								className={cn(
									'flex size-8 shrink-0 items-center justify-center rounded-full ring-1 transition-colors',
									done &&
										'bg-primary text-primary-foreground ring-primary',
									!done &&
										active &&
										'bg-primary/10 text-primary ring-primary',
									!done &&
										!active &&
										'bg-surface-muted text-muted-foreground ring-border',
								)}
							>
								{done && i < STATUS_STEPS.length - 1 ? (
									<CheckIcon className="size-4" />
								) : (
									<Icon className="size-4" />
								)}
							</div>
							<span
								className={cn(
									'text-caption whitespace-nowrap',
									done || active
										? 'font-medium text-foreground'
										: 'text-muted-foreground',
								)}
							>
								{step.label}
							</span>
						</div>
						{i < STATUS_STEPS.length - 1 && (
							<div
								className={cn(
									'mb-6 h-0.5 flex-1 rounded-full',
									i < index ? 'bg-primary' : 'bg-border',
								)}
							/>
						)}
					</li>
				);
			})}
		</ol>
	);
}

export function RiwayatDetailContent() {
	const params = useParams<{ id: string }>();
	const {
		data: order,
		isPending,
		isError,
		error,
		refetch,
	} = useOrder(params.id);

	const errorMessage = isApiError(error)
		? error.message
		: 'Terjadi kesalahan saat memuat detail transaksi.';

	return (
		<RequireAuth>
			<main className="flex flex-1 flex-col">
				<section className="border-b border-border bg-surface-muted">
					<div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-8 md:px-6 md:py-10">
						<Button
							variant="ghost"
							size="sm"
							className="w-fit -ml-2"
							nativeButton={false}
							render={<Link href="/profil/riwayat-transaksi" />}
						>
							<ChevronLeftIcon />
							Kembali ke Riwayat
						</Button>
						<h1 className="text-headline-lg text-foreground">
							Detail Transaksi
						</h1>
					</div>
				</section>

				<section className="flex flex-1">
					<div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12">
						{isPending ? (
							<DetailSkeleton />
						) : isError ? (
							<Alert
								variant="destructive"
								className="mx-auto max-w-2xl"
							>
								<AlertTitle>Detail gagal dimuat</AlertTitle>
								<AlertDescription>
									{errorMessage}
								</AlertDescription>
								<div className="pt-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => refetch()}
									>
										<RefreshCcwIcon />
										Coba lagi
									</Button>
								</div>
							</Alert>
						) : order ? (
							<div className="flex flex-col gap-4">
								{order.status === 'cancelled' && (
									<Alert variant="destructive">
										<AlertTitle>
											Pesanan Dibatalkan
										</AlertTitle>
										<AlertDescription>
											Pesanan ini dibatalkan dan tidak
											dilanjutkan proses pengiriman.
										</AlertDescription>
									</Alert>
								)}

								<div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-border">
									<div className="flex flex-wrap items-center justify-between gap-3">
										<div className="flex flex-col gap-1">
											<StatusBadge
												status={order.status}
											/>
											<span className="text-label-sm text-foreground">
												No. Pesanan: #
												{order.id.slice(0, 8)}
											</span>
											<span className="text-caption text-muted-foreground">
												{formatDate(order.created_at)}
											</span>
										</div>
										<Price
											value={order.total_amount}
											className="text-headline-sm font-semibold text-primary"
										/>
									</div>

									{order.status !== 'cancelled' && (
										<>
											<div className="h-px bg-border" />
											<StatusTimeline
												status={order.status}
											/>
										</>
									)}
								</div>

								<div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-border">
									<h2 className="text-headline-sm text-foreground">
										Rincian Belanja
									</h2>
									<ul className="flex flex-col gap-3">
										{order.items.map((item) => (
											<li
												key={item.id}
												className="flex items-start justify-between gap-3"
											>
												<div className="flex min-w-0 flex-col gap-0.5">
													<p className="text-body-md text-foreground">
														{item.product.name}
													</p>
													<p className="text-caption text-muted-foreground">
														{item.quantity} x{' '}
														{formatRupiah(
															item.price_at_purchase,
														)}
													</p>
												</div>
												<Price
													value={
														Number(
															item.price_at_purchase,
														) * item.quantity
													}
													className="shrink-0 text-label-md"
												/>
											</li>
										))}
									</ul>
									<div className="h-px bg-border" />
									<div className="flex items-center justify-between">
										<span className="text-label-md text-foreground">
											Total Pembayaran
										</span>
										<Price
											value={order.total_amount}
											className="text-label-lg font-semibold text-primary"
										/>
									</div>
								</div>

								<div className="flex items-start gap-2 rounded-xl bg-primary/10 px-4 py-3">
									<MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
									<p className="text-caption text-primary">
										Pesanan diantar ke alamat pengiriman
										kamu. Bayar tunai saat barang tiba
										(COD).
									</p>
								</div>

								<Button
									variant="outline"
									size="lg"
									nativeButton={false}
									render={
										<Link href="/profil/riwayat-transaksi" />
									}
								>
									<ChevronLeftIcon />
									Kembali ke Riwayat
								</Button>
							</div>
						) : null}
					</div>
				</section>
			</main>
		</RequireAuth>
	);
}
