'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PROFILE_NAV_LINKS } from '@/config/menu.config';
import { useCart } from '@/hooks/cart.hook';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { isActiveNav } from '@/utils/nav.util';
import {
	HomeIcon,
	LogOutIcon,
	PackageIcon,
	ShoppingCartIcon,
	UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function NavItem({
	href,
	icon,
	label,
	active,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
	active: boolean;
}) {
	return (
		<Link
			href={href}
			aria-label={label}
			className={cn(
				'flex flex-col items-center gap-1 py-2 text-[10px] font-semibold transition-colors',
				active ? 'text-primary' : 'text-on-surface-muted',
			)}
		>
			{icon}
			{label}
		</Link>
	);
}

export function MobileBottomNav() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, isAuthenticated, logout } = useAuth();
	const { data: cart } = useCart();

	const cartCount =
		cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

	async function handleLogout() {
		await logout();
		router.push('/');
	}

	return (
		<nav
			aria-label="Navigasi utama"
			className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
		>
			<div className="grid grid-cols-4">
				<NavItem
					href="/"
					icon={<HomeIcon className="size-6" />}
					label="Beranda"
					active={isActiveNav({ href: '/', pathname })}
				/>
				<NavItem
					href="/produk"
					icon={<PackageIcon className="size-6" />}
					label="Produk"
					active={isActiveNav({ href: '/produk', pathname })}
				/>
				<Link
					href="/keranjang-saya"
					aria-label="Keranjang Saya"
					className={cn(
						'relative flex flex-col items-center gap-1 py-2 text-[10px] font-semibold transition-colors',
						isActiveNav({ href: '/keranjang-saya', pathname })
							? 'text-primary'
							: 'text-on-surface-muted',
					)}
				>
					<ShoppingCartIcon className="size-6" />
					Keranjang
					{cartCount > 0 && (
						<Badge className="absolute top-0.5 right-[22%] flex size-4 items-center justify-center rounded-full p-0 text-[8px] text-white">
							{cartCount > 9 ? '9+' : cartCount}
						</Badge>
					)}
				</Link>

				{!isAuthenticated || !user ? (
					<NavItem
						href="/auth/login"
						icon={<UserIcon className="size-6" />}
						label="Profil"
						active={isActiveNav({ href: '/profil', pathname })}
					/>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									className="flex h-auto flex-col gap-1 rounded-none py-2 text-[10px] font-semibold text-on-surface-muted data-popup-open:text-primary"
								/>
							}
							aria-label="Menu profil"
						>
							<UserIcon className="size-6" />
							Profil
						</DropdownMenuTrigger>
						<DropdownMenuContent
							side="top"
							align="center"
							className="w-56 rounded-lg"
						>
							{PROFILE_NAV_LINKS.map((link) => (
								<DropdownMenuItem
									key={link.href}
									render={<Link href={link.href} />}
								>
									{link.label}
								</DropdownMenuItem>
							))}
							{user.role === 'admin' && (
								<DropdownMenuItem
									render={<Link href="/dashboard" />}
								>
									Dashboard Admin
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								onClick={() => handleLogout()}
							>
								<LogOutIcon />
								Keluar
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</nav>
	);
}