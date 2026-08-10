import type { Metadata } from 'next';
import { HomeContent } from '@/components/home/home-content';

export const metadata: Metadata = {
	title: 'Beranda',
};

export default function HomePage() {
	return <HomeContent />;
}
