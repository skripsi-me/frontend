'use client';

import { EmptyState } from '@/components/empty-state';
import { ProductCard } from '@/components/product-card';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';
import { ProductRowCard } from '@/components/product-row-card';
import { SectionHeader } from '@/components/section-header';
import { TrustStrip } from '@/components/trust-strip';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/category.hook';
import { useBestSellers, useProducts } from '@/hooks/product.hook';
import {
	ArrowRightIcon,
	BadgeCheckIcon,
	BanknoteIcon,
	PackageIcon,
	StoreIcon,
	TruckIcon,
	WalletIcon,
} from 'lucide-react';
import Link from 'next/link';

const TRUST_ITEMS = [
	{
		icon: BanknoteIcon,
		title: 'Bayar di Rumah',
		description: 'Cash on Delivery, aman tanpa DP',
	},
	{
		icon: BadgeCheckIcon,
		title: 'Harga Jelas',
		description: 'Tanpa biaya tersembunyi',
	},
	{
		icon: TruckIcon,
		title: 'Pesan Mudah',
		description: 'Selesai dalam beberapa menit',
	},
];

const STEPS = [
	{
		number: '01',
		title: 'Pilih Produk',
		description: 'Telusuri katalog atau cari kebutuhan keluarga',
	},
	{
		number: '02',
		title: 'Tambah ke Keranjang',
		description: 'Atur jumlah belanjaan sesuka hati',
	},
	{
		number: '03',
		title: 'Isi Alamat',
		description: 'Tulis alamat pengiriman yang benar',
	},
	{
		number: '04',
		title: 'Bayar di Rumah',
		description: 'Terima pesanan, bayar pas barang tiba',
	},
];

