import { del, get, patch, post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
	Category,
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from '@/types/category';

export const categoryService = {
	list: () => get<Category[]>(API_ENDPOINTS.categories.list),
	create: (data: CreateCategoryRequest) =>
		post<Category>(API_ENDPOINTS.categories.create, data),
	update: (id: string, data: UpdateCategoryRequest) =>
		patch<Category>(API_ENDPOINTS.categories.detail(id), data),
	delete: (id: string) =>
		del<{ success: boolean }>(API_ENDPOINTS.categories.detail(id)),
};
