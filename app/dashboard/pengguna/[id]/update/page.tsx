import type { Metadata } from 'next';
import { PenggunaForm } from '@/components/pengguna/pengguna-form';

export const metadata: Metadata = {
	title: 'Update Pengguna',
};

export default async function DashboardPenggunaUpdatePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <PenggunaForm mode="update" userId={id} />;
}