export function HomeContent() {
	const { data: categories } = useCategories();
	const { data: bestSellers, isPending: isBestPending } = useBestSellers(8);
	const { data: newProducts, isPending: isNewPending } = useProducts({
		page: 1,
		limit: 4,
	});

	const recent = newProducts?.data ?? [];

	return (
		<main className="flex flex-1 flex-col">
			<section className="border-b border-border">
				<div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-6 md:py-24">
					<div className="flex flex-col items-start gap-5">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-label-sm text-primary">
							<BadgeCheckIcon className="size-4" />
							Belanja aman, COD tersedia
						</span>
						<h1 className="text-headline-display text-foreground">
							Kebutuhan keluarga sehari-hari, sekali klik sampai
							di rumah
						</h1>
						<p className="text-sm text-muted-foreground">
							As-Sakinah Mart menghadirkan bahan kebutuhan rumah
							tangga dengan harga bersahabat. Pilih, pesan, bayar
							pas barang tiba.
						</p>
						<div className="flex flex-wrap items-center gap-3">
							<Button size="lg" nativeButton={false} render={<Link href="/produk" />}>
								Lihat Produk
								<ArrowRightIcon />
							</Button>
							<Button
								variant="ghost"
								size="lg"
								nativeButton={false} render={<a href="#cara-pesan" />}
							>
								Cara Pesan
							</Button>
						</div>
					</div>

					<div
						className="grid grid-cols-2 gap-3 md:gap-4"
						aria-hidden="true"
					>
						<div className="flex flex-col justify-between gap-4 rounded-xl bg-primary p-5 text-primary-foreground md:p-6">
							<BanknoteIcon className="size-7" />
							<div>
								<p className="text-headline-sm">COD</p>
								<p className="text-body-sm opacity-80">
									Bayar saat pesanan tiba
								</p>
							</div>
						</div>
						<div className="flex flex-col justify-between gap-4 rounded-xl bg-surface-muted p-5 ring-1 ring-border md:p-6">
							<PackageIcon className="size-7 text-primary" />
							<div>
								<p className="text-headline-sm text-foreground">
									Stok Nyata
								</p>
								<p className="text-body-sm text-muted-foreground">
									Ketersediaan diperbarui langsung
								</p>
							</div>
						</div>
						<div className="col-span-2 flex flex-col gap-4 rounded-xl bg-primary-soft p-5 ring-1 ring-border md:p-6">
							<div className="flex items-center gap-3">
								<div className="flex size-10 items-center justify-center rounded-lg bg-white text-primary">
									<StoreIcon className="size-5" />
								</div>
								<div>
									<p className="text-body-md text-primary">
										As-Sakinah Mart
									</p>
									<p className="text-caption text-muted-foreground">
										Toko keluarga, dikelola terpercaya
									</p>
								</div>
							</div>
							<p className="text-body-sm text-foreground">
								Belanjaan sampai depan rumah tanpa ribet antre
								atau bawa beban.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-border bg-surface-muted">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<TrustStrip items={TRUST_ITEMS} />
				</div>
			</section>

			<section className="border-b border-border">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:px-6 md:py-20">
					<SectionHeader
						label="Belanja per kategori"
						title="Cari berdasarkan kebutuhan"
					/>
					{!categories ? (
						<div className="flex flex-wrap gap-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton
									key={i}
									className="h-9 w-32 rounded-full"
								/>
							))}
						</div>
					) : (
						<div className="flex flex-wrap gap-3">
							{categories.map((category) => (
								<Link
									key={category.id}
									href={`/produk?category=${category.id}`}
									className="rounded-full border border-border bg-surface px-5 py-2.5 text-label-md text-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
								>
									{category.name}
								</Link>
							))}
						</div>
					)}
				</div>
			</section>

			<section className="border-b border-border">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:px-6 md:py-20">
					<div className="flex flex-wrap items-end justify-between gap-3">
						<SectionHeader
							label="Paling dicari"
							title="Produk terlaris"
						/>
						<Button
							variant="ghost"
							size="sm"
							nativeButton={false} render={<Link href="/produk" />}
						>
							Lihat semua
							<ArrowRightIcon />
						</Button>
					</div>
					{isBestPending ? (
						<ProductGridSkeleton />
					) : bestSellers && bestSellers.length > 0 ? (
						<div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
							{bestSellers.map((product, index) => (
								<ProductCard
									key={product.id}
									product={product}
									eager={index === 0}
								/>
							))}
						</div>
					) : (
						<EmptyState
							title="Belum ada produk terlaris"
							description="Produk favorit keluarga akan tampil di sini."
						/>
					)}
				</div>
			</section>

			<section className="border-b border-border bg-surface-muted">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:px-6 md:py-20">
					<SectionHeader
						label="Baru tersedia"
						title="Produk terbaru"
					/>
					{isNewPending ? (
						<div className="grid gap-4 md:grid-cols-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-border"
								>
									<Skeleton className="aspect-square w-24 shrink-0 rounded-lg md:w-32" />
									<div className="flex flex-1 flex-col gap-2 py-1">
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-4 w-1/3" />
										<Skeleton className="mt-auto h-8 w-24 rounded-lg" />
									</div>
								</div>
							))}
						</div>
					) : recent.length > 0 ? (
						<div className="grid gap-4 md:grid-cols-2">
							{recent.map((product) => (
								<ProductRowCard
									key={product.id}
									product={product}
								/>
							))}
						</div>
					) : (
						<EmptyState
							title="Belum ada produk baru"
							description="Produk terbaru akan tampil di sini."
							className="rounded-xl bg-white ring-1 ring-border"
						/>
					)}
				</div>
			</section>

			<section
				id="cara-pesan"
				className="border-b border-border scroll-mt-20"
			>
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:px-6 md:py-20">
					<SectionHeader
						label="Simpel dan aman"
						title="Cara berbelanja"
						description="Empat langkah mudah, cocok untuk belanja harian keluarga."
						align="center"
					/>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{STEPS.map((step) => (
							<div
								key={step.number}
								className="flex flex-col gap-3 rounded-xl bg-surface p-5 ring-1 ring-border"
							>
								<span className="text-headline-display text-primary/40">
									{step.number}
								</span>
								<div className="flex flex-col gap-1">
									<p className="text-body-md text-foreground">
										{step.title}
									</p>
									<p className="text-body-sm text-muted-foreground">
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-b border-border">
				<div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-6 md:py-20">
					<div className="flex flex-col items-start gap-4">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-label-sm text-primary">
							<WalletIcon className="size-4" />
							Cash on Delivery
						</span>
						<h2 className="text-headline-lg text-foreground">
							Belanja dulu, bayar nanti di depan rumah
						</h2>
						<p className="text-sm text-muted-foreground">
							Tidak perlu transfer atau kartu. Pesan sekarang,
							bayar tunai saat pesanan sampai. Tenang dan
							transparan untuk keluarga.
						</p>
						<Button size="lg" nativeButton={false} render={<Link href="/produk" />}>
							Mulai Belanja
							<ArrowRightIcon />
						</Button>
					</div>
					<div className="rounded-xl bg-surface-muted p-6 ring-1 ring-border md:p-8">
						<div className="flex items-center gap-4">
							<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<TruckIcon className="size-6" />
							</div>
							<div className="flex flex-col gap-0.5">
								<p className="text-headline-sm text-foreground">
									Pesanan dikirim ke rumah
								</p>
								<p className="text-caption text-muted-foreground">
									Cek status pesanan dari halaman riwayat
									transaksi
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-surface-muted">
				<div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-16 text-center md:px-6 md:py-24">
					<h2 className="max-w-2xl text-headline-lg text-foreground">
						Siap melengkapi kebutuhan keluarga hari ini?
					</h2>
					<p className="text-sm text-muted-foreground">
						Dari kebutuhan dapur sampai rumah tangga, tersedia
						lengkap dengan harga bersahabat.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-3 mt-8">
						<Button size="lg" nativeButton={false} render={<Link href="/produk" />}>
							Lihat Semua Produk
							<ArrowRightIcon />
						</Button>
						<Button
							variant="outline"
							size="lg"
							nativeButton={false} render={<Link href="/keranjang-saya" />}
						>
							Keranjang Saya
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
