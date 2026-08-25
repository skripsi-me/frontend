'use client';

import { EmptyState } from '@/components/empty-state';
import { PaginationNav } from '@/components/pagination-nav';
import { Price } from '@/components/price';
import { ProductImage } from '@/components/product-image';
import { StockBadge } from '@/components/stock-badge';
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
import { useCategories } from '@/hooks/category.hook';
import { useDeleteProduct, useProducts } from '@/hooks/product.hook';
import { isApiError } from '@/lib/api';
import type { Product } from '@/types/product';
import {
	EyeIcon,
	Loader2Icon,
	PencilIcon,
	PlusIcon,
	RefreshCcwIcon,
	SearchIcon,
	Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function TableSkeleton({ rows = 8 }: { rows?: number }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, i) => (
				<TableRow key={i}>
					<TableCell>
						<div className="flex items-center gap-3">
							<Skeleton className="size-10 shrink-0 rounded-lg" />
							<div className="flex flex-col gap-1.5">
								<Skeleton className="h-4 w-36" />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-5 w-16 rounded-full" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-12" />
					</TableCell>
					<TableCell>
						<div className="flex items-center justify-end gap-2">
							<Skeleton className="size-8 rounded-full" />
							<Skeleton className="size-8 rounded-full" />
							<Skeleton className="size-8 rounded-full" />
						</div>
					</TableCell>
				</TableRow>
			))}
		</>
	);
}

