import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
	title: 'Rull Store',
	description:
		'Toko online Rull Store. Belanja mudah dengan pembayaran Cash on Delivery (COD).',
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="id" className={cn('h-full', 'font-sans', inter.variable)}>
			<body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
				<QueryProvider>
					<AuthProvider>{children}</AuthProvider>
				</QueryProvider>
				<Toaster position="top-center" />
			</body>
		</html>
	);
}
