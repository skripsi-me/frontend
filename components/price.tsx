import { formatRupiah } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

export function Price({
	value,
	className,
}: {
	value: string | number;
	className?: string;
}) {
	return (
		<span className={cn('text-label-md text-foreground', className)}>
			{formatRupiah(value)}
		</span>
	);
}
