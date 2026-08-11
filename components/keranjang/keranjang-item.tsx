'use client';

import { PackageIcon } from 'lucide-react';
import { ProductImage } from '@/components/product-image';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types/cart';
import { LoaderIcon, MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';

type KeranjangItemProps = {
	item: CartItem;
	busy: boolean;
	onUpdateQuantity: (item: CartItem, quantity: number) => void;
	onDelete: (itemId: string) => void;
};

export function KeranjangItem({
	item,
	busy,
	onUpdateQuantity,
	onDelete,
}: KeranjangItemProps) {
	const subtotal = Number(item.product.price) * item.quantity;

	return (
		<div className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-border">
			<div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted md:w-28">
				{item.product.image_url ? (
					<ProductImage
						src={item.product.image_url}
						alt={item.product.name}
						sizes="(max-width: 768px) 80px, 112px"
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-muted-foreground">
						<PackageIcon className="size-8" />
					</div>
				)}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<p className="line-clamp-2 text-body-md text-foreground">
					{item.product.name}
				</p>
				<Price value={item.product.price} />

				<div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
					<div
						className="flex items-center gap-1 rounded-full bg-surface-muted p-1"
						role="group"
						aria-label="Atur jumlah"
					>
						<Button
							size="icon-sm"
							variant="ghost"
							onClick={() =>
								onUpdateQuantity(item, item.quantity - 1)
							}
							disabled={busy || item.quantity <= 1}
							aria-label="Kurangi jumlah"
						>
							<MinusIcon />
						</Button>
						<span
							className="min-w-8 text-center text-label-md tabular-nums"
							aria-live="polite"
						>
							{item.quantity}
						</span>
						<Button
							size="icon-sm"
							variant="ghost"
							onClick={() =>
								onUpdateQuantity(item, item.quantity + 1)
							}
							disabled={busy}
							aria-label="Tambah jumlah"
						>
							<PlusIcon />
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-caption text-muted-foreground">
							Subtotal
						</span>
						<Price
							value={subtotal}
							className="text-label-md text-primary"
						/>
					</div>

					<Button
						size="icon-sm"
						variant="ghost"
						onClick={() => onDelete(item.id)}
						disabled={busy}
						aria-label="Hapus dari keranjang"
						className="text-muted-foreground hover:text-destructive"
					>
						{busy ? (
							<LoaderIcon className="size-4 animate-spin" />
						) : (
							<Trash2Icon className="size-4" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}

export function KeranjangItemSkeleton() {
	return (
		<div className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-border">
			<div className="aspect-square w-20 shrink-0 rounded-lg bg-muted md:w-28" />
			<div className="flex flex-1 flex-col gap-3 py-1">
				<div className="h-4 w-3/4 rounded-lg bg-muted" />
				<div className="h-4 w-1/4 rounded-lg bg-muted" />
				<div className="mt-auto flex justify-between gap-3 pt-2">
					<div className="h-9 w-28 rounded-full bg-muted" />
					<div className="h-5 w-20 rounded-lg bg-muted" />
				</div>
			</div>
		</div>
	);
}
