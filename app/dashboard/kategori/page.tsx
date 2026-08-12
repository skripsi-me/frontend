import type { Metadata } from 'next';
import { KategoriAdminContent } from '@/components/kategori/kategori-admin-content';

export const metadata: Metadata = {
	title: 'Kelola Kategori',
};

export default function DashboardKategoriPage() {
	return <KategoriAdminContent />;
}
