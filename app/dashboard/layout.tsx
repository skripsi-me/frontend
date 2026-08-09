// TODO (Fase 4): auth guard penuh — redirect ke /auth/login bila belum login,
// tampilkan 403 bila role bukan "admin". Stub placeholder untuk saat ini.
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-muted">
      <header className="border-b border-border bg-surface px-4 py-3">
        <p className="text-label-md text-primary">As-Sakinah Mart — Admin</p>
      </header>
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
