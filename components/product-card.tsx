import { ProductImage } from '@/components/product-image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/utils/format';
import type { Product } from '@/types/product';
import { PackageIcon } from 'lucide-react';
import Link from 'next/link';

export function ProductCard({
	product,
	eager = false,
}: {
	product: Product;
	eager?: boolean;
}) {
	const outOfStock = product.stock <= 0;

	return (
		<Link href={`/produk/${product.slug}`} className="group block h-full">
			<Card
				size="sm"
				className="h-full transition-shadow hover:shadow-md rounded-lg pt-0"
			>
				<div className="relative aspect-square overflow-hidden bg-muted">
					{product.image_url ? (
						<ProductImage
							src={product.image_url}
							alt={product.name}
							eager={eager}
							sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full items-center justify-center text-muted-foreground">
							<PackageIcon className="size-10" />
						</div>
					)}
				</div>
				<CardContent className="flex flex-col gap-1">
					<p className="line-clamp-2 text-body-sm text-foreground">
						{product.name}
					</p>

					<div className="flex w-full items-start justify-between mt-4 gap-1">
						<p className="text-md font-semibold text-primary">
							{formatRupiah(product.price)}
						</p>
						<p
							className={cn(
								'text-caption text-xs',
								outOfStock
									? 'text-destructive'
									: 'text-muted-foreground',
							)}
						>
							{outOfStock
								? 'Stok habis'
								: `Stok ${product.stock}`}
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
