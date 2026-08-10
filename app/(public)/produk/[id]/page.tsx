import type { Metadata } from 'next';
import { API_BASE_URL } from '@/config/api.config';
import { ProdukDetailContent } from '@/components/produk/produk-detail-content';
import type { Product } from '@/types/product';

type PageProps = {
	params: Promise<{ id: string }>;
};

async function getProduct(slug: string): Promise<Product | null> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/products/slug/${encodeURIComponent(slug)}`,
			{ next: { revalidate: 60 } },
		);
		if (!response.ok) return null;
		const json = (await response.json()) as {
			metadata?: { code?: number };
			data?: Product;
		};
		return json.data ?? null;
	} catch {
		return null;
	}
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;
	const product = await getProduct(id);

	if (!product) {
		return {
			title: 'Detail Produk',
		};
	}

	return {
		title: `${product.name} - As-Sakinah Mart`,
		description: product.description ?? undefined,
	};
}

export default async function ProdukDetailPage() {
	return <ProdukDetailContent />;
}
