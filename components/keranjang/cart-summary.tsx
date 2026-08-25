import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils/format';
import { ArrowRightIcon, BadgeCheckIcon, TruckIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function CartSummary({
	totalQuantity,
	totalPrice,
	children,
}: {
	totalQuantity: number;
	totalPrice: number;
	children: ReactNode;
}) {
	return (
		<aside className="lg:sticky lg:top-24">
			<div className="flex flex-col gap-5 rounded-2xl bg-white p-6 ring-1 ring-border">
				<h2 className="text-headline-sm text-foreground">
					Ringkasan Belanja
				</h2>
				<dl className="flex flex-col gap-3 text-body-sm">
					<div className="flex items-center justify-between">
						<dt className="text-muted-foreground">Total Item</dt>
						<dd className="font-medium text-foreground">
							{totalQuantity} item
						</dd>
					</div>
					<div className="flex items-center justify-between">
						<dt className="text-muted-foreground">Total Harga</dt>
						<dd className="text-label-lg font-semibold text-primary">
							{formatRupiah(totalPrice)}
						</dd>
					</div>
				</dl>

				<div className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2.5">
					<TruckIcon className="size-4 shrink-0 text-primary" />
					<p className="text-caption text-muted-foreground">
						Bayar di rumah saat pesanan tiba (COD), tanpa biaya
						tersembunyi.
					</p>
				</div>

				{children}

				<p className="flex items-center justify-center gap-1 text-caption text-muted-foreground">
					<BadgeCheckIcon className="size-4 text-primary" />
					Harga tetap sesuai label produk
				</p>
			</div>
		</aside>
	);
}

export function CartSummaryContinueLink({ href }: { href: string }) {
	return (
		<div className="flex flex-col gap-2">
			<Button
				size="lg"
				nativeButton={false}
				render={<Link href={href} />}
			>
				Lanjut ke Checkout
				<ArrowRightIcon />
			</Button>
			<Button
				variant="ghost"
				size="lg"
				nativeButton={false}
				render={<Link href="/produk" />}
			>
				Lanjut Belanja
			</Button>
		</div>
	);
}