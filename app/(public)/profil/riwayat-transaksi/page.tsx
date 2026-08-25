import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RiwayatContent } from '@/components/riwayat/riwayat-content';

export const metadata: Metadata = {
	title: 'Riwayat Transaksi',
};

export default function RiwayatTransaksiPage() {
	return (
		<Suspense>
			<RiwayatContent />
		</Suspense>
	);
}
