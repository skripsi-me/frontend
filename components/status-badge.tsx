import { Badge } from '@/components/ui/badge';
import { formatStatus } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

const STATUS_CLASS: Record<string, string> = {
	pending: 'bg-warning/10 text-amber-700',
	shipped: 'bg-primary-soft text-green-700',
	delivered: 'bg-success/10 text-success',
	cancelled: 'bg-secondary text-on-surface-muted',
};

export function StatusBadge({
	status,
	className,
}: {
	status: string;
	className?: string;
}) {
	return (
		<Badge
			variant="outline"
			className={cn(STATUS_CLASS[status], className)}
		>
			{formatStatus(status)}
		</Badge>
	);
}
