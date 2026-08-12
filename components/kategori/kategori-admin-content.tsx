'use client';

import { EmptyState } from '@/components/empty-state';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
	useCreateCategory,
	useDeleteCategory,
	useUpdateCategory,
} from '@/hooks/category.hook';
import { useCategories } from '@/hooks/category.hook';
import { isApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/form';
import type {
	Category,
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from '@/types/category';
import { useForm } from '@tanstack/react-form';
import {
	Loader2Icon,
	PencilIcon,
	PlusIcon,
	RefreshCcwIcon,
	TagsIcon,
	Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const categorySchema = z.object({
	name: z.string().min(1, 'Nama kategori wajib diisi'),
	description: z.string(),
});

type CategoryDialogState = {
	mode: 'create' | 'edit';
	category: Category | null;
};

function CategorySkeleton() {
	return (
		<>
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center gap-3 rounded-xl border border-border p-4"
				>
					<Skeleton className="size-10 rounded-full" />
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-3 w-64" />
					</div>
					<Skeleton className="size-8 rounded-md" />
				</div>
			))}
		</>
	);
}

export function KategoriAdminContent() {
	const {
		data: categories,
		isPending,
		isError,
		error,
		refetch,
	} = useCategories();
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();
	const deleteCategory = useDeleteCategory();

	const [dialog, setDialog] = useState<CategoryDialogState>({
		mode: 'create',
		category: null,
	});
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null,
	);

	const form = useForm({
		defaultValues: {
			name: '',
			description: '',
		},
		onSubmit: async ({ value }) => {
			const payload: CreateCategoryRequest = {
				name: value.name.trim(),
				description: value.description.trim() || undefined,
			};
			try {
				if (dialog.mode === 'edit' && dialog.category) {
					await updateCategory.mutateAsync({
						id: dialog.category.id,
						data: payload as UpdateCategoryRequest,
					});
					toast.success('Kategori berhasil diperbarui.');
				} else {
					await createCategory.mutateAsync(payload);
					toast.success('Kategori berhasil ditambahkan.');
				}
				setDialog({ mode: 'create', category: null });
			} catch (error) {
				toast.error(
					isApiError(error)
						? error.message
						: 'Gagal menyimpan kategori.',
				);
			}
		},
	});

	async function handleDelete() {
		if (!categoryToDelete || deleteCategory.isPending) return;
		try {
			await deleteCategory.mutateAsync(categoryToDelete.id);
			toast.success(`Kategori "${categoryToDelete.name}" dihapus.`);
			setCategoryToDelete(null);
		} catch (error) {
			toast.error(
				isApiError(error) ? error.message : 'Gagal menghapus kategori.',
			);
		}
	}

	function openEdit(category: Category) {
		form.reset({
			name: category.name,
			description: category.description ?? '',
		});
		setDialog({ mode: 'edit', category });
	}

	function openCreate() {
		form.reset({ name: '', description: '' });
		setDialog({ mode: 'create', category: null });
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
			<div className="flex flex-wrap items-center justify-between gap-3 pb-6">
				<div className="flex flex-col gap-1">
					<h1 className="text-headline-lg text-foreground">
						Kelola Kategori
					</h1>
					<p className="text-body-sm text-muted-foreground">
						Kelola kategori produk toko.
					</p>
				</div>
				<Button
					size="lg"
					className="font-semibold"
					onClick={openCreate}
				>
					<PlusIcon />
					Tambah Kategori
				</Button>
			</div>

			<div className="flex flex-1 flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-border">
				{isError ? (
					<Alert variant="destructive">
						<AlertTitle>Gagal memuat kategori</AlertTitle>
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
					<CategorySkeleton />
				) : !categories || categories.length === 0 ? (
					<EmptyState
						icon={TagsIcon}
						title="Belum ada kategori"
						description="Mulai tambahkan kategori produk pertama."
						className="rounded-xl bg-surface-muted py-10"
					/>
				) : (
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						{categories.map((category) => (
							<div
								key={category.id}
								className="flex items-start gap-3 rounded-xl border border-border p-4"
							>
								<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-green-700">
									<TagsIcon className="size-5" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<p className="truncate font-medium text-foreground">
											{category.name}
										</p>
										<span className="truncate text-caption text-muted-foreground">
											/{category.slug}
										</span>
									</div>
									<p className="line-clamp-2 text-body-sm text-muted-foreground">
										{category.description ||
											'Tidak ada deskripsi.'}
									</p>
								</div>
								<div className="flex shrink-0 items-center gap-1.5">
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => openEdit(category)}
										aria-label={`Ubah ${category.name}`}
									>
										<PencilIcon />
									</Button>
									<Button
										variant="ghost"
										size="icon-sm"
										className="text-destructive"
										onClick={() =>
											setCategoryToDelete(category)
										}
										aria-label={`Hapus ${category.name}`}
									>
										<Trash2Icon />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<Dialog
				open={Boolean(dialog.category) || dialog.mode === 'create'}
				onOpenChange={(open) => {
					if (!open) setDialog({ mode: 'create', category: null });
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{dialog.mode === 'edit'
								? 'Ubah Kategori'
								: 'Tambah Kategori'}
						</DialogTitle>
						<DialogDescription>
							{dialog.mode === 'edit'
								? 'Perbarui informasi kategori.'
								: 'Buat kategori baru untuk produk.'}
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							event.stopPropagation();
							void form.handleSubmit();
						}}
						className="flex flex-col gap-4"
						noValidate
					>
						<form.Field
							name="name"
							validators={{ onChange: categorySchema.shape.name }}
						>
							{(field) => {
								const error = getErrorMessage(field);
								return (
									<div className="flex flex-col gap-1.5">
										<Label htmlFor={field.name}>
											Nama Kategori
										</Label>
										<Input
											id={field.name}
											name={field.name}
											placeholder="cth. Sembako"
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

						<form.Field name="description">
							{(field) => (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor={field.name}>
										Deskripsi
									</Label>
									<Textarea
										id={field.name}
										name={field.name}
										rows={3}
										placeholder="Deskripsi kategori (opsional)"
										value={field.state.value}
										onChange={(event) =>
											field.handleChange(
												event.target.value,
											)
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
								const busy =
									createCategory.isPending ||
									updateCategory.isPending;
								const disabled =
									!canSubmit || formSubmitting || busy;
								return (
									<DialogFooter>
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												setDialog({
													mode: 'create',
													category: null,
												})
											}
										>
											Batal
										</Button>
										<Button
											type="submit"
											disabled={disabled}
										>
											{busy && (
												<Loader2Icon className="animate-spin" />
											)}
											{busy
												? 'Menyimpan...'
												: dialog.mode === 'edit'
													? 'Simpan Perubahan'
													: 'Tambah Kategori'}
										</Button>
									</DialogFooter>
								);
							}}
						</form.Subscribe>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={Boolean(categoryToDelete)}
				onOpenChange={(open) => {
					if (!open) setCategoryToDelete(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Hapus kategori?</DialogTitle>
						<DialogDescription>
							Kategori &quot;{categoryToDelete?.name}&quot; akan
							dihapus secara permanen. Tindakan ini tidak dapat
							dibatalkan.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCategoryToDelete(null)}
						>
							Batal
						</Button>
						<Button
							variant="destructive"
							disabled={deleteCategory.isPending}
							onClick={handleDelete}
						>
							{deleteCategory.isPending && (
								<Loader2Icon className="animate-spin" />
							)}
							{deleteCategory.isPending
								? 'Menghapus...'
								: 'Hapus'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
