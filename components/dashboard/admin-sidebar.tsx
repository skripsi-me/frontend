'use client';

import { AdminNav } from '@/components/dashboard/admin-nav';
import { AdminUserCard } from '@/components/dashboard/admin-user-card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

export function AdminSidebar() {
	return (
		<aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
			<Link
				href="/dashboard"
				className="flex shrink-0 items-center gap-2.5 border-b border-border px-5 py-4"
			>
				<Image
					src="/image/logo.png"
					alt="As-Sakinah Mart"
					width={36}
					height={36}
					className="size-9 rounded-full object-contain"
					priority
				/>
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold text-foreground">
						As-Sakinah <span className="text-primary">Mart</span>
					</p>
					<p className="text-xs text-muted-foreground">Admin Panel</p>
				</div>
			</Link>

			<div className="flex-1 overflow-y-auto p-3">
				<AdminNav />
			</div>

			<Separator />

			<div className="shrink-0 p-3">
				<AdminUserCard />
			</div>
		</aside>
	);
}
