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
import { PROFILE_NAV_LINKS } from '@/config/menu.config';
import { User } from '@/types/user';
import { getInitials } from '@/utils/user.util';
import { LogOutIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	logout: () => Promise<void>;
}

export function UserDropdown({
	user,
	isAuthenticated,
	isLoading,
	logout,
}: Props) {
	if (isLoading) {
		return <Skeleton className="size-8 rounded-full" />;
	}

	if (!isAuthenticated || !user) {
		return (
			<Button
				variant="default"
				size="lg"
				className="font-semibold hidden md:flex"
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
						className="rounded-full hidden md:flex"
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
				{PROFILE_NAV_LINKS.map((link) => (
					<DropdownMenuItem
						key={link.href}
						render={<Link href={link.href} />}
					>
						{link.label}
					</DropdownMenuItem>
				))}
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
