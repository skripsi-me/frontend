'use client';

import { UserDropdown } from '@/components/dropdown/user-dropdown';
import { Button } from '@/components/ui/button';
import { USER_NAV_LINKS } from '@/config/menu.config';
import { useCart } from '@/hooks/cart.hook';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { isActiveNav } from '@/utils/nav.util';
import { Badge, SearchIcon, ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MenuSheet } from './sheet/menu-sheet';

export function Navbar() {
	const pathname = usePathname();
	const router = useRouter();

	const { user, isAuthenticated, isLoading, logout } = useAuth();
	const { data: cart } = useCart();

	const cartCount =
		cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

	const navLinkClass = (href: string) =>
		cn(
			'text-label-sm transition-colors hover:text-primary',
			isActiveNav({ href, pathname })
				? 'text-primary'
				: 'text-on-surface-muted',
		);

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background">
			<div className="mx-auto flex py-4 max-w-6xl items-center justify-between gap-3 px-4 md:gap-6 md:px-6">
				<Link href="/" className="flex shrink-0 items-center gap-2">
					<Image
						src="/image/logo.png"
						alt="As-Sakinah Mart"
						width={36}
						height={36}
						className="size-9 rounded-full object-contain"
						priority
					/>
					<span className="text-lg text-foreground font-semibold">
						As-Sakinah <span className="text-primary">Mart</span>
					</span>
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					{USER_NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={navLinkClass(link.href)}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-1.5 md:gap-4 w-fit">
					<Button
						variant="ghost"
						size="icon"
						aria-label="Cari Produk"
					>
						<SearchIcon />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						render={<Link href="/keranjang-saya" />}
						aria-label="Keranjang belanja"
						className="relative"
					>
						<ShoppingCartIcon />
						{cartCount > 0 && (
							<Badge>{cartCount > 9 ? '9+' : cartCount}</Badge>
						)}
					</Button>

					<UserDropdown
						user={user}
						isAuthenticated={isAuthenticated}
						isLoading={isLoading}
						logout={logout}
					/>

					<MenuSheet
						menu={USER_NAV_LINKS}
						pathname={pathname}
						user={user}
						isAuthenticated={isAuthenticated}
						isLoading={isLoading}
						logout={logout}
					/>
				</div>
			</div>
		</header>
	);
}
