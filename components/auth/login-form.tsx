'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/auth.hook';
import { userKeys } from '@/hooks/user.hook';
import { isApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/form';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email wajib diisi')
		.email('Format email tidak valid'),
	password: z.string().min(1, 'Kata sandi wajib diisi'),
});

function sanitizeRedirect(value: string | null): string {
	if (value && value.startsWith('/') && !value.startsWith('//')) {
		return value;
	}
	return '/';
}

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const login = useLogin();

	const [showPassword, setShowPassword] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				await login.mutateAsync({
					email: value.email.trim(),
					password: value.password,
				});
				await queryClient.invalidateQueries({
					queryKey: userKeys.me,
				});
				toast.success('Login berhasil');
				router.push(sanitizeRedirect(searchParams.get('redirect')));
				router.refresh();
			} catch (error) {
				setServerError(
					isApiError(error)
						? error.message
						: 'Gagal masuk. Silakan coba lagi.',
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
						Masuk ke Akun
					</h1>
					<p className="text-body-sm text-muted-foreground">
						Silakan masuk untuk melanjutkan belanja Anda.
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
						name="email"
						validators={{
							onChange: loginSchema.shape.email,
						}}
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
										autoComplete="email"
										inputMode="email"
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
						validators={{
							onChange: loginSchema.shape.password,
						}}
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
											autoComplete="current-password"
											placeholder="••••••••"
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
								disabled={!canSubmit || isSubmitting}
							>
								{isSubmitting && (
									<Loader2Icon className="animate-spin" />
								)}
								{isSubmitting ? 'Memproses...' : 'Masuk'}
							</Button>
						)}
					</form.Subscribe>

					<p className="text-center text-caption text-muted-foreground">
						Lupa akses? Hubungi admin toko untuk bantuan.{' '}
						<Link href="/" className="text-primary hover:underline">
							Kembali ke beranda
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	);
}
