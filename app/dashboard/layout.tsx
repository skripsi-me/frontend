import { RequireAdmin } from '@/components/auth/require-admin';
import { AdminSidebar } from '@/components/dashboard/admin-sidebar';
import { AdminTopbar } from '@/components/dashboard/admin-topbar';

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<RequireAdmin>
			<div className="flex min-h-dvh bg-surface-muted">
				<AdminSidebar />
				<div className="flex min-w-0 flex-1 flex-col">
					<AdminTopbar />
					<main className="flex-1">{children}</main>
				</div>
			</div>
		</RequireAdmin>
	);
}
