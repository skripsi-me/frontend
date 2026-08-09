import { del, get, patch, post } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api.config";
import type { Paginated } from "@/lib/api/types";
import type {
  CreateUserRequest,
  UpdateProfileRequest,
  UpdateUserRequest,
  User,
  UserListParams,
} from "@/types/user";

export const userService = {
  getMe: () => get<User>(API_ENDPOINTS.users.me),
  updateMe: (data: UpdateProfileRequest) =>
    patch<User>(API_ENDPOINTS.users.me, data),
  list: (params: UserListParams = {}) =>
    get<Paginated<User>>(API_ENDPOINTS.users.list, { params }),
  getById: (id: string) => get<User>(API_ENDPOINTS.users.detail(id)),
  create: (data: CreateUserRequest) =>
    post<User>(API_ENDPOINTS.users.create, data),
  update: (id: string, data: UpdateUserRequest) =>
    patch<User>(API_ENDPOINTS.users.detail(id), data),
  delete: (id: string) =>
    del<{ success: boolean }>(API_ENDPOINTS.users.detail(id)),
};
