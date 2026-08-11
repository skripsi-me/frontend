import type { Metadata } from 'next';
import { KonfirmasiCheckoutContent } from '@/components/keranjang/konfirmasi-checkout-content';

export const metadata: Metadata = {
	title: 'Konfirmasi Checkout',
};

export default function KonfirmasiCheckoutPage() {
	return <KonfirmasiCheckoutContent />;
}
