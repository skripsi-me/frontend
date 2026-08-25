'use client';

import { EmptyState } from '@/components/empty-state';
import { RoleBadge } from '@/components/role-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserById } from '@/hooks/user.hook';
import { isApiError } from '@/lib/api';
import { formatDate } from '@/lib/utils/format';
import { getInitials } from '@/utils/user.util';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeftIcon, PencilIcon, RefreshCcwIcon } from 'lucide-react';
import Link from 'next/link';

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<span className="text-caption text-muted-foreground">{label}</span>
			<span className="text-body-sm font-medium text-foreground">
				{value}
			</span>
		</div>
	);
}

export function PenggunaAdminDetail({ userId }: { userId: string }) {
	const {
		data: user,
		isPending,
		isError,
		error,
		refetch,
	} = useUserById(userId);

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
			<div className="flex items-center gap-3 pb-6">
				<Button
					variant="ghost"
					size="icon-sm"
					nativeButton={false}
					render={<Link href="/dashboard/pengguna" />}
					aria-label="Kembali ke daftar pengguna"
				>
					<ArrowLeftIcon />
				</Button>
				<h1 className="text-headline-lg text-foreground">
					Detail Pengguna
				</h1>
			</div>

			{isError ? (
				<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
					<EmptyState
						icon={RefreshCcwIcon}
						title="Gagal memuat pengguna"
						description={
							isApiError(error)
								? error.message
								: 'Terjadi kesalahan.'
						}
						className="rounded-xl bg-surface-muted py-10"
					/>
					<div className="flex justify-center gap-3">
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link href="/dashboard/pengguna" />}
						>
							Kembali ke daftar
						</Button>
						<Button onClick={() => refetch()}>
							<RefreshCcwIcon />
							Coba lagi
						</Button>
					</div>
				</div>
			) : isPending || !user ? (
				<div className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-border">
					<div className="flex items-center gap-4">
						<Skeleton className="size-16 rounded-full" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4 w-56" />
						</div>
					</div>
					<Skeleton className="h-40 w-full" />
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-5 rounded-xl bg-white p-6 ring-1 ring-border">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-4">
								<Avatar size="lg">
									<AvatarFallback className="bg-primary-soft text-success">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col gap-1">
									<h2 className="text-headline-md text-foreground">
										{user.name}
									</h2>
									<p className="text-body-sm text-muted-foreground">
										{user.email}
									</p>
								</div>
							</div>
							<RoleBadge role={user.role} />
						</div>

						<div className="flex flex-col gap-2 rounded-xl bg-surface-muted p-4">
							<InfoRow label="ID" value={user.id} />
							<InfoRow
								label="Nomor HP"
								value={user.phone_number ?? '—'}
							/>
							<InfoRow
								label="Terdaftar"
								value={
									user.created_at
										? formatDate(user.created_at)
										: '—'
								}
							/>
							<InfoRow
								label="Diperbarui"
								value={
									user.updated_at
										? formatDate(user.updated_at)
										: '—'
								}
							/>
						</div>

						{user.address && (
							<div className="flex flex-col gap-1.5">
								<h3 className="text-label-sm text-muted-foreground">
									Alamat
								</h3>
								<p className="text-body-sm text-foreground whitespace-pre-line">
									{user.address}
								</p>
							</div>
						)}

						<div className="pt-2">
							<Button
								size="lg"
								className="font-semibold"
								nativeButton={false}
								render={
									<Link
										href={`/dashboard/pengguna/${user.id}/update`}
									/>
								}
							>
								<PencilIcon />
								Ubah Pengguna
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
