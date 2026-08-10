import Link from 'next/link';
import { PackageIcon } from 'lucide-react';
import { Price } from '@/components/price';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

export function ProductRowCard({
	product,
	className,
}: {
	product: Product;
	className?: string;
}) {
	return (
		<Link
			href={`/produk/${product.slug}`}
			className={cn(
				'group flex gap-4 rounded-xl bg-white p-4 ring-1 ring-border transition-shadow hover:shadow-sm',
				className,
			)}
		>
			<div className="flex aspect-square w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-muted md:w-32">
				{product.image_url ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={product.image_url}
						alt={product.name}
						loading="lazy"
						className="h-full w-full object-cover"
					/>
				) : (
					<PackageIcon className="size-8 text-muted-foreground" />
				)}
			</div>
			<div className="flex flex-1 flex-col gap-1 py-1">
				<p className="line-clamp-2 text-body-md text-foreground group-hover:text-primary">
					{product.name}
				</p>
				<Price value={product.price} className="text-primary" />
				<p className="text-caption text-muted-foreground">
					Stok {product.stock}
				</p>
				<span className="mt-auto w-fit rounded-lg border border-border bg-background px-2.5 py-1 text-caption font-medium text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
					Lihat Detail
				</span>
			</div>
		</Link>
	);
}
