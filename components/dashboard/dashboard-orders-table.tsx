import { EmptyState } from '@/components/empty-state';
import { Price } from '@/components/price';
import { StatusBadge } from '@/components/status-badge';
import { SectionError } from '@/components/dashboard/dashboard-state';
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
import { formatDate } from '@/lib/utils/format';
import type { Order } from '@/types/order';
import {
	ArrowRightIcon,
	CheckIcon,
	Loader2Icon,
	SendIcon,
	TruckIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { OrderAction } from './dashboard-utils';

function OrderRowsSkeleton({ rows = 3 }: { rows?: number }) {
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
					<TableCell>
						<Skeleton className="h-8 w-28 rounded-full" />
					</TableCell>
				</TableRow>
			))}
		</>
	);
}

type Props = {
	title: string;
	description: string;
	orders: Order[];
	loading: boolean;
	error: Error | null;
	onRetry: () => void;
	busyId: string | null;
	onUpdateStatus: (order: Order, action: OrderAction) => void;
	action: OrderAction;
	emptyIcon: typeof TruckIcon;
	emptyTitle: string;
};

export function DashboardOrdersTable({
	title,
	description,
	orders,
	loading,
	error,
	onRetry,
	busyId,
	onUpdateStatus,
	action,
	emptyIcon,
	emptyTitle,
}: Props) {
	return (
		<div className="flex flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-border">
			<div className="flex items-center justify-between gap-3">
				<div className="flex flex-col gap-0.5">
					<h2 className="text-headline-sm text-foreground">
						{title}
					</h2>
					<p className="text-caption text-muted-foreground">
						{description}
					</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					nativeButton={false}
					render={<Link href="/dashboard/pesanan" />}
				>
					Lihat Semua
					<ArrowRightIcon />
				</Button>
			</div>

			{error ? (
				<SectionError
					title="Gagal memuat data"
					error={error}
					onRetry={onRetry}
				/>
			) : loading ? (
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
							<OrderRowsSkeleton />
						</TableBody>
					</Table>
				</div>
			) : orders.length === 0 ? (
				<EmptyState
					icon={emptyIcon}
					title={emptyTitle}
					className="rounded-xl bg-surface-muted py-8"
				/>
			) : (
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
								const busy = busyId === order.id;
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
											{formatDate(order.created_at)}
										</TableCell>
										<TableCell>
											<Price value={order.total_amount} />
										</TableCell>
										<TableCell>
											<StatusBadge
												status={order.status}
											/>
										</TableCell>
										<TableCell className="text-right">
											<Button
												size="sm"
												disabled={busy}
												onClick={() =>
													onUpdateStatus(
														order,
														action,
													)
												}
											>
												{busy ? (
													<Loader2Icon className="size-4 animate-spin" />
												) : action.nextStatus ===
												  'delivered' ? (
													<CheckIcon />
												) : (
													<SendIcon />
												)}
												{action.label}
											</Button>
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
