import { AdminSidebar } from '@/components/dashboard/admin-sidebar';
import { AdminTopbar } from '@/components/dashboard/admin-topbar';

// TODO (Fase 4): auth guard penuh — redirect ke /auth/login bila belum login,
// tampilkan 403 bila role bukan "admin". Stub placeholder untuk saat ini.
export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex min-h-dvh bg-surface-muted">
			<AdminSidebar />
			<div className="flex min-w-0 flex-1 flex-col">
				<AdminTopbar />
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
