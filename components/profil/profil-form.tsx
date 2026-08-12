'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProfile } from '@/hooks/user.hook';
import { isApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/form';
import type { User } from '@/types/user';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

const profilSchema = z.object({
	name: z.string().min(1, 'Nama wajib diisi'),
	phone_number: z
		.string()
		.refine(
			(value) =>
				!value.trim() || /^[0-9+\-\s()]{8,16}$/.test(value.trim()),
			'Format nomor HP tidak valid',
		),
	address: z.string(),
});

type ProfilFormProps = {
	user: User;
	onCancel: () => void;
	onSaved: () => void;
};

export function ProfilForm({ user, onCancel, onSaved }: ProfilFormProps) {
	const updateProfile = useUpdateProfile();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			name: user.name,
			phone_number: user.phone_number ?? '',
			address: user.address ?? '',
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				await updateProfile.mutateAsync({
					name: value.name.trim(),
					phone_number: value.phone_number.trim() || null,
					address: value.address.trim() || null,
				});
				toast.success('Profil berhasil diperbarui');
				onSaved();
			} catch (error) {
				setServerError(
					isApiError(error)
						? error.message
						: 'Gagal menyimpan profil. Silakan coba lagi.',
				);
			}
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				void form.handleSubmit();
			}}
			noValidate
			className="flex flex-col gap-5 rounded-2xl bg-white p-6 ring-1 ring-border"
		>
			<div className="flex flex-col gap-1">
				<h2 className="text-headline-sm text-foreground">
					Edit Profil
				</h2>
				<p className="text-body-sm text-muted-foreground">
					Perbarui data diri yang dibutuhkan untuk pengiriman pesanan.
				</p>
			</div>

			{serverError && (
				<div
					role="alert"
					className="rounded-2xl bg-destructive/10 px-4 py-3 text-label-sm text-destructive"
				>
					{serverError}
				</div>
			)}

			<div className="flex flex-col gap-4 rounded-xl bg-surface-muted px-4 py-3">
				<div className="flex flex-col gap-0.5">
					<Label htmlFor="profil-email">Email</Label>
					<p className="text-body-sm text-muted-foreground">
						{user.email}
					</p>
				</div>
				<p className="text-caption text-muted-foreground">
					Email tidak dapat diubah pada halaman ini.
				</p>
			</div>

			<form.Field
				name="name"
				validators={{ onChange: profilSchema.shape.name }}
			>
				{(field) => {
					const error = getErrorMessage(field);
					return (
						<div className="flex flex-col gap-1.5">
							<Label htmlFor={field.name}>Nama Lengkap</Label>
							<Input
								id={field.name}
								name={field.name}
								autoComplete="name"
								placeholder="Nama lengkap kamu"
								value={field.state.value}
								onChange={(event) =>
									field.handleChange(event.target.value)
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
				name="phone_number"
				validators={{ onChange: profilSchema.shape.phone_number }}
			>
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
								placeholder="contoh: 081234567890"
								value={field.state.value}
								onChange={(event) =>
									field.handleChange(event.target.value)
								}
								onBlur={field.handleBlur}
								aria-invalid={error ? true : undefined}
							/>
							{error ? (
								<p className="text-caption text-destructive">
									{error}
								</p>
							) : (
								<p className="text-caption text-muted-foreground">
									Nomor HP untuk dihubungi saat pesanan tiba.
								</p>
							)}
						</div>
					);
				}}
			</form.Field>

			<form.Field
				name="address"
				validators={{ onChange: profilSchema.shape.address }}
			>
				{(field) => (
					<div className="flex flex-col gap-1.5">
						<Label htmlFor={field.name}>Alamat Pengiriman</Label>
						<Textarea
							id={field.name}
							name={field.name}
							placeholder="Contoh: Jl. Melati No. 12, RT 03/RW 05, Kel. Sukamaju, Kec. Sukamaju, Kota Bandung"
							value={field.state.value}
							onChange={(event) =>
								field.handleChange(event.target.value)
							}
							onBlur={field.handleBlur}
						/>
						<p className="text-caption text-muted-foreground">
							Tulis alamat lengkap agar barang mudah diantar.
						</p>
					</div>
				)}
			</form.Field>

			<div className="flex flex-wrap items-center gap-3 pt-1">
				<Button
					type="submit"
					size="lg"
					disabled={updateProfile.isPending}
				>
					{updateProfile.isPending ? (
						<Loader2Icon className="size-4 animate-spin" />
					) : (
						<SaveIcon />
					)}
					{updateProfile.isPending
						? 'Menyimpan...'
						: 'Simpan Perubahan'}
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="lg"
					onClick={onCancel}
					disabled={updateProfile.isPending}
				>
					Batal
				</Button>
			</div>
		</form>
	);
}
