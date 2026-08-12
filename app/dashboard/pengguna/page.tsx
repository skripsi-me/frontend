import type { Metadata } from 'next';
import { PenggunaAdminContent } from '@/components/pengguna/pengguna-admin-content';

export const metadata: Metadata = {
	title: 'Kelola Pengguna',
};

export default function DashboardPenggunaPage() {
	return <PenggunaAdminContent />;
}
