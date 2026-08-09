import { post } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api.config";
import type {
  ApiStatus,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";
import type { User } from "@/types/user";

export const authService = {
  login: (data: LoginRequest) =>
    post<ApiStatus>(API_ENDPOINTS.auth.login, data),
  register: (data: RegisterRequest) =>
    post<User>(API_ENDPOINTS.auth.register, data),
  logout: () => post<ApiStatus>(API_ENDPOINTS.auth.logout),
  refresh: () => post<ApiStatus>(API_ENDPOINTS.auth.refresh),
  changePassword: (data: ChangePasswordRequest) =>
    post<ApiStatus>(API_ENDPOINTS.auth.changePassword, data),
};
