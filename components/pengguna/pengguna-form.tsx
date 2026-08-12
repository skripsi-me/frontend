'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useCreateUser, useUpdateUser, useUserById } from '@/hooks/user.hook';
import { isApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/form';
import type {
	CreateUserRequest,
	UpdateUserRequest,
	UserRole,
} from '@/types/user';
import { useForm } from '@tanstack/react-form';
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const userSchema = z.object({
	name: z.string().min(1, 'Nama wajib diisi'),
	email: z
		.string()
		.min(1, 'Email wajib diisi')
		.email('Format email tidak valid'),
	password: z
		.string()
		.refine(
			(value) => !value || value.length >= 8,
			'Password minimal 8 karakter',
		),
	phone_number: z
		.string()
		.refine(
			(value) =>
				!value.trim() || /^[0-9+\-\s()]{8,16}$/.test(value.trim()),
			'Format nomor HP tidak valid',
		),
	address: z.string(),
	role: z.string(),
});

export function PenggunaForm({
	mode,
	userId,
}: {
	mode: 'create' | 'update';
	userId?: string;
}) {
	const router = useRouter();
	const isUpdate = mode === 'update';

	const { data: user, isPending: isUserPending } = useUserById(
		isUpdate ? userId : undefined,
	);
	const createUser = useCreateUser();
	const updateUser = useUpdateUser();

	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			phone_number: '',
			address: '',
			role: 'user' as UserRole,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			const payload: CreateUserRequest = {
				name: value.name.trim(),
				email: value.email.trim(),
				password: value.password,
				phone_number: value.phone_number.trim() || undefined,
				address: value.address.trim() || undefined,
				role: value.role,
			};
			try {
				if (isUpdate && userId) {
					const updatePayload: UpdateUserRequest = {
						...payload,
					};
					if (!updatePayload.password) {
						delete updatePayload.password;
					}
					await updateUser.mutateAsync({
						id: userId,
						data: updatePayload,
					});
					toast.success('Pengguna berhasil diperbarui.');
					router.push(`/dashboard/pengguna/${userId}`);
				} else {
					const created = await createUser.mutateAsync(payload);
					toast.success('Pengguna berhasil ditambahkan.');
					router.push(`/dashboard/pengguna/${created.id}`);
				}
			} catch (error) {
				setServerError(
					isApiError(error)
						? error.message
						: 'Gagal menyimpan pengguna. Silakan coba lagi.',
				);
			}
		},
	});

	useEffect(() => {
		if (user) {
			form.reset({
				name: user.name,
				email: user.email,
				password: '',
				phone_number: user.phone_number ?? '',
				address: user.address ?? '',
				role: user.role,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id]);

	const isSubmitting = createUser.isPending || updateUser.isPending;

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
			<div className="flex items-center gap-3 pb-6">
				<Button
					variant="ghost"
					size="icon-sm"
					nativeButton={false}
					render={
						<Link
							href={
								isUpdate && userId
									? `/dashboard/pengguna/${userId}`
									: '/dashboard/pengguna'
							}
						/>
					}
					aria-label="Kembali"
				>
					<ArrowLeftIcon />
				</Button>
				<h1 className="text-headline-lg text-foreground">
					{isUpdate ? 'Update Pengguna' : 'Tambah Pengguna'}
				</h1>
			</div>

			{isUpdate && isUserPending ? (
				<div className="flex flex-col gap-5 rounded-xl bg-white p-6 ring-1 ring-border">
					<Skeleton className="h-10 w-2/3" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			) : (
				<form
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void form.handleSubmit();
					}}
					className="flex flex-col gap-5 rounded-xl bg-white p-6 ring-1 ring-border"
					noValidate
				>
					{serverError && (
						<div
							role="alert"
							className="rounded-xl bg-destructive/10 px-4 py-3 text-label-sm text-destructive"
						>
							{serverError}
						</div>
					)}

					<form.Field
						name="name"
						validators={{ onChange: userSchema.shape.name }}
					>
						{(field) => {
							const error = getErrorMessage(field);
							return (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>Nama</Label>
									<Input
										id={field.name}
										name={field.name}
										placeholder="cth. Budi Santoso"
										value={field.state.value}
										onChange={(event) =>
											field.handleChange(
												event.target.value,
											)
										}
										onBlur={field.handleBlur}
										aria-invalid={error ? true : undefined}
									/>
									{error && (
										<p className="text-caption text-destructive">
											{error}
										</p>
									)}
								</div>
							);
						}}
					</form.Field>

					<form.Field
						name="email"
						validators={{ onChange: userSchema.shape.email }}
					>
						{(field) => {
							const error = getErrorMessage(field);
							return (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>Email</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										inputMode="email"
										autoComplete="email"
										placeholder="nama@email.com"
										value={field.state.value}
										onChange={(event) =>
											field.handleChange(
												event.target.value,
											)
										}
										onBlur={field.handleBlur}
										aria-invalid={error ? true : undefined}
									/>
									{error && (
										<p className="text-caption text-destructive">
											{error}
										</p>
									)}
								</div>
							);
						}}
					</form.Field>

					<form.Field
						name="password"
						validators={{ onChange: userSchema.shape.password }}
					>
						{(field) => {
							const error = getErrorMessage(field);
							return (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>Password</Label>
									<Input
										id={field.name}
										name={field.name}
										type="password"
										autoComplete="new-password"
										placeholder={
											isUpdate
												? 'Kosongkan jika tidak diubah'
												: 'Minimal 8 karakter'
										}
										value={field.state.value}
										onChange={(event) =>
											field.handleChange(
												event.target.value,
											)
										}
										onBlur={field.handleBlur}
										aria-invalid={error ? true : undefined}
									/>
									{error && (
										<p className="text-caption text-destructive">
											{error}
										</p>
									)}
								</div>
							);
						}}
					</form.Field>

					<div className="grid gap-4 sm:grid-cols-2">
						<form.Field name="phone_number">
							{(field) => {
								const error = getErrorMessage(field);
								return (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor={field.name}>
											Nomor HP
										</Label>
										<Input
											id={field.name}
											name={field.name}
											type="tel"
											inputMode="tel"
											placeholder="081234567890"
											value={field.state.value}
											onChange={(event) =>
												field.handleChange(
													event.target.value,
												)
											}
											onBlur={field.handleBlur}
											aria-invalid={
												error ? true : undefined
											}
										/>
										{error && (
											<p className="text-caption text-destructive">
												{error}
											</p>
										)}
									</div>
								);
							}}
						</form.Field>

						<form.Field name="role">
							{(field) => {
								const error = getErrorMessage(field);
								return (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor={field.name}>
											Peran
										</Label>
										<Select
											value={field.state.value}
											onValueChange={(value) =>
												field.handleChange(
													(value as UserRole) ?? '',
												)
											}
										>
											<SelectTrigger
												className="w-full"
												aria-invalid={
													error ? true : undefined
												}
											>
												<SelectValue placeholder="Pilih peran" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="user">
													Pengguna
												</SelectItem>
												<SelectItem value="admin">
													Admin
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								);
							}}
						</form.Field>
					</div>

					<form.Field name="address">
						{(field) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor={field.name}>Alamat</Label>
								<Textarea
									id={field.name}
									name={field.name}
									rows={3}
									placeholder="Alamat lengkap (opsional)"
									value={field.state.value}
									onChange={(event) =>
										field.handleChange(event.target.value)
									}
									onBlur={field.handleBlur}
								/>
							</div>
						)}
					</form.Field>

					<form.Subscribe
						selector={(state) => [
							state.canSubmit,
							state.isSubmitting,
						]}
					>
						{([canSubmit, formSubmitting]) => {
							const disabled =
								!canSubmit || formSubmitting || isSubmitting;
							return (
								<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
									<Button
										type="button"
										variant="outline"
										size="lg"
										nativeButton={false}
										render={
											<Link
												href={
													isUpdate && userId
														? `/dashboard/pengguna/${userId}`
														: '/dashboard/pengguna'
												}
											/>
										}
									>
										Batal
									</Button>
									<Button
										type="submit"
										size="lg"
										className="font-semibold"
										disabled={disabled}
									>
										{isSubmitting && (
											<Loader2Icon className="animate-spin" />
										)}
										{isSubmitting
											? 'Menyimpan...'
											: isUpdate
												? 'Simpan Perubahan'
												: 'Tambah Pengguna'}
									</Button>
								</div>
							);
						}}
					</form.Subscribe>
				</form>
			)}
		</div>
	);
}
