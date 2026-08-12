import { Badge } from '@/components/ui/badge';
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
				className={cn('bg-destructive/10 text-red-700', className)}
			>
				Habis
			</Badge>
		);
	}
	if (stock <= 5) {
		return (
			<Badge
				variant="outline"
				className={cn('bg-warning/10 text-amber-700', className)}
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
