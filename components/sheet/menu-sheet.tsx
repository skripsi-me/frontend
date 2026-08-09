import { USER_NAV_LINKS } from '@/config/menu.config';
import { cn } from '@/lib/utils';
import { NavLinkUser } from '@/types/nav';
import { isActiveNav } from '@/utils/nav.util';
import { MenuIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet';

interface Props {
	menu: NavLinkUser[];
	pathname: string;
}

export function MenuSheet({ menu, pathname }: Props) {
	return (
		<Sheet>
			<SheetTrigger
				render={
					<Button
						variant="ghost"
						size="icon-sm"
						className="md:hidden"
					/>
				}
				aria-label="Buka menu"
			>
				<MenuIcon />
			</SheetTrigger>
			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
					<SheetDescription>
						Navigasi As-Sakinah Mart
					</SheetDescription>
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-4">
					{USER_NAV_LINKS.map((link) => (
						<SheetClose
							key={link.href}
							render={
								<Link
									href={link.href}
									className={cn(
										'rounded-md px-2 py-2 text-body-md hover:bg-muted',
										isActiveNav({
											href: link.href,
											pathname,
										})
											? 'text-primary'
											: 'text-foreground',
									)}
								/>
							}
						>
							{link.label}
						</SheetClose>
					))}

					<Button type="submit" size="icon-sm" aria-label="Cari">
						<SearchIcon />
					</Button>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
