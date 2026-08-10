import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProdukContent } from '@/components/produk/produk-content';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';

export const metadata: Metadata = {
	title: 'Produk',
};

export default function ProdukPage() {
	return (
		<Suspense
			fallback={
				<main className="flex flex-1 flex-col">
					<div className="border-b border-border bg-surface-muted">
						<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 md:px-6">
							<div className="h-6 w-32 rounded-lg bg-muted" />
							<div className="h-4 w-48 rounded-lg bg-muted" />
						</div>
					</div>
					<div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
						<ProductGridSkeleton count={8} />
					</div>
				</main>
			}
		>
			<ProdukContent />
		</Suspense>
	);
}
