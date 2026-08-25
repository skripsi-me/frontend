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
	UpdateProductRequest,
} from '@/types/product';

export const productKeys = {
	all: ['products'] as const,
	lists: () => [...productKeys.all, 'list'] as const,
	list: (filters: ProductListParams) =>
		[...productKeys.lists(), filters] as const,
	bestSellers: (limit: number) =>
		[...productKeys.all, 'best-sellers', limit] as const,
	details: () => [...productKeys.all, 'detail'] as const,
	detail: (id: string) => [...productKeys.details(), id] as const,
	bySlug: (slug: string) => [...productKeys.all, 'slug', slug] as const,
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
		queryKey: productKeys.bestSellers(limit),
		queryFn: () => productService.bestSellers(limit),
	});
}

export function useAllProducts() {
	return useQuery({
		queryKey: [...productKeys.all, 'all'] as const,
		// ponytail: muat seluruh katalog client-side utk fuzzy LD (cap 1000/halaman).
		// Upgrade bila katalog besar: pindah fuzzy ke backend / search-index.
		queryFn: async () => {
			const first = await productService.list({ page: 1, limit: 1000 });
			const rest = await Promise.all(
				Array.from(
					{ length: Math.max(0, first.meta.total_pages - 1) },
					(_, i) =>
						productService.list({ page: i + 2, limit: 1000 }),
				),
			);
			return [first, ...rest].flatMap((page) => page.data);
		},
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
