import { post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
	ApiStatus,
	ChangePasswordRequest,
	LoginRequest,
} from '@/types/auth';

export const authService = {
	login: (data: LoginRequest) =>
		post<ApiStatus>(API_ENDPOINTS.auth.login, data),
	logout: () => post<ApiStatus>(API_ENDPOINTS.auth.logout),
	changePassword: (data: ChangePasswordRequest) =>
		post<ApiStatus>(API_ENDPOINTS.auth.changePassword, data),
};
