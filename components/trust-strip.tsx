import type { ComponentType, SVGProps } from 'react';
import { cn } from '@/lib/utils';

type TrustItem = {
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	title: string;
	description: string;
};

const COLUMNS: Record<number, string> = {
	2: 'sm:grid-cols-2',
	3: 'sm:grid-cols-3',
	4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export function TrustStrip({
	items,
	className,
}: {
	items: TrustItem[];
	className?: string;
}) {
	const gridClass = COLUMNS[items.length] ?? COLUMNS[3];

	return (
		<div
			className={cn(
				'grid grid-cols-1 divide-y divide-border sm:divide-x sm:divide-y-0',
				gridClass,
				className,
			)}
		>
			{items.map((item) => (
				<div
					key={item.title}
					className="flex items-center gap-3 py-5 sm:justify-center sm:px-6 sm:py-6"
				>
					<item.icon className="size-6 shrink-0 text-primary" />
					<div className="flex flex-col gap-0.5">
						<p className="text-label-md text-foreground">
							{item.title}
						</p>
						<p className="text-caption text-muted-foreground">
							{item.description}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
