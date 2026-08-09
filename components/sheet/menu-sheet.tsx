import { PROFILE_NAV_LINKS, USER_NAV_LINKS } from '@/config/menu.config';
import { cn } from '@/lib/utils';
import { NavLinkUser } from '@/types/nav';
import { User } from '@/types/user';
import { isActiveNav } from '@/utils/nav.util';
import { getInitials } from '@/utils/user.util';
import { LogOutIcon, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import { Skeleton } from '../ui/skeleton';

interface Props {
	menu: NavLinkUser[];
	pathname: string;
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	logout: () => Promise<void>;
}

export function MenuSheet({
	menu,
	pathname,
	user,
	isAuthenticated,
	isLoading,
	logout,
}: Props) {
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
			<SheetContent
				side="right"
				className="w-64 flex flex-col justify-between items-start"
			>
				<nav className="flex flex-col gap-1 px-4 mt-8">
					{USER_NAV_LINKS.map((link) => (
						<SheetClose
							key={link.href}
							render={
								<Link
									href={link.href}
									className={cn(
										'rounded-md px-2 py-2 text-md tracking-wider hover:bg-muted',
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
				</nav>

				<section className="w-full flex flex-col items-start mb-4 px-4 gap-2 pt-4 border-t border-border">
					{isLoading ? (
						<Skeleton className="size-8 rounded-full" />
					) : !isAuthenticated || !user ? (
						<SheetClose
							render={
								<Link
									href={'/auth/login'}
									className={cn(
										'rounded-md px-2 py-2 text-md bg-primary text-white w-full text-center tracking-wider hover:bg-primary/90',
									)}
								/>
							}
						>
							Masuk
						</SheetClose>
					) : (
						<>
							<div className="w-full flex gap-2 justify-start items-center px-2 py-2 rounded-md bg-muted">
								<Avatar size="lg">
									<AvatarFallback>
										{getInitials(user?.name || 'User')}
									</AvatarFallback>
								</Avatar>

								<div>
									<p className="text-body-sm text-foreground">
										{user?.name}
									</p>
									<p className="text-caption text-muted-foreground">
										{user?.email}
									</p>
								</div>
							</div>

							{PROFILE_NAV_LINKS.map((link) => (
								<SheetClose
									key={link.href}
									render={
										<Link
											href={link.href}
											className={cn(
												'rounded-md px-2 py-2 text-md tracking-wider hover:bg-muted',
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

							{user.role === 'admin' && (
								<SheetClose
									render={
										<Link
											href="/dashboard"
											className={cn(
												'rounded-md px-2 py-2 text-md tracking-wider hover:bg-muted',
												isActiveNav({
													href: '/dashboard',
													pathname,
												})
													? 'text-primary'
													: 'text-foreground',
											)}
										/>
									}
								>
									Dashboard Admin
								</SheetClose>
							)}

							<SheetClose
								render={
									<Button
										variant="destructive"
										size="lg"
										className="w-full"
										onClick={() => logout()}
									/>
								}
							>
								<LogOutIcon />
								Keluar
							</SheetClose>
						</>
					)}
				</section>
			</SheetContent>
		</Sheet>
	);
}
