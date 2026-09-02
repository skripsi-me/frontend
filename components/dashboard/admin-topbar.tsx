'use client';

import { AdminNav } from '@/components/dashboard/admin-nav';
import { AdminUserCard } from '@/components/dashboard/admin-user-card';
import { UserDropdown } from '@/components/dropdown/user-dropdown';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/providers/auth-provider';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const TITLE_MAP: ReadonlyArray<{ href: string; label: string }> = [
	{ href: '/dashboard/produk', label: 'Produk' },
	{ href: '/dashboard/kategori', label: 'Kategori' },
	{ href: '/dashboard/pesanan', label: 'Pesanan' },
	{ href: '/dashboard/pengguna', label: 'Pengguna' },
	{ href: '/dashboard', label: 'Ikhtisar' },
];

export function AdminTopbar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, isAuthenticated, isLoading, logout } = useAuth();

	const title =
		TITLE_MAP.find((item) =>
			item.href === '/dashboard'
				? pathname === item.href
				: pathname.startsWith(item.href),
		)?.label ?? 'Ikhtisar';

	async function handleLogout() {
		await logout();
		router.push('/');
	}

	return (
		<header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-6">
			<div className="flex min-w-0 items-center gap-3">
				<Sheet>
					<SheetTrigger
						render={
							<Button
								variant="ghost"
								size="icon-sm"
								className="lg:hidden"
							/>
						}
						aria-label="Buka menu admin"
					>
						<MenuIcon />
					</SheetTrigger>
					<SheetContent
						side="left"
						className="w-72 p-0 sm:max-w-[18rem]"
						showCloseButton={false}
					>
						<SheetTitle className="sr-only">Menu Admin</SheetTitle>
						<div className="flex shrink-0 items-center gap-2.5 border-b border-border px-5 py-4">
							<Image
								src="/image/logo.png"
								alt="Rull Store"
								width={32}
								height={32}
								className="size-8 object-contain"
							/>
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-foreground">
									Rull Store
								</p>
								<p className="text-xs text-muted-foreground">
									Admin Panel
								</p>
							</div>
						</div>
						<div className="flex-1 overflow-y-auto p-3">
							<AdminNav asSheet />
						</div>
						<div className="shrink-0 border-t border-border p-3">
							<AdminUserCard />
						</div>
					</SheetContent>
				</Sheet>

				<h1 className="truncate text-base font-semibold text-foreground md:text-lg">
					{title}
				</h1>
			</div>

			<div className="flex shrink-0 items-center">
				<UserDropdown
					user={user}
					isAuthenticated={isAuthenticated}
					isLoading={isLoading}
					logout={handleLogout}
				/>
			</div>
		</header>
	);
}
