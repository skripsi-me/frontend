import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from 'lucide-react';
import Link from 'next/link';

export function StatCard({
	icon: Icon,
	label,
	value,
	href,
	loading = false,
	delta = null,
}: {
	icon: typeof WalletIcon;
	label: string;
	value: string;
	href?: string;
	loading?: boolean;
	delta?: number | null;
}) {
	const content = (
		<div className="flex flex-col gap-3 rounded-xl bg-white p-5 ring-1 ring-border transition-shadow hover:shadow-sm">
			<div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-green-700">
				<Icon className="size-5" />
			</div>
			{loading ? (
				<Skeleton className="h-7 w-20" />
			) : (
				<p className="text-headline-md font-semibold tabular-nums text-foreground">
					{value}
				</p>
			)}
			<p className="text-caption text-muted-foreground">{label}</p>
			{!loading && delta != null && (
				<p
					className={cn(
						'flex items-center gap-1 text-xs font-medium tabular-nums',
						delta >= 0 ? 'text-success' : 'text-destructive',
					)}
				>
					{delta >= 0 ? (
						<TrendingUpIcon className="size-3.5" />
					) : (
						<TrendingDownIcon className="size-3.5" />
					)}
					{Math.abs(delta).toFixed(1)}% vs bulan lalu
				</p>
			)}
		</div>
	);

	if (!href) return content;
	return (
		<Link
			href={href}
			className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		>
			{content}
		</Link>
	);
}
