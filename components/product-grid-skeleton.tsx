import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function ProductGridSkeleton({
	count = 4,
	className,
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4',
				className,
			)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex flex-col gap-3">
					<Skeleton className="aspect-square w-full rounded-xl" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
				</div>
			))}
		</div>
	);
}
