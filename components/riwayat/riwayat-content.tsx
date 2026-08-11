'use client';

import { RequireAuth } from '@/components/auth/require-auth';
import { EmptyState } from '@/components/empty-state';
import { Price } from '@/components/price';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyOrders } from '@/hooks/order.hook';
import { isApiError } from '@/lib/api';
import { formatDate } from '@/lib/utils/format';
import type { Order } from '@/types/order';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ReceiptTextIcon,
	RefreshCcwIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const PAGE_SIZE = 5;

function OrderCardSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-border">
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-5 w-20 rounded-full" />
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-3 w-28" />
				</div>
				<Skeleton className="size-5" />
			</div>
			<div className="flex items-end justify-between gap-3">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-5 w-24" />
			</div>
		</div>
	);
}

function OrderCard({ order }: { order: Order }) {
	return (
		<Link
			href={`/profil/riwayat-transaksi/${order.id}`}
			className="block rounded-2xl bg-white p-5 ring-1 ring-border transition-shadow hover:shadow-sm"
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<StatusBadge status={order.status} />
					<span className="text-label-sm text-foreground">
						No. Pesanan: #{order.id.slice(0, 8)}
					</span>
					<span className="text-caption text-muted-foreground">
						{formatDate(order.created_at)}
					</span>
				</div>
				<ChevronRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground" />
			</div>
			<div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
				<Price
					value={order.total_amount}
					className="text-label-lg font-semibold text-primary"
				/>
			</div>
		</Link>
	);
}

export function RiwayatContent() {
	const [page, setPage] = useState(1);
	const { data, isPending, isError, error, refetch } = useMyOrders({
		page,
		limit: PAGE_SIZE,
	});

	const orders = data?.data ?? [];
	const totalPages = data?.meta.total_pages ?? 1;

	const errorMessage = isApiError(error)
		? error.message
		: 'Terjadi kesalahan saat memuat riwayat.';

	return (
		<RequireAuth>
			<main className="flex flex-1 flex-col">
				<section className="border-b border-border bg-surface-muted">
					<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 md:px-6 md:py-14">
						<h1 className="text-headline-lg text-foreground">
							Riwayat Transaksi
						</h1>
						<p className="text-body-sm text-muted-foreground">
							Pantau status pesanan keluarga di sini. Klik pesanan
							untuk melihat detailnya.
						</p>
					</div>
				</section>

				<section className="flex flex-1">
					<div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12">
						{isPending ? (
							<div className="flex flex-col gap-3">
								{Array.from({ length: 3 }).map((_, i) => (
									<OrderCardSkeleton key={i} />
								))}
							</div>
						) : isError ? (
							<Alert
								variant="destructive"
								className="mx-auto max-w-2xl"
							>
								<AlertTitle>Riwayat gagal dimuat</AlertTitle>
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
						) : orders.length === 0 ? (
							<div className="flex flex-col items-center gap-2">
								<EmptyState
									icon={ReceiptTextIcon}
									title="Belum ada transaksi"
									description="Pesanan yang sudah kamu buat akan tampil di sini."
									className="rounded-2xl bg-white ring-1 ring-border"
								/>
								<Button
									size="lg"
									nativeButton={false}
									render={<Link href="/produk" />}
								>
									Mulai Belanja
									<ChevronRightIcon />
								</Button>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								{orders.map((order) => (
									<OrderCard key={order.id} order={order} />
								))}
							</div>
						)}

						{!isPending && !isError && totalPages > 1 && (
							<div className="flex items-center justify-between gap-3 pt-6">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setPage((value) =>
											Math.max(1, value - 1),
										)
									}
									disabled={page <= 1}
								>
									<ChevronLeftIcon />
									Sebelumnya
								</Button>
								<span className="text-caption text-muted-foreground">
									Halaman {page} dari {totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setPage((value) =>
											Math.min(totalPages, value + 1),
										)
									}
									disabled={page >= totalPages}
								>
									Berikutnya
									<ChevronRightIcon />
								</Button>
							</div>
						)}
					</div>
				</section>
			</main>
		</RequireAuth>
	);
}
