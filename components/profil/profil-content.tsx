'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RequireAuth } from '@/components/auth/require-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PROFILE_NAV_LINKS } from '@/config/menu.config';
import { useMe } from '@/hooks/user.hook';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/format';
import {
	ChevronRightIcon,
	MailIcon,
	MapPinIcon,
	PencilIcon,
	PhoneIcon,
} from 'lucide-react';
import { ProfilForm } from './profil-form';

const ROLE_LABEL: Record<string, string> = {
	admin: 'Admin',
	user: 'Pelanggan',
};

function ProfilSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-4 rounded-2xl bg-white p-6 ring-1 ring-border">
				<Skeleton className="size-16 rounded-full" />
				<div className="flex flex-col gap-2">
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-4 w-56" />
				</div>
			</div>
			<Skeleton className="h-48 w-full rounded-2xl" />
		</div>
	);
}

function DetailRow({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof MailIcon;
	label: string;
	value?: string | null;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
				<Icon className="size-4" />
			</div>
			<div className="flex min-w-0 flex-col gap-0.5">
				<span className="text-caption text-muted-foreground">
					{label}
				</span>
				<span className="break-words text-body-md text-foreground">
					{value?.trim() || 'Belum diisi'}
				</span>
			</div>
		</div>
	);
}

export function ProfilContent() {
	const pathname = usePathname();
	const { data: user, isPending } = useMe();
	const [editing, setEditing] = useState(false);

	return (
		<RequireAuth>
			<main className="flex flex-1 flex-col">
				<section className="border-b border-border bg-surface-muted">
					<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 md:px-6 md:py-14">
						<h1 className="text-headline-lg text-foreground">
							Profil Saya
						</h1>
						<p className="text-body-sm text-muted-foreground">
							Kelola data diri untuk memudahkan pengiriman
							belanjaan ke rumah.
						</p>
					</div>
				</section>

				<section className="flex flex-1">
					<div className="mx-auto grid w-full max-w-6xl items-start gap-6 px-4 py-8 md:px-6 md:py-12 lg:grid-cols-3">
						<div className="flex flex-col gap-6 lg:col-span-2">
							{isPending || !user ? (
								<ProfilSkeleton />
							) : editing ? (
								<ProfilForm
									user={user}
									onCancel={() => setEditing(false)}
									onSaved={() => setEditing(false)}
								/>
							) : (
								<>
									<div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-border">
										<div className="flex items-center gap-4">
											<Avatar size="lg" className="size-16">
												<AvatarFallback className="text-headline-md">
													{user.name
														.charAt(0)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex min-w-0 flex-col gap-1">
												<h2 className="truncate text-headline-sm text-foreground">
													{user.name}
												</h2>
												<p className="truncate text-body-sm text-muted-foreground">
													{user.email}
												</p>
											</div>
										</div>
										<div className="h-px bg-border" />
										<div className="flex flex-col gap-4">
											<DetailRow
												icon={PhoneIcon}
												label="Nomor HP"
												value={user.phone_number}
											/>
											<DetailRow
												icon={MapPinIcon}
												label="Alamat Pengiriman"
												value={user.address}
											/>
										</div>
									</div>

									<div className="flex flex-wrap items-center gap-3">
										<Button
											size="lg"
											onClick={() => setEditing(true)}
										>
											<PencilIcon />
											Edit Profil
										</Button>
										<Button
											variant="outline"
											size="lg"
											nativeButton={false}
											render={
												<Link href="/auth/ubah-password" />
											}
										>
											Ubah Kata Sandi
										</Button>
									</div>
								</>
							)}
						</div>

						<aside className="flex flex-col gap-6">
							<div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-border">
								<h3 className="text-label-sm text-muted-foreground">
									Detail Akun
								</h3>
								<div className="flex flex-col gap-3">
									<div className="flex items-center justify-between">
										<span className="text-body-sm text-muted-foreground">
											Status
										</span>
										<Badge variant="secondary">
											{user
												? ROLE_LABEL[user.role] ??
													user.role
												: '-'}
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-body-sm text-muted-foreground">
											Terdaftar sejak
										</span>
										<span className="text-label-sm text-foreground">
											{user?.created_at
												? formatDate(user.created_at)
												: '-'}
										</span>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-2 rounded-2xl bg-white p-2 ring-1 ring-border">
								<h3 className="px-4 pt-3 text-label-sm text-muted-foreground">
									Menu Lainnya
								</h3>
								{PROFILE_NAV_LINKS.map((item) => {
									const active =
										pathname === item.href;
									return (
										<Link
											key={item.href}
											href={item.href}
											className={cn(
												'flex items-center justify-between rounded-xl px-4 py-3 text-body-md transition-colors hover:bg-surface-muted',
												active
													? 'bg-primary-soft font-medium text-primary'
													: 'text-foreground',
											)}
										>
											{item.label}
											<ChevronRightIcon className="size-4 text-muted-foreground" />
										</Link>
									);
								})}
							</div>
						</aside>
					</div>
				</section>
			</main>
		</RequireAuth>
	);
}
