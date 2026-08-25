import { Badge } from '@/components/ui/badge';
import { LOW_STOCK_THRESHOLD } from '@/components/dashboard/dashboard-utils';
import { cn } from '@/lib/utils';

export function StockBadge({
	stock,
	className,
}: {
	stock: number;
	className?: string;
}) {
	if (stock <= 0) {
		return (
			<Badge
				variant="outline"
				className={cn('bg-destructive/10 text-destructive', className)}
			>
				Habis
			</Badge>
		);
	}
	if (stock <= LOW_STOCK_THRESHOLD) {
		return (
			<Badge
				variant="outline"
				className={cn('bg-warning/10 text-warning', className)}
			>
				{stock} tersisa
			</Badge>
		);
	}
	return (
		<Badge
			variant="outline"
			className={cn('bg-success/10 text-success', className)}
		>
			Stok {stock}
		</Badge>
	);
}
