import type { Metadata } from 'next';
import { ProdukAdminDetail } from '@/components/produk/produk-admin-detail';

export const metadata: Metadata = {
	title: 'Detail Produk',
};

export default async function DashboardProdukDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <ProdukAdminDetail productId={id} />;
}
