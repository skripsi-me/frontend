'use client';

import { EmptyState } from '@/components/empty-state';
import { PaginationNav } from '@/components/pagination-nav';
import { RoleBadge } from '@/components/role-badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDeleteUser, useUsers } from '@/hooks/user.hook';
import { isApiError } from '@/lib/api';
import { formatDate } from '@/lib/utils/format';
import { getInitials } from '@/utils/user.util';
import type { User, UserRole } from '@/types/user';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	Loader2Icon,
	PencilIcon,
	PlusIcon,
	RefreshCcwIcon,
	Trash2Icon,
	UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const ROLE_OPTIONS: Array<{ value: string; label: string }> = [
	{ value: '', label: 'Semua peran' },
	{ value: 'user', label: 'Pengguna' },
	{ value: 'admin', label: 'Admin' },
];

function TableSkeleton({ rows = 6 }: { rows?: number }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, i) => (
				<TableRow key={i}>
					<TableCell>
						<div className="flex items-center gap-3">
							<Skeleton className="size-9 rounded-full" />
							<div className="flex flex-col gap-1.5">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-44" />
							</div>
						</div>
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-24" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-5 w-20 rounded-full" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-24" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-12" />
					</TableCell>
				</TableRow>
			))}
		</>
	);
}

export function PenggunaAdminContent() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = Math.max(1, Number(searchParams.get('page')) || 1);
	const role = searchParams.get('role') ?? '';

	const { data, isPending, isError, error, refetch } = useUsers({
		page,
		limit: PAGE_SIZE,
		role: (role || undefined) as UserRole | undefined,
	});
	const deleteUser = useDeleteUser();
	const [userToDelete, setUserToDelete] = useState<User | null>(null);

	function updateFilter(key: 'role', value: string) {
		const params = new URLSearchParams(searchParams.toString());
		if (value) params.set(key, value);
		else params.delete(key);
		params.set('page', '1');
		router.replace(`${pathname}?${params.toString()}`);
	}

	function buildHref(pageNumber: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', String(pageNumber));
		return `${pathname}?${params.toString()}`;
	}

	async function handleDelete() {
		if (!userToDelete || deleteUser.isPending) return;
		try {
			await deleteUser.mutateAsync(userToDelete.id);
			toast.success(`Pengguna "${userToDelete.name}" dihapus.`);
			setUserToDelete(null);
		} catch (error) {
			toast.error(
				isApiError(error) ? error.message : 'Gagal menghapus pengguna.',
			);
		}
	}

	const users = data?.data ?? [];
	const totalPages = data?.meta.total_pages ?? 1;
	const total = data?.meta.total ?? users.length;

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
			<div className="flex flex-wrap items-center justify-between gap-3 pb-6">
				<div className="flex flex-col gap-1">
					<h1 className="text-headline-lg text-foreground">
						Kelola Pengguna
					</h1>
					<p className="text-body-sm text-muted-foreground">
						Kelola akun pengguna toko.
					</p>
				</div>
				<Button
					size="lg"
					className="font-semibold"
					nativeButton={false}
					render={<Link href="/dashboard/pengguna/buat" />}
				>
					<PlusIcon />
					Tambah Pengguna
				</Button>
			</div>

			<div className="pb-6">
				<Select
					value={role}
					onValueChange={(value) => updateFilter('role', value ?? '')}
				>
					<SelectTrigger
						size="default"
						className="w-full sm:w-52"
						aria-label="Filter peran"
					>
						<SelectValue placeholder="Semua peran" />
					</SelectTrigger>
					<SelectContent>
						{ROLE_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-1 flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-border">
				{isError ? (
					<Alert variant="destructive">
						<AlertTitle>Gagal memuat pengguna</AlertTitle>
						<AlertDescription>
							{isApiError(error)
								? error.message
								: 'Terjadi kesalahan. Coba lagi.'}
						</AlertDescription>
						<div className="pt-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => refetch()}
							>
								<RefreshCcwIcon />
								Coba lagi
							</Button>
						</div>
					</Alert>
				) : isPending ? (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Pengguna</TableHead>
									<TableHead>Telepon</TableHead>
									<TableHead>Peran</TableHead>
									<TableHead>Terdaftar</TableHead>
									<TableHead className="text-right">
										Aksi
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableSkeleton />
							</TableBody>
						</Table>
					</div>
				) : users.length === 0 ? (
					<EmptyState
						icon={UsersIcon}
						title="Tidak ada pengguna"
						description="Belum ada akun pengguna."
						className="rounded-xl bg-surface-muted py-10"
					/>
				) : (
					<>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Pengguna</TableHead>
										<TableHead>Telepon</TableHead>
										<TableHead>Peran</TableHead>
										<TableHead>Terdaftar</TableHead>
										<TableHead className="text-right">
											Aksi
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.map((user) => (
										<TableRow key={user.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar size="sm">
														<AvatarFallback className="bg-primary/10 text-success">
															{getInitials(
																user.name,
															)}
														</AvatarFallback>
													</Avatar>
													<div className="min-w-0">
														<p className="truncate font-medium text-foreground">
															{user.name}
														</p>
														<p className="truncate text-caption text-muted-foreground">
															{user.email}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{user.phone_number ?? '—'}
											</TableCell>
											<TableCell>
												<RoleBadge role={user.role} />
											</TableCell>
											<TableCell className="text-muted-foreground">
												{user.created_at
													? formatDate(
															user.created_at,
														)
													: '—'}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1.5">
													<Button
														variant="ghost"
														size="icon-sm"
														nativeButton={false}
														render={
															<Link
																href={`/dashboard/pengguna/${user.id}`}
															/>
														}
														aria-label={`Lihat detail ${user.name}`}
													>
														<UsersIcon className="size-4" />
													</Button>
													<Button
														variant="outline"
														size="icon-sm"
														nativeButton={false}
														render={
															<Link
																href={`/dashboard/pengguna/${user.id}/update`}
															/>
														}
														aria-label={`Ubah ${user.name}`}
													>
														<PencilIcon />
													</Button>
													<Button
														variant="ghost"
														size="icon-sm"
														className="text-destructive"
														onClick={() =>
															setUserToDelete(
																user,
															)
														}
														aria-label={`Hapus ${user.name}`}
													>
														<Trash2Icon />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						<div className="flex flex-col gap-2">
							<PaginationNav
								page={page}
								totalPages={totalPages}
								buildHref={buildHref}
							/>
							<p className="text-center text-caption text-muted-foreground">
								Menampilkan {users.length} dari {total} pengguna
							</p>
						</div>
					</>
				)}
			</div>

			<Dialog
				open={Boolean(userToDelete)}
				onOpenChange={(open) => {
					if (!open) setUserToDelete(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Hapus pengguna?</DialogTitle>
						<DialogDescription>
							Pengguna &quot;{userToDelete?.name}&quot; akan
							dihapus secara permanen. Tindakan ini tidak dapat
							dibatalkan.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setUserToDelete(null)}
						>
							Batal
						</Button>
						<Button
							variant="destructive"
							disabled={deleteUser.isPending}
							onClick={handleDelete}
						>
							{deleteUser.isPending && (
								<Loader2Icon className="animate-spin" />
							)}
							{deleteUser.isPending ? 'Menghapus...' : 'Hapus'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
