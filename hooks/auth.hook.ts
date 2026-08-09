'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { ChangePasswordRequest } from '@/types/auth';

export function useLogin() {
	return useMutation({
		mutationFn: authService.login,
	});
}

export function useRegister() {
	return useMutation({
		mutationFn: authService.register,
	});
}

export function useLogout() {
	return useMutation({
		mutationFn: authService.logout,
	});
}

export function useRefresh() {
	return useMutation({
		mutationFn: authService.refresh,
	});
}

export function useChangePassword() {
	return useMutation({
		mutationFn: (data: ChangePasswordRequest) =>
			authService.changePassword(data),
	});
}
