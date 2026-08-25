import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export type PaginationNavProps = {
	page: number;
	totalPages: number;
	buildHref: (page: number) => string;
	className?: string;
};

function getVisiblePages(page: number, totalPages: number): number[] {
	if (totalPages <= 3) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const pages = new Set<number>([1, totalPages]);

	if (page <= 3) {
		pages.add(2);
		pages.add(3);
		if (page === 3) pages.add(4);
	} else if (page === totalPages) {
		pages.add(totalPages - 2);
		pages.add(totalPages - 1);
	} else {
		pages.add(page - 1);
		pages.add(page);
		pages.add(page + 1);
	}

	return Array.from(pages)
		.filter((p) => p >= 1 && p <= totalPages)
		.sort((a, b) => a - b);
}

export function PaginationNav({
	page,
	totalPages,
	buildHref,
	className,
}: PaginationNavProps) {
	if (totalPages <= 1) {
		return null;
	}

	const visiblePages = getVisiblePages(page, totalPages);
	const prevDisabled = page <= 1;
	const nextDisabled = page >= totalPages;

	return (
		<Pagination className={className}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						text="Sebelumnya"
						href={buildHref(Math.max(1, page - 1))}
						aria-disabled={prevDisabled}
						className={cn(
							prevDisabled && 'pointer-events-none opacity-50',
						)}
					/>
				</PaginationItem>
				{visiblePages.map((p, i) => {
					const prevPage = visiblePages[i - 1];
					return (
						<PaginationItem key={p} className="flex items-center">
							{prevPage !== undefined && p - prevPage > 1 ? (
								<>
									<PaginationEllipsis />
									<PaginationLink
										href={buildHref(p)}
										isActive={p === page}
									>
										{p}
									</PaginationLink>
								</>
							) : (
								<PaginationLink
									href={buildHref(p)}
									isActive={p === page}
								>
									{p}
								</PaginationLink>
							)}
						</PaginationItem>
					);
				})}
				<PaginationItem>
					<PaginationNext
						text="Berikutnya"
						href={buildHref(Math.min(totalPages, page + 1))}
						aria-disabled={nextDisabled}
						className={cn(
							nextDisabled && 'pointer-events-none opacity-50',
						)}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
