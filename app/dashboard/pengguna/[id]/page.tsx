import type { Metadata } from 'next';
import { PenggunaAdminDetail } from '@/components/pengguna/pengguna-admin-detail';

export const metadata: Metadata = {
	title: 'Detail Pengguna',
};

export default async function DashboardPenggunaDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <PenggunaAdminDetail userId={id} />;
}
