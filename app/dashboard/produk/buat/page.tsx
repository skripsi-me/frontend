import type { Metadata } from 'next';
import { ProdukForm } from '@/components/produk/produk-form';

export const metadata: Metadata = {
	title: 'Tambah Produk',
};

export default function DashboardProdukBuatPage() {
	return <ProdukForm mode="create" />;
}
