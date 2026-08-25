import { cn } from '@/lib/utils';

/**
 * Skeleton khusus halaman penelitian.
 *
 * Animasi berbasis `background-color`, BUKAN murni compositor-only
 * (`opacity`/`transform`) — sehingga menjadi indikator blocking yang nyata.
 * Sumber pengukuran FPS resmi tetap loop requestAnimationFrame.
 */
export function ResearchSkeleton({
	count = 8,
	className,
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div
			data-testid="research-skeleton"
			className={cn(
				'grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4',
				className,
			)}
		>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="flex flex-col gap-3"
					data-testid="research-skeleton-item"
				>
					<div className="animate-research-skeleton aspect-square w-full rounded-xl" />
					<div className="animate-research-skeleton h-4 w-3/4 rounded-md" />
					<div className="animate-research-skeleton h-4 w-1/2 rounded-md" />
				</div>
			))}
		</div>
	);
}