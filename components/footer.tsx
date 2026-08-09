import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
	return (
		<footer className="border-t border-border bg-surface-muted">
			<div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4 md:px-6">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Image
							src="/image/logo.png"
							alt="As-Sakinah Mart"
							width={32}
							height={32}
							className="size-8 rounded-full object-contain"
						/>
						<span className="text-lg font-semibold text-foreground">
							As-Sakinah{' '}
							<span className="text-primary">Mart</span>
						</span>
					</div>
					<p className="text-body-sm text-muted-foreground">
						Toko online As-Sakinah Mart. Belanja mudah dengan
						pembayaran Cash on Delivery (COD).
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="text-label-md text-foreground">Navigasi</h3>
					<Link
						href="/"
						className="w-fit text-body-sm text-muted-foreground hover:text-primary"
					>
						Beranda
					</Link>
					<Link
						href="/produk"
						className="w-fit text-body-sm text-muted-foreground hover:text-primary"
					>
						Produk
					</Link>
					<Link
						href="/keranjang-saya"
						className="w-fit text-body-sm text-muted-foreground hover:text-primary"
					>
						Keranjang Saya
					</Link>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="text-label-md text-foreground">Akun</h3>
					<Link
						href="/auth/login"
						className="w-fit text-body-sm text-muted-foreground hover:text-primary"
					>
						Masuk
					</Link>
					<Link
						href="/profil"
						className="w-fit text-body-sm text-muted-foreground hover:text-primary"
					>
						Profil
					</Link>
					<Link
						href="/profil/riwayat-transaksi"
						className="w-fit text-body-sm text-muted-foreground hover:text-primary"
					>
						Riwayat Transaksi
					</Link>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="text-label-md text-foreground">Kontak</h3>
					<p className="flex items-start gap-2 text-body-sm text-muted-foreground">
						<MapPinIcon className="mt-0.5 size-4 shrink-0" />
						As-Sakinah Mart
					</p>
					<p className="flex items-center gap-2 text-body-sm text-muted-foreground">
						<PhoneIcon className="size-4 shrink-0" />
						08xx-xxxx-xxxx
					</p>
					<p className="flex items-center gap-2 text-body-sm text-muted-foreground">
						<MailIcon className="size-4 shrink-0" />
						halo@as-sakinah-mart.id
					</p>
				</div>
			</div>
			<div className="border-t border-border py-4 text-center text-caption text-muted-foreground">
				&copy; {new Date().getFullYear()} As-Sakinah Mart. Semua hak
				dilindungi.
			</div>
		</footer>
	);
}
