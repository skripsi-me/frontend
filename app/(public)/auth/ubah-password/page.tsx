import type { Metadata } from 'next';
import { UbahPasswordForm } from '@/components/auth/ubah-password-form';

export const metadata: Metadata = {
	title: 'Ubah Kata Sandi',
};

export default function UbahPasswordPage() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-24">
			<UbahPasswordForm />
		</main>
	);
}
