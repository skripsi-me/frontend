'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/auth-provider';
import { getInitials } from '@/utils/user.util';
import { LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AdminUserCard() {
	const { user, isLoading, logout } = useAuth();
	const router = useRouter();

	async function handleLogout() {
		await logout();
		router.push('/');
	}

	return (
		<div className="flex flex-col gap-4">
			{isLoading ? (
				<div className="flex items-center gap-2 px-2">
					<Skeleton className="size-10 rounded-full" />
					<div className="flex flex-1 flex-col gap-1">
						<Skeleton className="h-3.5 w-24" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
			) : (
				<Link href="/profil" className="flex items-center gap-2 px-2">
					<Avatar size="lg">
						<AvatarFallback className="bg-primary/10 text-success">
							{getInitials(user?.name ?? 'Admin')}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium text-foreground">
							{user?.name ?? 'Admin'}
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{user?.email}
						</p>
					</div>
				</Link>
			)}

			<Button variant="outline" className="w-full" onClick={handleLogout}>
				<LogOutIcon />
				Keluar
			</Button>
		</div>
	);
}
