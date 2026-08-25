'use client';

import { EmptyState } from '@/components/empty-state';
import { PaginationNav } from '@/components/pagination-nav';
import { Price } from '@/components/price';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useOrders } from '@/hooks/order.hook';
import { useOrderStatusUpdate } from '@/hooks/order-status.hook';
import { isApiError } from '@/lib/api';
import { formatDate } from '@/lib/utils/format';
import type { Order, OrderStatus } from '@/types/order';
import { Loader2Icon, PackageSearchIcon, RefreshCcwIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
	{ value: '', label: 'Semua status' },
	{ value: 'pending', label: 'Menunggu' },
	{ value: 'shipped', label: 'Dikirim' },
	{ value: 'delivered', label: 'Selesai' },
	{ value: 'cancelled', label: 'Dibatalkan' },
];

function TableSkeleton({ rows = 6 }: { rows?: number }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, i) => (
				<TableRow key={i}>
					<TableCell>
						<Skeleton className="h-4 w-24" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-32" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-5 w-16 rounded-full" />
					</TableCell>
				</TableRow>
			))}
		</>
	);
}

export function PesananAdminContent() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = Math.max(1, Number(searchParams.get('page')) || 1);
	const status = (searchParams.get('status') ?? '') as OrderStatus | '';

	const { data, isPending, isError, error, refetch } = useOrders({
		page,
		limit: PAGE_SIZE,
		status: status || undefined,
	});
	const { mutation: updateStatus, update: handleUpdateStatus } =
		useOrderStatusUpdate();

	function updateFilter(key: 'status', value: string) {
		const params = new URLSearchParams(searchParams.toString());
		if (value) params.set(key, value);
		else params.delete(key);
		params.set('page', '1');
		router.replace(`${pathname}?${params.toString()}`);
	}

	function buildHref(pageNumber: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', String(pageNumber));
		return `${pathname}?${params.toString()}`;
	}

	const orders = data?.data ?? [];
	const totalPages = data?.meta.total_pages ?? 1;
	const total = data?.meta.total ?? orders.length;

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
			<div className="flex flex-col gap-1 pb-6">
				<h1 className="text-headline-lg text-foreground">
					Kelola Pesanan
				</h1>
				<p className="text-body-sm text-muted-foreground">
					Pantau dan proses pesanan masuk.
				</p>
			</div>

			<div className="pb-6">
				<Select
					value={status}
					onValueChange={(value) =>
						updateFilter('status', value ?? '')
					}
				>
					<SelectTrigger
						size="default"
						className="w-full sm:w-52"
						aria-label="Filter status"
					>
						<SelectValue placeholder="Semua status" />
					</SelectTrigger>
					<SelectContent>
						{STATUS_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-1 flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-border">
				{isError ? (
					<Alert variant="destructive">
						<AlertTitle>Gagal memuat pesanan</AlertTitle>
						<AlertDescription>
							{isApiError(error)
								? error.message
								: 'Terjadi kesalahan. Coba lagi.'}
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
				) : isPending ? (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>No. Pesanan</TableHead>
									<TableHead>Tanggal</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">
										Aksi
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableSkeleton />
							</TableBody>
						</Table>
					</div>
				) : orders.length === 0 ? (
					<EmptyState
						icon={PackageSearchIcon}
						title="Tidak ada pesanan"
						description={
							status
								? `Tidak ada pesanan berstatus ini.`
								: 'Belum ada pesanan masuk.'
						}
						className="rounded-xl bg-surface-muted py-10"
					/>
				) : (
					<>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>No. Pesanan</TableHead>
										<TableHead>Tanggal</TableHead>
										<TableHead>Total</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">
											Aksi
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orders.map((order) => {
										const busy =
											updateStatus.isPending &&
											updateStatus.variables?.id ===
												order.id;
										return (
											<TableRow key={order.id}>
												<TableCell>
													<Link
														href={`/dashboard/pesanan/${order.id}`}
														className="font-medium text-primary hover:underline"
													>
														#{order.id.slice(0, 8)}
													</Link>
												</TableCell>
												<TableCell className="text-muted-foreground">
													{formatDate(
														order.created_at,
													)}
												</TableCell>
												<TableCell>
													<Price
														value={
															order.total_amount
														}
													/>
												</TableCell>
												<TableCell>
													<StatusBadge
														status={order.status}
													/>
												</TableCell>
												<TableCell className="text-right">
													{order.status ===
														'pending' && (
														<Button
															size="sm"
															disabled={busy}
															onClick={() =>
																handleUpdateStatus(
																	order.id,
																	'shipped',
																	'dikirim',
																)
															}
														>
															{busy && (
																<Loader2Icon className="size-4 animate-spin" />
															)}
															Kirim
														</Button>
													)}
													{order.status ===
														'shipped' && (
														<Button
															size="sm"
															disabled={busy}
															onClick={() =>
																handleUpdateStatus(
																	order.id,
																	'delivered',
																	'selesai',
																)
															}
														>
															{busy && (
																<Loader2Icon className="size-4 animate-spin" />
															)}
															Beri Selesai
														</Button>
													)}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>

						<div className="flex flex-col gap-2">
							<PaginationNav
								page={page}
								totalPages={totalPages}
								buildHref={buildHref}
							/>
							<p className="text-center text-caption text-muted-foreground">
								Menampilkan {orders.length} dari {total} pesanan
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
