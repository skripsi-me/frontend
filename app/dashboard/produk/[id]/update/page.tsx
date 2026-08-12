import type { Metadata } from 'next';
import { ProdukForm } from '@/components/produk/produk-form';

export const metadata: Metadata = {
	title: 'Ubah Produk',
};

export default async function DashboardProdukUpdatePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <ProdukForm mode="update" productId={id} />;
}