function MobileProductCards({
	products,
	onDelete,
}: {
	products: Product[];
	onDelete: (product: Product) => void;
}) {
	return (
		<div className="flex flex-col gap-3 md:hidden">
			{products.map((product) => (
				<div
					key={product.id}
					className="flex items-start gap-3 rounded-xl border border-border p-3"
				>
					<div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
						{product.image_url ? (
							<ProductImage
								src={product.image_url}
								alt={product.name}
								sizes="56px"
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full items-center justify-center text-muted-foreground">
								<SearchIcon className="size-4" />
							</div>
						)}
					</div>
					<div className="min-w-0 flex-1">
						<p className="line-clamp-2 font-medium text-foreground">
							{product.name}
						</p>
						<p className="truncate text-caption text-muted-foreground">
							{product.category.name}
						</p>
						<div className="mt-1.5 flex flex-wrap items-center gap-2">
							<Price value={product.price} />
							<StockBadge stock={product.stock} />
						</div>
						<div className="mt-1.5 flex items-center justify-between gap-2">
							<span className="text-caption tabular-nums text-muted-foreground">
								Terjual {product.total_sold ?? 0}
							</span>
							<div className="flex items-center gap-1.5">
								<Button
									variant="ghost"
									size="icon-sm"
									nativeButton={false}
									render={
										<Link
											href={`/dashboard/produk/${product.id}`}
										/>
									}
									aria-label={`Lihat detail ${product.name}`}
								>
									<EyeIcon />
								</Button>
								<Button
									variant="outline"
									size="icon-sm"
									nativeButton={false}
									render={
										<Link
											href={`/dashboard/produk/${product.id}/update`}
										/>
									}
									aria-label={`Ubah ${product.name}`}
								>
									<PencilIcon />
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									className="text-destructive"
									onClick={() => onDelete(product)}
									aria-label={`Hapus ${product.name}`}
								>
									<Trash2Icon />
								</Button>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export function ProdukAdminList() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = Math.max(1, Number(searchParams.get('page')) || 1);
	const search = (searchParams.get('search') ?? '').trim();
	const category = searchParams.get('category') ?? '';

	const [searchInput, setSearchInput] = useState(search);
	const [productToDelete, setProductToDelete] = useState<Product | null>(
		null,
	);

	const searchParamsRef = useRef(searchParams);

	useEffect(() => {
		searchParamsRef.current = searchParams;
	});

	const { data, isPending, isError, error, refetch } = useProducts({
		page,
		limit: PAGE_SIZE,
		search: search || undefined,
		category_id: category || undefined,
	});
	const { data: categories } = useCategories();
	const deleteProduct = useDeleteProduct();

	useEffect(() => {
		const timer = setTimeout(() => {
			const params = new URLSearchParams(
				searchParamsRef.current.toString(),
			);
			if (searchInput.trim()) {
				params.set('search', searchInput.trim());
			} else {
				params.delete('search');
			}
			params.set('page', '1');
			router.replace(`${pathname}?${params.toString()}`);
		}, 400);
		return () => clearTimeout(timer);
	}, [searchInput, pathname, router]);

	function updateFilter(key: 'category', value: string) {
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
		if (!productToDelete || deleteProduct.isPending) return;
		try {
			await deleteProduct.mutateAsync(productToDelete.id);
			toast.success(`Produk "${productToDelete.name}" dihapus.`);
			setProductToDelete(null);
		} catch (error) {
			toast.error(
				isApiError(error) ? error.message : 'Gagal menghapus produk.',
			);
		}
	}

	const products = data?.data ?? [];
	const totalPages = data?.meta.total_pages ?? 1;
	const total = data?.meta.total ?? products.length;

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
			<div className="flex flex-wrap items-center justify-between gap-3 pb-6">
				<div className="flex flex-col gap-1">
					<h1 className="text-headline-lg text-foreground">
						Kelola Produk
					</h1>
					<p className="text-body-sm text-muted-foreground">
						Kelola katalog produk, stok, dan harga.
					</p>
				</div>
				<Button
					size="lg"
					className="font-semibold"
					nativeButton={false}
					render={<Link href="/dashboard/produk/buat" />}
				>
					<PlusIcon />
					Tambah Produk
				</Button>
			</div>

			<div className="grid w-full grid-cols-1 items-center gap-3 pb-6 sm:grid sm:grid-cols-[1fr_auto]">
				<div className="relative w-full">
					<SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Cari produk..."
						aria-label="Cari produk"
						value={searchInput}
						onChange={(event) => setSearchInput(event.target.value)}
						className="pl-9"
					/>
				</div>
				<Select
					value={category}
					onValueChange={(value) =>
						updateFilter('category', value ?? '')
					}
				>
					<SelectTrigger
						size="default"
						className="w-full"
						aria-label="Filter kategori"
					>
						<SelectValue placeholder="Semua kategori" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Semua kategori</SelectItem>
						{categories?.map((item) => (
							<SelectItem key={item.id} value={item.id}>
								{item.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-1 flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-border">
				{isError ? (
					<Alert variant="destructive">
						<AlertTitle>Gagal memuat produk</AlertTitle>
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
					<>
						<div className="flex flex-col gap-3 md:hidden">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex items-start gap-3 rounded-xl border border-border p-3"
								>
									<Skeleton className="size-14 shrink-0 rounded-lg" />
									<div className="flex flex-1 flex-col gap-2">
										<Skeleton className="h-4 w-2/3" />
										<Skeleton className="h-3 w-24" />
										<Skeleton className="h-5 w-28" />
									</div>
								</div>
							))}
						</div>
						<div className="hidden overflow-x-auto md:block">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Produk</TableHead>
										<TableHead>Kategori</TableHead>
										<TableHead>Harga</TableHead>
										<TableHead>Stok</TableHead>
										<TableHead>Terjual</TableHead>
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
					</>
				) : products.length === 0 ? (
					<EmptyState
						icon={SearchIcon}
						title="Produk tidak ditemukan"
						description={
							search || category
								? 'Tidak ada produk yang cocok dengan filter. Coba ubah kata kunci atau kategori.'
								: 'Belum ada produk. Mulai tambahkan produk pertama.'
						}
						className="rounded-xl bg-surface-muted py-10"
					/>
				) : (
					<>
						<MobileProductCards
							products={products}
							onDelete={setProductToDelete}
						/>
						<div className="hidden overflow-x-auto md:block">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Produk</TableHead>
										<TableHead>Kategori</TableHead>
										<TableHead>Harga</TableHead>
										<TableHead>Stok</TableHead>
										<TableHead>Terjual</TableHead>
										<TableHead className="text-right">
											Aksi
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.map((product) => (
										<TableRow key={product.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
														{product.image_url ? (
															<ProductImage
																src={
																	product.image_url
																}
																alt={
																	product.name
																}
																sizes="40px"
																className="h-full w-full object-cover"
															/>
														) : (
															<div className="flex h-full items-center justify-center text-muted-foreground">
																<SearchIcon className="size-4" />
															</div>
														)}
													</div>
													<span className="line-clamp-1 max-w-40 font-medium text-foreground">
														{product.name}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{product.category.name}
											</TableCell>
											<TableCell className="tabular-nums">
												<Price value={product.price} />
											</TableCell>
											<TableCell>
												<StockBadge
													stock={product.stock}
												/>
											</TableCell>
											<TableCell className="tabular-nums text-muted-foreground">
												{product.total_sold ?? 0}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1.5">
													<Button
														variant="ghost"
														size="icon-sm"
														nativeButton={false}
														render={
															<Link
																href={`/dashboard/produk/${product.id}`}
															/>
														}
														aria-label={`Lihat detail ${product.name}`}
													>
														<EyeIcon />
													</Button>
													<Button
														variant="outline"
														size="icon-sm"
														nativeButton={false}
														render={
															<Link
																href={`/dashboard/produk/${product.id}/update`}
															/>
														}
														aria-label={`Ubah ${product.name}`}
													>
														<PencilIcon />
													</Button>
													<Button
														variant="destructive"
														size="icon-sm"
														onClick={() =>
															setProductToDelete(
																product,
															)
														}
														aria-label={`Hapus ${product.name}`}
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
								Menampilkan {products.length} dari {total}{' '}
								produk
							</p>
						</div>
					</>
				)}
			</div>

			<Dialog
				open={Boolean(productToDelete)}
				onOpenChange={(open) => {
					if (!open) setProductToDelete(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Hapus produk?</DialogTitle>
						<DialogDescription>
							Produk &quot;{productToDelete?.name}&quot; akan
							dihapus secara permanen. Tindakan ini tidak dapat
							dibatalkan.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setProductToDelete(null)}
						>
							Batal
						</Button>
						<Button
							variant="destructive"
							disabled={deleteProduct.isPending}
							onClick={handleDelete}
						>
							{deleteProduct.isPending && (
								<Loader2Icon className="animate-spin" />
							)}
							{deleteProduct.isPending ? 'Menghapus...' : 'Hapus'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
