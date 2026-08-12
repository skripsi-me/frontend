import type { Metadata } from 'next';
import { PenggunaForm } from '@/components/pengguna/pengguna-form';

export const metadata: Metadata = {
	title: 'Tambah Pengguna',
};

export default function DashboardPenggunaBuatPage() {
	return <PenggunaForm mode="create" />;
}
