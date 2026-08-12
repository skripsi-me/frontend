'use client';

import { EmptyState } from '@/components/empty-state';
import { Price } from '@/components/price';
import { StatusBadge } from '@/components/status-badge';
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
import { useOrder, useUpdateOrderStatus } from '@/hooks/order.hook';
import { isApiError } from '@/lib/api';
import { formatDate, formatRupiah } from '@/lib/utils/format';
import type { OrderStatus } from '@/types/order';
import {
	ArrowLeftIcon,
	CheckIcon,
	Loader2Icon,
	RefreshCcwIcon,
	SendIcon,
	XCircleIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

function OrderInfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<span className="text-caption text-muted-foreground">{label}</span>
			<span className="text-body-sm font-medium text-foreground">
				{value}
			</span>
		</div>
	);
}

export function PesananAdminDetail({ orderId }: { orderId: string }) {
	const {
		data: order,
		isPending,
		isError,
		error,
		refetch,
	} = useOrder(orderId);
	const updateStatus = useUpdateOrderStatus();
	const [busy, setBusy] = useState<OrderStatus | null>(null);

	async function handleUpdateStatus(status: OrderStatus, verb: string) {
		if (busy) return;
		setBusy(status);
		try {
			await updateStatus.mutateAsync({
				id: orderId,
				data: { status },
			});
			toast.success(`Pesanan #${orderId.slice(0, 8)} ${verb}.`);
		} catch (err) {
			toast.error(
				isApiError(err)
					? err.message
					: 'Gagal memperbarui status pesanan.',
			);
		} finally {
			setBusy(null);
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
			<div className="flex items-center gap-3 pb-6">
				<Button
					variant="ghost"
					size="icon-sm"
					nativeButton={false}
					render={<Link href="/dashboard/pesanan" />}
					aria-label="Kembali ke daftar pesanan"
				>
					<ArrowLeftIcon />
				</Button>
				<h1 className="text-headline-lg text-foreground">
					Detail Pesanan
				</h1>
			</div>

			{isError ? (
				<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
					<EmptyState
						icon={RefreshCcwIcon}
						title="Gagal memuat pesanan"
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
							render={<Link href="/dashboard/pesanan" />}
						>
							Kembali ke daftar
						</Button>
						<Button onClick={() => refetch()}>
							<RefreshCcwIcon />
							Coba lagi
						</Button>
					</div>
				</div>
			) : isPending || !order ? (
				<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-64" />
					<Skeleton className="h-40 w-full" />
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div className="flex flex-col gap-1">
								<h2 className="text-headline-md text-foreground">
									#{order.id.slice(0, 8)}
								</h2>
								<p className="text-caption text-muted-foreground">
									{formatDate(order.created_at)}
								</p>
							</div>
							<StatusBadge status={order.status} />
						</div>

						<div className="flex flex-col gap-2 rounded-xl bg-surface-muted p-4">
							<OrderInfoRow label="ID Pesanan" value={order.id} />
							<OrderInfoRow
								label="Total"
								value={formatRupiah(order.total_amount)}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
						<h2 className="text-headline-sm text-foreground">
							Item Pesanan
						</h2>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Produk</TableHead>
										<TableHead className="text-right">
											Jumlah
										</TableHead>
										<TableHead className="text-right">
											Harga
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{order.items.map((item) => (
										<TableRow key={item.id}>
											<TableCell className="font-medium text-foreground">
												{item.product.name}
											</TableCell>
											<TableCell className="text-right tabular-nums">
												{item.quantity}
											</TableCell>
											<TableCell className="text-right">
												<Price
													value={
														item.price_at_purchase
													}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>

					{order.status !== 'cancelled' &&
						order.status !== 'delivered' && (
							<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
								<h2 className="text-headline-sm text-foreground">
									Perbarui Status
								</h2>
								<div className="flex flex-wrap gap-3">
									{order.status === 'pending' && (
										<>
											<Button
												disabled={Boolean(busy)}
												onClick={() =>
													handleUpdateStatus(
														'shipped',
														'dikirim',
													)
												}
											>
												{busy === 'shipped' ? (
													<Loader2Icon className="animate-spin" />
												) : (
													<SendIcon />
												)}
												Tandai Dikirim
											</Button>
											<Button
												variant="outline"
												disabled={Boolean(busy)}
												onClick={() =>
													handleUpdateStatus(
														'cancelled',
														'dibatalkan',
													)
												}
											>
												{busy === 'cancelled' ? (
													<Loader2Icon className="animate-spin" />
												) : (
													<XCircleIcon />
												)}
												Batalkan Pesanan
											</Button>
										</>
									)}
									{order.status === 'shipped' && (
										<Button
											disabled={Boolean(busy)}
											onClick={() =>
												handleUpdateStatus(
													'delivered',
													'selesai',
												)
											}
										>
											{busy === 'delivered' ? (
												<Loader2Icon className="animate-spin" />
											) : (
												<CheckIcon />
											)}
											Tandai Selesai
										</Button>
									)}
								</div>
							</div>
						)}
				</div>
			)}
		</div>
	);
}
