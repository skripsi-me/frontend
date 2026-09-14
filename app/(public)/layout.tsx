import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { MobileBottomNav } from '@/components/nav/mobile-bottom-nav';

export default function PublicLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex min-h-dvh flex-col pb-16 md:pb-0">
			<Navbar />
			<div className="flex flex-1 flex-col">{children}</div>
			<Footer />
			<MobileBottomNav />
		</div>
	);
}
