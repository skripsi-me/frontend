import type { Metadata } from 'next';
import { KeranjangContent } from '@/components/keranjang/keranjang-content';

export const metadata: Metadata = {
	title: 'Keranjang Saya',
};

export default function KeranjangPage() {
	return <KeranjangContent />;
}
