'use client';

import { RequireAuth } from '@/components/auth/require-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePassword } from '@/hooks/auth.hook';
import { isApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/form';
import { useForm } from '@tanstack/react-form';
import {
	CheckCircle2Icon,
	EyeIcon,
	EyeOffIcon,
	Loader2Icon,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const ubahPasswordSchema = z
	.object({
		old_password: z.string().min(1, 'Kata sandi lama wajib diisi'),
		new_password: z.string().min(8, 'Kata sandi baru minimal 8 karakter'),
		confirm_password: z.string().min(1, 'Ulangi kata sandi baru'),
	})
	.refine((value) => value.new_password === value.confirm_password, {
		message: 'Konfirmasi kata sandi tidak cocok',
		path: ['confirm_password'],
	});

type PasswordFieldProps = {
	visible: boolean;
	onToggleVisibility: () => void;
	className?: string;
} & React.ComponentProps<typeof Input>;

function PasswordInput({
	visible,
	onToggleVisibility,
	className,
	...props
}: PasswordFieldProps) {
	return (
		<div className="relative">
			<Input
				type={visible ? 'text' : 'password'}
				className={cn('pr-10', className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={
					visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
				}
				onClick={onToggleVisibility}
				className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
			>
				{visible ? <EyeOffIcon /> : <EyeIcon />}
			</Button>
		</div>
	);
}

export function UbahPasswordForm() {
	const router = useRouter();
	const changePassword = useChangePassword();

	const [showOld, setShowOld] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const form = useForm({
		defaultValues: {
			old_password: '',
			new_password: '',
			confirm_password: '',
		},
		validators: { onChange: ubahPasswordSchema },
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				await changePassword.mutateAsync({
					old_password: value.old_password,
					new_password: value.new_password,
				});
				toast.success('Kata sandi berhasil diperbarui');
				form.reset();
				setSuccess(true);
			} catch (error) {
				setSuccess(false);
				setServerError(
					isApiError(error)
						? error.message
						: 'Gagal mengubah kata sandi. Silakan coba lagi.',
				);
			}
		},
	});

	return (
		<RequireAuth>
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
							Ubah Kata Sandi
						</h1>
						<p className="text-body-sm text-muted-foreground">
							Ganti kata sandi secara berkala untuk menjaga
							keamanan akun belanja kamu.
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
						{success && (
							<div
								role="status"
								className="flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-label-sm text-success"
							>
								<CheckCircle2Icon className="size-4 shrink-0" />
								Kata sandi kamu berhasil diperbarui.
							</div>
						)}

						{serverError && (
							<div
								role="alert"
								className="flex flex-col gap-1 rounded-2xl bg-destructive/10 px-4 py-3 text-label-sm text-destructive"
							>
								{serverError}
							</div>
						)}

						<form.Subscribe selector={(state) => state.errors}>
							{(errors) => {
								const formErrors = errors
									.flatMap((error) =>
										Array.isArray(error) ? error : [error],
									)
									.map((error) =>
										typeof error === 'string'
											? error
											: error?.message,
									)
									.filter(Boolean) as string[];
								if (formErrors.length === 0) return null;
								return (
									<div
										role="alert"
										className="flex flex-col gap-1 rounded-2xl bg-destructive/10 px-4 py-3 text-label-sm text-destructive"
									>
										{formErrors.map((error) => (
											<span key={error}>{error}</span>
										))}
									</div>
								);
							}}
						</form.Subscribe>

						<form.Field
							name="old_password"
							validators={{
								onChange: ubahPasswordSchema.shape.old_password,
							}}
						>
							{(field) => {
								const error = getErrorMessage(field);
								return (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor={field.name}>
											Kata Sandi Lama
										</Label>
										<PasswordInput
											id={field.name}
											name={field.name}
											autoComplete="current-password"
											placeholder="Masukkan kata sandi lama"
											visible={showOld}
											onToggleVisibility={() =>
												setShowOld((v) => !v)
											}
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

						<form.Field
							name="new_password"
							validators={{
								onChange: ubahPasswordSchema.shape.new_password,
							}}
						>
							{(field) => {
								const error = getErrorMessage(field);
								return (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor={field.name}>
											Kata Sandi Baru
										</Label>
										<PasswordInput
											id={field.name}
											name={field.name}
											autoComplete="new-password"
											placeholder="Minimal 8 karakter"
											visible={showNew}
											onToggleVisibility={() =>
												setShowNew((v) => !v)
											}
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
										{error ? (
											<p className="text-caption text-destructive">
												{error}
											</p>
										) : (
											<p className="text-caption text-muted-foreground">
												Gunakan minimal 8 karakter agar
												lebih aman.
											</p>
										)}
									</div>
								);
							}}
						</form.Field>

						<form.Field
							name="confirm_password"
							validators={{
								onChange:
									ubahPasswordSchema.shape.confirm_password,
							}}
						>
							{(field) => {
								const error = getErrorMessage(field);
								return (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor={field.name}>
											Ulangi Kata Sandi Baru
										</Label>
										<PasswordInput
											id={field.name}
											name={field.name}
											autoComplete="new-password"
											placeholder="Ketik ulang kata sandi baru"
											visible={showConfirm}
											onToggleVisibility={() =>
												setShowConfirm((v) => !v)
											}
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

						<form.Subscribe selector={(state) => state.canSubmit}>
						{(canSubmit) => (
							<Button
								type="submit"
								size="lg"
								className="mt-1 w-full"
								disabled={!canSubmit || changePassword.isPending}
							>
								{changePassword.isPending ? (
									<>
										<Loader2Icon className="size-4 animate-spin" />
										Menyimpan...
									</>
								) : (
									'Simpan Kata Sandi'
								)}
							</Button>
						)}
					</form.Subscribe>

						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => router.push('/profil')}
							className="w-full"
						>
							Kembali ke Profil
						</Button>
					</form>
				</CardContent>
			</Card>
		</RequireAuth>
	);
}
