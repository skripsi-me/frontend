'use client';

import { SheetClose } from '@/components/ui/sheet';
import { DASHBOARD_NAV_LINKS } from '@/config/menu.config';
import { cn } from '@/lib/utils';
import { isActiveNav } from '@/utils/nav.util';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
	asSheet?: boolean;
}

export function AdminNav({ asSheet = false }: Props) {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col gap-1">
			{DASHBOARD_NAV_LINKS.map((link) => {
				const active = isActiveNav({ href: link.href, pathname });
				const linkClassName = cn(
					'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
					active
						? 'bg-primary/10 text-green-700'
						: 'text-muted-foreground hover:bg-muted hover:text-foreground',
				);
				const linkProps = {
					'aria-current': active ? ('page' as const) : undefined,
				};
				const content = (
					<>
						<link.icon className="size-5 shrink-0" />
						<span className="truncate">{link.label}</span>
					</>
				);

				if (asSheet) {
					return (
						<SheetClose
							key={link.href}
							render={
								<Link
									href={link.href}
									className={linkClassName}
									{...linkProps}
								/>
							}
						>
							{content}
						</SheetClose>
					);
				}

				return (
					<Link
						key={link.href}
						href={link.href}
						className={linkClassName}
						{...linkProps}
					>
						{content}
					</Link>
				);
			})}
		</nav>
	);
}
