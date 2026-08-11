import type { Metadata } from 'next';
import { RiwayatContent } from '@/components/riwayat/riwayat-content';

export const metadata: Metadata = {
	title: 'Riwayat Transaksi',
};

export default function RiwayatTransaksiPage() {
	return <RiwayatContent />;
}
