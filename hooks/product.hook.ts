'use client';

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import type {
	CreateProductRequest,
	ProductListParams,
	ProductPaginationParams,
	UpdateProductRequest,
} from '@/types/product';

export const productKeys = {
	all: ['products'] as const,
	lists: () => [...productKeys.all, 'list'] as const,
	list: (filters: ProductListParams) =>
		[...productKeys.lists(), filters] as const,
	bestSellers: () => [...productKeys.all, 'best-sellers'] as const,
	details: () => [...productKeys.all, 'detail'] as const,
	detail: (id: string) => [...productKeys.details(), id] as const,
	bySlug: (slug: string) => [...productKeys.all, 'slug', slug] as const,
	byCategory: (slug: string, filters: ProductPaginationParams) =>
		[...productKeys.all, 'category', slug, filters] as const,
};

export function useProducts(params: ProductListParams = {}) {
	return useQuery({
		queryKey: productKeys.list(params),
		queryFn: () => productService.list(params),
		placeholderData: keepPreviousData,
	});
}

export function useBestSellers(limit = 20) {
	return useQuery({
		queryKey: productKeys.bestSellers(),
		queryFn: () => productService.bestSellers(limit),
	});
}

export function useProductById(id: string | undefined) {
	return useQuery({
		queryKey: productKeys.detail(id ?? ''),
		queryFn: () => productService.getById(id as string),
		enabled: Boolean(id),
	});
}

export function useProductBySlug(slug: string | undefined) {
	return useQuery({
		queryKey: productKeys.bySlug(slug ?? ''),
		queryFn: () => productService.getBySlug(slug as string),
		enabled: Boolean(slug),
	});
}

export function useProductsByCategory(
	slug: string | undefined,
	params: ProductPaginationParams = {},
) {
	return useQuery({
		queryKey: productKeys.byCategory(slug ?? '', params),
		queryFn: () => productService.byCategory(slug as string, params),
		enabled: Boolean(slug),
		placeholderData: keepPreviousData,
	});
}

export function useCreateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProductRequest) => productService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.all });
		},
	});
}

export function useUpdateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateProductRequest;
		}) => productService.update(id, data),
		onSuccess: (_data, { id }) => {
			queryClient.invalidateQueries({ queryKey: productKeys.all });
			queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
		},
	});
}

export function useDeleteProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => productService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.all });
		},
	});
}
