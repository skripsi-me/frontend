import type { ComponentType, SVGProps } from 'react';
import { InboxIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
	title: string;
	description?: string;
	className?: string;
};

export function EmptyState({
	icon: Icon = InboxIcon,
	title,
	description,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-2 px-6 py-12 text-center',
				className,
			)}
		>
			<div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
				<Icon className="size-6" />
			</div>
			<h3 className="text-body-md text-foreground">{title}</h3>
			{description && (
				<p className="max-w-sm text-body-sm text-muted-foreground">
					{description}
				</p>
			)}
		</div>
	);
}
