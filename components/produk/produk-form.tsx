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
import { useCategories } from '@/hooks/category.hook';
import {
	useCreateProduct,
	useProductById,
	useUpdateProduct,
} from '@/hooks/product.hook';
import { isApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/form';
import type {
	CreateProductRequest,
	UpdateProductRequest,
} from '@/types/product';
import { useForm } from '@tanstack/react-form';
import { ArrowLeftIcon, ImageIcon, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const productSchema = z.object({
	name: z.string().min(1, 'Nama produk wajib diisi'),
	description: z.string(),
	price: z
		.string()
		.min(1, 'Harga wajib diisi')
		.refine((value) => Number(value) >= 0, 'Harga tidak boleh negatif'),
	stock: z
		.string()
		.min(1, 'Stok wajib diisi')
		.refine(
			(value) => Number.isInteger(Number(value)) && Number(value) >= 0,
			'Stok harus angka bulat dan tidak negatif',
		),
	category_id: z.string().min(1, 'Kategori wajib dipilih'),
});

export function ProdukForm({
	mode,
	productId,
}: {
	mode: 'create' | 'update';
	productId?: string;
}) {
	const router = useRouter();
	const isUpdate = mode === 'update';

	const { data: categories } = useCategories();
	const { data: product, isPending: isProductPending } = useProductById(
		isUpdate ? productId : undefined,
	);
	const createProduct = useCreateProduct();
	const updateProduct = useUpdateProduct();

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [serverError, setServerError] = useState<string | null>(null);
	const objectUrlRef = useRef<string | null>(null);

	const form = useForm({
		defaultValues: {
			name: '',
			description: '',
			price: '',
			stock: '',
			category_id: '',
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			const payload: CreateProductRequest = {
				name: value.name.trim(),
				description: value.description.trim() || undefined,
				price: Number(value.price),
				stock: Number(value.stock),
				category_id: value.category_id,
			};
			if (selectedImage) {
				payload.image = selectedImage;
			} else if (isUpdate && product?.image_url) {
				payload.image_url = product.image_url;
			}

			try {
				if (isUpdate && productId) {
					await updateProduct.mutateAsync({
						id: productId,
						data: payload as UpdateProductRequest,
					});
					toast.success('Produk berhasil diperbarui.');
					router.push(`/dashboard/produk/${productId}`);
				} else {
					const created = await createProduct.mutateAsync(payload);
					toast.success('Produk berhasil ditambahkan.');
					router.push(`/dashboard/produk/${created.id}`);
				}
			} catch (error) {
				setServerError(
					isApiError(error)
						? error.message
						: 'Gagal menyimpan produk. Silakan coba lagi.',
				);
			}
		},
	});

	useEffect(() => {
		if (product) {
			form.reset({
				name: product.name,
				description: product.description ?? '',
				price: String(Number(product.price)),
				stock: String(product.stock),
				category_id: product.category_id,
			});
		}
	}, [product, form]);

	useEffect(
		() => () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
			}
		},
		[],
	);

	function handleImageChange(file: File | null) {
		setSelectedImage(file);
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}
		setPreviewUrl(file ? URL.createObjectURL(file) : null);
	}

	const displayedPreview =
		previewUrl ?? (isUpdate ? (product?.image_url ?? null) : null);
	const isSubmitting = createProduct.isPending || updateProduct.isPending;

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
								isUpdate && productId
									? `/dashboard/produk/${productId}`
									: '/dashboard/produk'
							}
						/>
					}
					aria-label="Kembali"
				>
					<ArrowLeftIcon />
				</Button>
				<h1 className="text-headline-lg text-foreground">
					{isUpdate ? 'Ubah Produk' : 'Tambah Produk'}
				</h1>
			</div>

			{isUpdate && isProductPending ? (
				<div className="flex flex-col gap-5 rounded-xl bg-white p-6 ring-1 ring-border">
					<Skeleton className="h-10 w-2/3" />
					<Skeleton className="h-24 w-full" />
					<div className="grid gap-4 sm:grid-cols-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-40 w-full" />
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
						validators={{ onChange: productSchema.shape.name }}
					>
						{(field) => {
							const error = getErrorMessage(field);
							return (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>
										Nama Produk
									</Label>
									<Input
										id={field.name}
										name={field.name}
										placeholder="cth. Susu UHT Full Cream 1L"
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

					<form.Field name="description">
						{(field) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor={field.name}>Deskripsi</Label>
								<Textarea
									id={field.name}
									name={field.name}
									rows={4}
									placeholder="Deskripsi lengkap produk (opsional)"
									value={field.state.value}
									onChange={(event) =>
										field.handleChange(event.target.value)
									}
									onBlur={field.handleBlur}
								/>
							</div>
						)}
					</form.Field>

					<div className="grid gap-4 sm:grid-cols-2">
						<form.Field
							name="price"
							validators={{ onChange: productSchema.shape.price }}
						>
							{(field) => {
								const error = getErrorMessage(field);
								return (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor={field.name}>
											Harga (Rp)
										</Label>
										<Input
											id={field.name}
											name={field.name}
											type="number"
											inputMode="numeric"
											min="0"
											step="any"
											placeholder="0"
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
							name="stock"
							validators={{ onChange: productSchema.shape.stock }}
						>
							{(field) => {
								const error = getErrorMessage(field);
								return (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor={field.name}>Stok</Label>
										<Input
											id={field.name}
											name={field.name}
											type="number"
											inputMode="numeric"
											min="0"
											step="1"
											placeholder="0"
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
					</div>

					<form.Field
						name="category_id"
						validators={{
							onChange: productSchema.shape.category_id,
						}}
					>
						{(field) => {
							const error = getErrorMessage(field);
							return (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>Kategori</Label>
									<Select
										value={field.state.value}
										onValueChange={(value) =>
											field.handleChange(value ?? '')
										}
									>
										<SelectTrigger
											className="w-full"
											aria-invalid={
												error ? true : undefined
											}
										>
											<SelectValue placeholder="Pilih kategori" />
										</SelectTrigger>
										<SelectContent>
											{categories?.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}
												>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{error && (
										<p className="text-caption text-destructive">
											{error}
										</p>
									)}
								</div>
							);
						}}
					</form.Field>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="product-image">Gambar Produk</Label>
						<div className="flex items-start gap-4">
							<div
								className={cn(
									'relative flex aspect-square w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-muted text-muted-foreground',
								)}
							>
								{displayedPreview ? (
									<Image
										src={displayedPreview}
										alt="Pratinjau gambar produk"
										fill
										className="object-cover"
									/>
								) : (
									<ImageIcon className="size-8" />
								)}
							</div>
							<div className="flex flex-1 flex-col gap-1.5">
								<Input
									id="product-image"
									name="product-image"
									type="file"
									accept="image/jpeg,image/png,image/webp,image/gif"
									onChange={(event) =>
										handleImageChange(
											event.target.files?.[0] ?? null,
										)
									}
								/>
								<p className="text-caption text-muted-foreground">
									Format: JPG, PNG, WebP, atau GIF. Kosongkan
									untuk memakai gambar saat ini.
								</p>
							</div>
						</div>
					</div>

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
													isUpdate && productId
														? `/dashboard/produk/${productId}`
														: '/dashboard/produk'
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
												: 'Tambah Produk'}
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
