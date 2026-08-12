import type { Metadata } from 'next';
import { PesananAdminDetail } from '@/components/pesanan/pesanan-admin-detail';

export const metadata: Metadata = {
	title: 'Detail Pesanan',
};

export default async function DashboardPesananDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <PesananAdminDetail orderId={id} />;
}
