import type { Metadata } from 'next';
import { ProfilContent } from '@/components/profil/profil-content';

export const metadata: Metadata = {
	title: 'Profil Saya',
};

export default function ProfilPage() {
	return <ProfilContent />;
}
