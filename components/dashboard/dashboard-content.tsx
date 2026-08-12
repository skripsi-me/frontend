'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useOrderReport, useOrders, useUpdateOrderStatus } from '@/hooks/order.hook';
import { useBestSellers, useProducts, useUpdateProduct } from '@/hooks/product.hook';
import { isApiError } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import {
	AlertTriangleIcon,
	ClipboardListIcon,
	TruckIcon,
	WalletIcon,
} from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { DashboardBestSellersSection } from './dashboard-best-sellers-section';
import { DashboardLowStockSection } from './dashboard-low-stock-section';
import { DashboardOrdersTable } from './dashboard-orders-table';
import { DashboardRevenueChart } from './dashboard-revenue-chart';
import { StatCard } from './dashboard-stat-card';
import {
	BEST_SELLERS_LIMIT,
	LOW_STOCK_FETCH_LIMIT,
	LOW_STOCK_THRESHOLD,
	ORDERS_LIMIT,
	PENDING_ACTION,
	SHIPPED_ACTION,
	STATUS_VERB,
	buildChartData,
	formatCurrency,
	getNowSnapshot,
	monthBounds,
	subscribeNow,
	sumBetween,
	type OrderAction,
} from './dashboard-utils';

export function DashboardContent() {
	const { user, isLoading: authLoading } = useAuth();
	const today = useSyncExternalStore(
		subscribeNow,
		getNowSnapshot,
		getNowSnapshot,
	);
	const [busyId, setBusyId] = useState<string | null>(null);
	const [stockBusyId, setStockBusyId] = useState<string | null>(null);

	const pendingQuery = useOrders({
		page: 1,
		limit: ORDERS_LIMIT,
		status: 'pending',
	});
	const shippedQuery = useOrders({
		page: 1,
		limit: ORDERS_LIMIT,
		status: 'shipped',
	});
	const reportQuery = useOrderReport();
	const productsQuery = useProducts({
		page: 1,
		limit: LOW_STOCK_FETCH_LIMIT,
		stock: 'asc',
	});
	const bestSellersQuery = useBestSellers(BEST_SELLERS_LIMIT);
	const updateStatus = useUpdateOrderStatus();
	const updateProduct = useUpdateProduct();

	const pendingOrders = pendingQuery.data?.data ?? [];
	const shippedOrders = shippedQuery.data?.data ?? [];
	const pendingTotal = pendingQuery.data?.meta.total ?? 0;
	const shippedTotal = shippedQuery.data?.meta.total ?? 0;

	const reportData = reportQuery.data ?? [];
	const currentBounds = today ? monthBounds(today) : null;
	const previousBounds = today ? monthBounds(today, -1) : null;
	const currentRevenue = currentBounds
		? sumBetween(reportData, currentBounds.start, currentBounds.end)
		: 0;
	const previousRevenue = previousBounds
		? sumBetween(reportData, previousBounds.start, previousBounds.end)
		: 0;
	const revenueDelta =
		today && previousRevenue > 0
			? ((currentRevenue - previousRevenue) / previousRevenue) * 100
			: null;
	const chartData = today ? buildChartData(today, reportData) : [];
	const chartRangeLabel = today
		? `${new Intl.DateTimeFormat('id-ID', {
				day: 'numeric',
				month: 'short',
			}).format(
				new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() - 13,
				),
			)} – ${new Intl.DateTimeFormat('id-ID', {
				day: 'numeric',
				month: 'short',
			}).format(today)}`
		: '';
	const greetingDate = today
		? new Intl.DateTimeFormat('id-ID', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}).format(today)
		: '';

	const lowStockProducts = (productsQuery.data?.data ?? []).filter(
		(product) => product.stock <= LOW_STOCK_THRESHOLD,
	);

	async function handleUpdateStatus(order: Order, action: OrderAction) {
		if (busyId) return;
		setBusyId(order.id);
		try {
			await updateStatus.mutateAsync({
				id: order.id,
				data: { status: action.nextStatus },
			});
			toast.success(
				`Pesanan #${order.id.slice(0, 8)} ${STATUS_VERB[action.nextStatus]}.`,
			);
		} catch (error) {
			toast.error(
				isApiError(error)
					? error.message
					: 'Gagal memperbarui status pesanan.',
			);
		} finally {
			setBusyId(null);
		}
	}

	async function handleQuickStock(product: Product) {
		if (stockBusyId) return;
		setStockBusyId(product.id);
		try {
			await updateProduct.mutateAsync({
				id: product.id,
				data: { stock: product.stock + 1 },
			});
			toast.success(
				`Stok "${product.name}" ditambah menjadi ${product.stock + 1}.`,
			);
		} catch (error) {
			toast.error(
				isApiError(error) ? error.message : 'Gagal menambah stok produk.',
			);
		} finally {
			setStockBusyId(null);
		}
	}

	return (
		<div className="flex flex-1 flex-col">
			<div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6 md:py-6">
				<div className="flex flex-col gap-1 pb-6">
					<h1 className="text-headline-lg text-foreground">
						{authLoading
							? 'Halo!'
							: `Halo, ${user?.name?.split(' ')[0] ?? 'Admin'}`}
					</h1>
					<p className="text-body-sm text-muted-foreground">
						{greetingDate}
						{greetingDate && ' · '}Pantau pesanan masuk, pengiriman,
						dan stok produk.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<StatCard
						icon={ClipboardListIcon}
						label="Pesanan Baru"
						value={String(pendingTotal)}
						href="/dashboard/pesanan"
						loading={pendingQuery.isPending}
					/>
					<StatCard
						icon={TruckIcon}
						label="Sedang Dikirim"
						value={String(shippedTotal)}
						href="/dashboard/pesanan"
						loading={shippedQuery.isPending}
					/>
					<StatCard
						icon={WalletIcon}
						label="Pendapatan Bulan Ini"
						value={formatCurrency(currentRevenue)}
						href="/dashboard/pesanan"
						loading={reportQuery.isPending}
						delta={revenueDelta}
					/>
					<StatCard
						icon={AlertTriangleIcon}
						label="Produk Stok Menipis"
						value={String(lowStockProducts.length)}
						href="/dashboard/produk"
						loading={productsQuery.isPending}
					/>
				</div>

				<div className="grid items-start gap-6 pt-8 lg:grid-cols-2">
					<DashboardOrdersTable
						title="Pesanan Baru"
						description="Segera proses pesanan yang baru masuk."
						orders={pendingOrders}
						loading={pendingQuery.isPending}
						error={pendingQuery.error}
						onRetry={() => pendingQuery.refetch()}
						busyId={busyId}
						onUpdateStatus={handleUpdateStatus}
						action={PENDING_ACTION}
						emptyIcon={ClipboardListIcon}
						emptyTitle="Tidak ada pesanan baru"
					/>
					<DashboardOrdersTable
						title="Sedang Dikirim"
						description="Tandai selesai saat pesanan sudah sampai."
						orders={shippedOrders}
						loading={shippedQuery.isPending}
						error={shippedQuery.error}
						onRetry={() => shippedQuery.refetch()}
						busyId={busyId}
						onUpdateStatus={handleUpdateStatus}
						action={SHIPPED_ACTION}
						emptyIcon={TruckIcon}
						emptyTitle="Tidak ada pengiriman aktif"
					/>
				</div>

				<div className="pt-6">
					<DashboardRevenueChart
						data={chartData}
						loading={!today || reportQuery.isPending}
						error={reportQuery.error}
						onRetry={() => reportQuery.refetch()}
						rangeLabel={chartRangeLabel}
					/>
				</div>

				<div className="grid items-start gap-6 pt-6 lg:grid-cols-2">
					<DashboardLowStockSection
						products={lowStockProducts}
						loading={productsQuery.isPending}
						error={productsQuery.error}
						onRetry={() => productsQuery.refetch()}
						stockBusyId={stockBusyId}
						onQuickStock={handleQuickStock}
					/>
					<DashboardBestSellersSection
						products={bestSellersQuery.data ?? []}
						loading={bestSellersQuery.isPending}
						error={bestSellersQuery.error}
						onRetry={() => bestSellersQuery.refetch()}
					/>
				</div>
			</div>
		</div>
	);
}