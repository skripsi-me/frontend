'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

export function RequireAdmin({ children }: { children: ReactNode }) {
	const router = useRouter();
	const { user, isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (isLoading) return;
		if (!isAuthenticated) {
			router.replace('/auth/login');
			return;
		}
		if (user?.role !== 'admin') {
			router.replace('/');
		}
	}, [isLoading, isAuthenticated, user?.role, router]);

	if (isLoading) {
		return (
			<div className="flex w-full flex-1 flex-col gap-4 p-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>
		);
	}

	if (!isAuthenticated || user?.role !== 'admin') {
		return null;
	}

	return <>{children}</>;
}
