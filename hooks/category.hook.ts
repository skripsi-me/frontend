'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from '@/types/category';

export const categoryKeys = {
	all: ['categories'] as const,
	bySlug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
};

export function useCategories() {
	return useQuery({
		queryKey: categoryKeys.all,
		queryFn: categoryService.list,
	});
}

export function useCategoryBySlug(slug: string | undefined) {
	return useQuery({
		queryKey: categoryKeys.bySlug(slug ?? ''),
		queryFn: () => categoryService.getBySlug(slug as string),
		enabled: Boolean(slug),
	});
}

export function useCreateCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateCategoryRequest) =>
			categoryService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.all });
		},
	});
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateCategoryRequest;
		}) => categoryService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.all });
		},
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => categoryService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.all });
		},
	});
}
