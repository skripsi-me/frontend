'use client';

import { EmptyState } from '@/components/empty-state';
import { ProductCard } from '@/components/product-card';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';
import { ProductImage } from '@/components/product-image';
import { SectionHeader } from '@/components/section-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddCartItem, useCart } from '@/hooks/cart.hook';
import { useProductBySlug, useProducts } from '@/hooks/product.hook';
import { isApiError } from '@/lib/api';
import { formatRupiah } from '@/lib/utils/format';
import { useAuth } from '@/providers/auth-provider';
import type { Product } from '@/types/product';
import {
	ChevronRightIcon,
	MinusIcon,
	PackageIcon,
	PlusIcon,
	ShoppingCartIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

function DetailSkeleton() {
	return (
		<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
			<Skeleton className="aspect-square w-full rounded-2xl" />
			<div className="flex flex-col gap-4">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-9 w-3/4" />
				<Skeleton className="h-10 w-40" />
				<Skeleton className="h-5 w-24" />
				<div className="flex items-center gap-3">
					<Skeleton className="h-10 w-28 rounded-full" />
					<Skeleton className="h-10 flex-1 rounded-full" />
				</div>
			</div>
		</div>
	);
}

function RelatedProducts({
	categoryId,
	currentId,
}: {
	categoryId: string;
	currentId: string;
}) {
	const { data, isPending } = useProducts({
		category_id: categoryId,
		limit: 8,
	});

	if (isPending) {
		return <ProductGridSkeleton count={4} />;
	}

	const products = (data?.data ?? [])
		.filter((product) => product.id !== currentId)
		.slice(0, 4);

	if (products.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
			{products.map((product, index) => (
				<ProductCard
					key={product.id}
					product={product}
					eager={index === 0}
				/>
			))}
		</div>
	);
}

function AddToCartControls({ product }: { product: Product }) {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const addItem = useAddCartItem();
	const cart = useCart();

	const [quantity, setQuantity] = useState(1);
	const outOfStock = product.stock <= 0;
	const maxQuantity = Math.max(1, product.stock);
	const alreadyInCart = cart.data?.items?.some(
		(item) => item.product_id === product.id,
	);

	function handleAddToCart() {
		if (!isAuthenticated) {
			toast('Silakan masuk terlebih dahulu', {
				description:
					'Anda perlu masuk untuk menambahkan produk ke keranjang.',
				action: {
					label: 'Masuk',
					onClick: () => router.push('/auth/login'),
				},
			});
			return;
		}

		addItem.mutate(
			{ product_id: product.id, quantity },
			{
				onSuccess: () => {
					toast.success('Ditambahkan ke keranjang');
				},
				onError: (error) => {
					toast.error(
						isApiError(error)
							? error.message
							: 'Gagal menambahkan produk ke keranjang',
					);
				},
			},
		);
	}

	return (
		<>
			<div className="mt-2 flex flex-wrap items-center gap-3">
				<div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Kurangi jumlah"
						disabled={quantity <= 1}
						onClick={() => setQuantity((q) => Math.max(1, q - 1))}
					>
						<MinusIcon />
					</Button>
					<span
						aria-live="polite"
						className="w-10 text-center text-label-md text-foreground"
					>
						{quantity}
					</span>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Tambah jumlah"
						disabled={outOfStock || quantity >= maxQuantity}
						onClick={() =>
							setQuantity((q) => Math.min(maxQuantity, q + 1))
						}
					>
						<PlusIcon />
					</Button>
				</div>

				<Button
					size="lg"
					disabled={outOfStock || addItem.isPending}
					onClick={handleAddToCart}
					className="flex-1 sm:flex-none"
				>
					<ShoppingCartIcon />
					{outOfStock
						? 'Stok habis'
						: alreadyInCart
							? 'Tambah lagi ke keranjang'
							: 'Tambah ke Keranjang'}
				</Button>
			</div>

			{!isAuthenticated && (
				<p className="text-caption text-muted-foreground">
					Perlu masuk untuk menambahkan produk ke keranjang.{' '}
					<Link
						href="/auth/login"
						className="text-primary hover:underline"
					>
						Masuk
					</Link>
				</p>
			)}
		</>
	);
}

export function ProdukDetailContent() {
	const params = useParams();
	const slug = typeof params?.id === 'string' ? params.id : '';

	const { data: product, isPending, isError, error } = useProductBySlug(slug);

	if (isPending) {
		return (
			<main className="flex flex-1 flex-col">
				<section className="border-b border-border">
					<div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
						<DetailSkeleton />
					</div>
				</section>
			</main>
		);
	}

	if (isError || !product) {
		const notFound = isApiError(error) && error.status === 404;
		return (
			<main className="flex flex-1 flex-col">
				<section className="border-b border-border">
					<div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 md:px-6 md:py-24">
						<EmptyState
							icon={notFound ? PackageIcon : undefined}
							title={
								notFound
									? 'Produk tidak ditemukan'
									: 'Gagal memuat produk'
							}
							description={
								notFound
									? 'Produk yang Anda cari mungkin sudah tidak tersedia.'
									: 'Terjadi kesalahan saat menghubungi server. Silakan coba lagi.'
							}
						/>
						<Button
							variant="outline"
							className="mt-4"
							nativeButton={false}
							render={<Link href="/produk" />}
						>
							Kembali ke katalog
						</Button>
					</div>
				</section>
			</main>
		);
	}

	const outOfStock = product.stock <= 0;

	return (
		<main className="flex flex-1 flex-col">
			<section className="border-b border-border bg-surface-muted">
				<div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-4 md:px-6">
					<nav
						aria-label="Breadcrumb"
						className="flex min-w-0 items-center gap-1.5 text-label-sm text-muted-foreground"
					>
						<Link
							href="/"
							className="shrink-0 transition-colors hover:text-primary"
						>
							Beranda
						</Link>
						<ChevronRightIcon className="size-3.5 shrink-0" />
						<Link
							href="/produk"
							className="shrink-0 transition-colors hover:text-primary"
						>
							Produk
						</Link>
						<ChevronRightIcon className="size-3.5 shrink-0" />
						<span className="truncate font-medium text-foreground">
							{product.name}
						</span>
					</nav>
				</div>
			</section>

			<section className="border-b border-border">
				<div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
					<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
						<div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted lg:sticky lg:top-24 lg:self-start">
							{product.image_url ? (
								<ProductImage
									src={product.image_url}
									alt={product.name}
									priority
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover"
									iconClassName="size-16"
								/>
							) : (
								<div className="flex h-full items-center justify-center text-muted-foreground">
									<PackageIcon className="size-16" />
								</div>
							)}
						</div>

						<div className="flex flex-col gap-4">
							{product.category && (
								<Link
									href={`/produk?category=${product.category_id}`}
									className="w-fit"
								>
									<Badge
										variant="outline"
										className="text-caption p-4 transition-colors hover:border-primary hover:text-primary"
									>
										{product.category.name}
									</Badge>
								</Link>
							)}

							<h1 className="text-headline-display text-foreground">
								{product.name}
							</h1>

							<p className="text-3xl font-bold text-primary">
								{formatRupiah(product.price)}
							</p>

							<div className="flex flex-wrap items-center gap-2">
								<Badge
									variant={
										outOfStock ? 'destructive' : 'outline'
									}
									className="text-caption p-4"
								>
									{outOfStock
										? 'Stok habis'
										: `Stok ${product.stock}`}
								</Badge>
								{typeof product.total_sold === 'number' &&
									product.total_sold > 0 && (
										<Badge
											variant="outline"
											className="text-caption p-4"
										>
											Terjual {product.total_sold}
										</Badge>
									)}
							</div>

							<AddToCartControls
								key={product.id}
								product={product}
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-border bg-surface-muted">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:px-6 md:py-20">
					<SectionHeader label="Informasi" title="Deskripsi produk" />
					<p className="max-w-3xl whitespace-pre-line text-body-sm leading-relaxed text-foreground/80">
						{product.description ||
							'Tidak ada deskripsi untuk produk ini.'}
					</p>
				</div>
			</section>

			<section className="border-b border-border">
				<div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:px-6 md:py-20">
					<div className="flex items-end justify-between gap-4">
						<SectionHeader
							label="Rekomendasi"
							title="Produk serupa"
						/>
						<Button
							variant="ghost"
							size="sm"
							nativeButton={false}
							render={
								<Link
									href={`/produk?category=${product.category_id}`}
								/>
							}
						>
							Lihat semua
						</Button>
					</div>
					<RelatedProducts
						categoryId={product.category_id}
						currentId={product.id}
					/>
				</div>
			</section>
		</main>
	);
}
