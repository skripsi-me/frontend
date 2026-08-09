import Image from 'next/image';
import Link from 'next/link';
import { PackageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

export function ProductCard({ product }: { product: Product }) {
	const outOfStock = product.stock <= 0;

	return (
		<Link href={`/produk/${product.slug}`} className="group block h-full">
			<Card
				size="sm"
				className="h-full transition-shadow hover:shadow-md"
			>
				<div className="relative aspect-square overflow-hidden bg-muted">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className="object-cover transition-transform duration-300 group-hover:scale-105"
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
					<p className="text-label-md text-primary">
						{formatRupiah(product.price)}
					</p>
					<p
						className={cn(
							'text-caption',
							outOfStock
								? 'text-destructive'
								: 'text-muted-foreground',
						)}
					>
						{outOfStock ? 'Stok habis' : `Stok ${product.stock}`}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
