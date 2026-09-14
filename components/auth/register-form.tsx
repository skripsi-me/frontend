'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRegister } from '@/hooks/auth.hook';
import { isApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/form';
import { useForm } from '@tanstack/react-form';
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const registerSchema = z.object({
	name: z.string().min(1, 'Nama wajib diisi'),
	email: z
		.string()
		.min(1, 'Email wajib diisi')
		.email('Format email tidak valid'),
	password: z.string().min(8, 'Password minimal 8 karakter'),
	phone_number: z
		.string()
		.refine(
			(value) =>
				!value.trim() || /^[0-9+\-\s()]{8,16}$/.test(value.trim()),
			'Format nomor HP tidak valid',
		),
	address: z.string(),
});

export function RegisterForm() {
	const router = useRouter();
	const register = useRegister();

	const [showPassword, setShowPassword] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			phone_number: '',
			address: '',
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				await register.mutateAsync({
					name: value.name.trim(),
					email: value.email.trim(),
					password: value.password,
					phone_number: value.phone_number.trim() || undefined,
					address: value.address.trim() || undefined,
				});
				toast.success('Akun berhasil dibuat. Silakan masuk.');
				router.push('/auth/login');
			} catch (error) {
				setServerError(
					isApiError(error)
						? error.message
						: 'Gagal membuat akun. Silakan coba lagi.',
				);
			}
		},
	});

	return (
		<Card className="w-full md:max-w-4xl">
			<CardHeader className="items-center gap-2 text-center">
				<Image
					src="/image/logo.png"
					alt="Rull Store"
					width={56}
					height={56}
					className="size-14 object-contain"
				/>
				<div className="flex flex-col gap-1">
					<h1 className="text-headline-lg text-foreground">
						Daftar Akun Baru
					</h1>
					<p className="text-body-sm text-muted-foreground">
						Buat akun untuk mulai belanja di Rull Store.
					</p>
				</div>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void form.handleSubmit();
					}}
					className="flex flex-col gap-4"
					noValidate
				>
					{serverError && (
						<div
							role="alert"
							className="rounded-2xl bg-destructive/10 px-4 py-3 text-label-sm text-destructive"
						>
							{serverError}
						</div>
					)}

					<form.Field
						name="name"
						validators={{ onChange: registerSchema.shape.name }}
					>
						{(field) => {
							const error = getErrorMessage(field);
							return (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>Nama</Label>
									<Input
										id={field.name}
										name={field.name}
										autoComplete="name"
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
						validators={{ onChange: registerSchema.shape.email }}
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
						validators={{ onChange: registerSchema.shape.password }}
					>
						{(field) => {
							const error = getErrorMessage(field);
							return (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>
										Kata Sandi
									</Label>
									<div className="relative">
										<Input
											id={field.name}
											name={field.name}
											type={
												showPassword
													? 'text'
													: 'password'
											}
											autoComplete="new-password"
											placeholder="Minimal 8 karakter"
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
											className="pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											aria-label={
												showPassword
													? 'Sembunyikan kata sandi'
													: 'Tampilkan kata sandi'
											}
											onClick={() =>
												setShowPassword(
													(visible) => !visible,
												)
											}
											className={cn(
												'absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground',
											)}
										>
											{showPassword ? (
												<EyeOffIcon />
											) : (
												<EyeIcon />
											)}
										</Button>
									</div>
									{error && (
										<p className="text-caption text-destructive">
											{error}
										</p>
									)}
								</div>
							);
						}}
					</form.Field>

					<form.Field name="phone_number">
						{(field) => {
							const error = getErrorMessage(field);
							return (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>Nomor HP</Label>
									<Input
										id={field.name}
										name={field.name}
										type="tel"
										inputMode="tel"
										autoComplete="tel"
										placeholder="081234567890"
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

					<form.Field name="address">
						{(field) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor={field.name}>Alamat</Label>
								<Textarea
									id={field.name}
									name={field.name}
									rows={3}
									required
									placeholder="Alamat lengkap"
									value={field.state.value}
									onChange={(event) =>
										field.handleChange(event.target.value)
									}
									onBlur={field.handleBlur}
								/>
								<p className="text-caption text-muted-foreground">
									Pastikan alamat yang anda masukkan sudah
									sesuai agar memudahkan proses pengiriman
									barang.
								</p>
							</div>
						)}
					</form.Field>

					<form.Subscribe
						selector={(state) => [
							state.canSubmit,
							state.isSubmitting,
						]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								size="lg"
								className="mt-1 w-full font-semibold"
								disabled={
									!canSubmit ||
									isSubmitting ||
									register.isPending
								}
							>
								{isSubmitting && (
									<Loader2Icon className="animate-spin" />
								)}
								{isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
							</Button>
						)}
					</form.Subscribe>

					<p className="text-center text-caption text-muted-foreground">
						Sudah punya akun?{' '}
						<Link
							href="/auth/login"
							className="text-primary hover:underline"
						>
							Masuk
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	);
}
