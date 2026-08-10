import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type SectionHeaderProps = {
	label?: string;
	title: string;
	description?: string;
	align?: 'start' | 'center';
	className?: string;
	children?: ReactNode;
};

export function SectionHeader({
	label,
	title,
	description,
	align = 'start',
	className,
	children,
}: SectionHeaderProps) {
	return (
		<div
			className={cn(
				'flex flex-col gap-1',
				align === 'center' && 'items-center text-center',
				className,
			)}
		>
			{label && <p className="text-label-md text-primary">{label}</p>}
			<h2 className="text-headline-lg text-foreground">{title}</h2>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
			{children}
		</div>
	);
}
