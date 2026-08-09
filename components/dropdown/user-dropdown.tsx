'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/auth-provider';
import { LogOutIcon } from 'lucide-react';
import Link from 'next/link';

function getInitials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
}

export function UserDropdown() {
	const { user, isAuthenticated, isLoading, logout } = useAuth();

	if (isLoading) {
		return <Skeleton className="size-8 rounded-full" />;
	}

	if (!isAuthenticated || !user) {
		return (
			<Button
				variant="default"
				size="lg"
				className="font-semibold"
				render={<Link href="/auth/login" />}
			>
				Masuk
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="default"
						size="lg"
						className="rounded-full"
					/>
				}
				aria-label="Menu pengguna"
			>
				<Avatar size="sm">
					<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>
					<p className="text-body-sm text-foreground">{user.name}</p>
					<p className="text-caption text-muted-foreground">
						{user.email}
					</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem render={<Link href="/profil" />}>
					Profil
				</DropdownMenuItem>
				<DropdownMenuItem
					render={<Link href="/profil/riwayat-transaksi" />}
				>
					Riwayat Transaksi
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link href="/auth/ubah-password" />}>
					Ubah Password
				</DropdownMenuItem>
				{user.role === 'admin' && (
					<DropdownMenuItem render={<Link href="/dashboard" />}>
						Dashboard Admin
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={() => logout()}
				>
					<LogOutIcon />
					Keluar
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
