'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLogin, useLogout } from '@/hooks/auth.hook';
import { useMe, userKeys } from '@/hooks/user.hook';
import { isApiError } from '@/lib/api';
import type { User } from '@/types/user';

type AuthContextValue = {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();
	const meQuery = useMe();
	const loginMutation = useLogin();
	const logoutMutation = useLogout();

	const isUnauthorized =
		meQuery.isError &&
		isApiError(meQuery.error) &&
		meQuery.error.status === 401;

	async function login(email: string, password: string) {
		await loginMutation.mutateAsync({ email, password });
		await queryClient.invalidateQueries({ queryKey: userKeys.me });
	}

	async function logout() {
		try {
			await logoutMutation.mutateAsync();
		} finally {
			queryClient.removeQueries({ queryKey: userKeys.me });
		}
	}

	const value: AuthContextValue = {
		user: meQuery.isSuccess ? meQuery.data : null,
		isAuthenticated: meQuery.isSuccess,
		isLoading: meQuery.isPending && !isUnauthorized,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return ctx;
}
