import type { Metadata } from 'next';
import { RiwayatDetailContent } from '@/components/riwayat/riwayat-detail-content';

export const metadata: Metadata = {
	title: 'Detail Transaksi',
};

export default function RiwayatDetailPage() {
	return <RiwayatDetailContent />;
}
