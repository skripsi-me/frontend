'use client';

import { SectionError } from '@/components/dashboard/dashboard-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart';
import { formatRupiah } from '@/lib/utils/format';
import { WalletIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { CHART_DAYS, type RevenueChartPoint } from './dashboard-utils';

const chartConfig = {
	total: {
		label: 'Pendapatan',
		color: 'var(--primary)',
	},
} satisfies ChartConfig;

type Props = {
	data: RevenueChartPoint[];
	loading: boolean;
	error: Error | null;
	onRetry: () => void;
	rangeLabel: string;
};

export function DashboardRevenueChart({
	data,
	loading,
	error,
	onRetry,
	rangeLabel,
}: Props) {
	return (
		<div className="flex flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-border">
			<div className="flex flex-col gap-0.5">
				<h2 className="text-headline-sm text-foreground">
					Pendapatan {CHART_DAYS} Hari
				</h2>
				<p className="text-caption text-muted-foreground">
					Total transaksi per hari
				</p>
			</div>

			{error ? (
				<SectionError
					title="Gagal memuat grafik"
					error={error}
					onRetry={onRetry}
				/>
			) : loading ? (
				<div className="flex h-[280px] items-end gap-1.5">
					{Array.from({ length: CHART_DAYS }).map((_, i) => (
						<div key={i} className="flex flex-1 flex-col gap-1">
							<Skeleton className="h-[260px] flex-1 rounded-t" />
						</div>
					))}
				</div>
			) : (
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[280px] w-full"
				>
					<BarChart
						data={data}
						accessibilityLayer
						margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							tickMargin={10}
							interval="preserveStartEnd"
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									formatter={(value) =>
										formatRupiah(Number(value))
									}
								/>
							}
						/>
						<Bar
							dataKey="total"
							fill="var(--color-total)"
							radius={[4, 4, 0, 0]}
							maxBarSize={48}
						/>
					</BarChart>
				</ChartContainer>
			)}

			<div className="flex items-center justify-between gap-2">
				<p className="text-caption text-muted-foreground tabular-nums">
					{rangeLabel}
				</p>
				<span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
					<WalletIcon className="size-4 text-primary" />
					Rupiah
				</span>
			</div>
		</div>
	);
}
