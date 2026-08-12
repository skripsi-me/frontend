import type { OrderReportItem, OrderStatus } from '@/types/order';

export const LOW_STOCK_THRESHOLD = 5;
export const URGENT_STOCK_THRESHOLD = 3;
export const ORDERS_LIMIT = 5;
export const LOW_STOCK_FETCH_LIMIT = 50;
export const LOW_STOCK_LIST_LIMIT = 10;
export const BEST_SELLERS_LIMIT = 8;
export const CHART_DAYS = 14;

export const STATUS_VERB: Record<string, string> = {
	shipped: 'dikirim',
	delivered: 'selesai',
};

export type OrderAction = {
	nextStatus: OrderStatus;
	label: string;
};

export const PENDING_ACTION: OrderAction = {
	nextStatus: 'shipped',
	label: 'Kirim',
};

export const SHIPPED_ACTION: OrderAction = {
	nextStatus: 'delivered',
	label: 'Selesai',
};

export function toDateString(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function monthBounds(from: Date, startMonthOffset = 0) {
	const start = new Date(
		from.getFullYear(),
		from.getMonth() + startMonthOffset,
		1,
	);
	const end = new Date(
		from.getFullYear(),
		from.getMonth() + 1 + startMonthOffset,
		0,
	);
	return { start: toDateString(start), end: toDateString(end) };
}

export function sumBetween(items: OrderReportItem[], start: string, end: string) {
	return items
		.filter((item) => item.date >= start && item.date <= end)
		.reduce((sum, item) => sum + Number(item.total_amount), 0);
}

export const formatCurrency = (value: number) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(value);

export type RevenueChartPoint = {
	key: string;
	label: string;
	total: number;
};

export function buildChartData(
	from: Date,
	items: OrderReportItem[],
): RevenueChartPoint[] {
	const totals = new Map(
		items.map((item) => [item.date, Number(item.total_amount)]),
	);
	const days: RevenueChartPoint[] = [];
	for (let i = CHART_DAYS - 1; i >= 0; i--) {
		const date = new Date(
			from.getFullYear(),
			from.getMonth(),
			from.getDate() - i,
		);
		const key = toDateString(date);
		days.push({
			key,
			label: new Intl.DateTimeFormat('id-ID', {
				day: 'numeric',
				month: 'short',
			}).format(date),
			total: totals.get(key) ?? 0,
		});
	}
	return days;
}

const nowListeners = new Set<() => void>();
export const currentDate = new Date();

export function subscribeNow(callback: () => void) {
	nowListeners.add(callback);
	return () => {
		nowListeners.delete(callback);
	};
}

export function getNowSnapshot() {
	return currentDate;
}