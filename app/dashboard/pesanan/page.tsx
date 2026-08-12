import type { Metadata } from 'next';
import { PesananAdminContent } from '@/components/pesanan/pesanan-admin-content';

export const metadata: Metadata = {
	title: 'Kelola Pesanan',
};

export default function DashboardPesananPage() {
	return <PesananAdminContent />;
}
