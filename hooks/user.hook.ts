'use client';

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import type {
	CreateUserRequest,
	UpdateProfileRequest,
	UpdateUserRequest,
	UserListParams,
} from '@/types/user';

export const userKeys = {
	all: ['users'] as const,
	me: ['users', 'me'] as const,
	lists: () => [...userKeys.all, 'list'] as const,
	list: (filters: UserListParams) => [...userKeys.lists(), filters] as const,
	details: () => [...userKeys.all, 'detail'] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useMe() {
	return useQuery({
		queryKey: userKeys.me,
		queryFn: userService.getMe,
	});
}

export function useUsers(params: UserListParams = {}) {
	return useQuery({
		queryKey: userKeys.list(params),
		queryFn: () => userService.list(params),
		placeholderData: keepPreviousData,
	});
}

export function useUserById(id: string | undefined) {
	return useQuery({
		queryKey: userKeys.detail(id ?? ''),
		queryFn: () => userService.getById(id as string),
		enabled: Boolean(id),
	});
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateProfileRequest) => userService.updateMe(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.me });
		},
	});
}

export function useCreateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateUserRequest) => userService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
		},
	});
}

export function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
			userService.update(id, data),
		onSuccess: (_data, { id }) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
		},
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => userService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
		},
	});
}
