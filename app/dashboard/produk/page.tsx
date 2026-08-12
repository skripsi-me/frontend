import type { Metadata } from 'next';
import { ProdukAdminList } from '@/components/produk/produk-admin-list';

export const metadata: Metadata = {
	title: 'Kelola Produk',
};

export default function DashboardProdukPage() {
	return <ProdukAdminList />;
}
