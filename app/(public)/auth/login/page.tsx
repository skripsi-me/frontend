import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
	title: 'Login',
};

export default function LoginPage() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-24">
			<Suspense>
				<LoginForm />
			</Suspense>
		</main>
	);
}
