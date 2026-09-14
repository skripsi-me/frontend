import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
	title: 'Daftar',
};

export default function RegisterPage() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-24">
			<RegisterForm />
		</main>
	);
}