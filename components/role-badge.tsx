import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types/user';

export function RoleBadge({ role }: { role: UserRole }) {
	return (
		<Badge
			variant="outline"
			className={
				role === 'admin'
					? 'bg-primary/10 text-success'
					: 'bg-secondary text-on-surface-muted'
			}
		>
			{role === 'admin' ? 'Admin' : 'Pengguna'}
		</Badge>
	);
}