import { del, get, patch, post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Paginated } from '@/lib/api/types';
import type {
	CreateProductRequest,
	Product,
	ProductListParams,
	ProductPaginationParams,
	UpdateProductRequest,
} from '@/types/product';

function toFormData(data: CreateProductRequest | UpdateProductRequest) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(data)) {
		if (value === undefined) continue;
		formData.append(key, value as string | Blob);
	}
	return formData;
}

export const productService = {
	list: (params: ProductListParams = {}) =>
		get<Paginated<Product>>(API_ENDPOINTS.products.list, { params }),
	getById: (id: string) => get<Product>(API_ENDPOINTS.products.detail(id)),
	getBySlug: (slug: string) =>
		get<Product>(API_ENDPOINTS.products.bySlug(slug)),
	byCategory: (categorySlug: string, params: ProductPaginationParams = {}) =>
		get<Paginated<Product>>(
			API_ENDPOINTS.products.byCategory(categorySlug),
			{ params },
		),
	bestSellers: (limit = 20) =>
		get<Product[]>(API_ENDPOINTS.products.bestSellers, {
			params: { limit },
		}),
	create: (data: CreateProductRequest) =>
		post<Product>(API_ENDPOINTS.products.create, toFormData(data)),
	update: (id: string, data: UpdateProductRequest) =>
		patch<Product>(API_ENDPOINTS.products.detail(id), toFormData(data)),
	delete: (id: string) =>
		del<{ success: boolean }>(API_ENDPOINTS.products.detail(id)),
};
