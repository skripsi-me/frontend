export type UserRole = "user" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  address: string | null;
  phone_number: string | null;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type UserListParams = {
  page?: number;
  limit?: number;
};

export type UpdateProfileRequest = Partial<
  Pick<User, "name" | "address" | "phone_number">
>;

export type CreateUserRequest = {
  email: string;
  password: string;
  name: string;
  address?: string;
  phone_number?: string;
  role?: UserRole;
};

export type UpdateUserRequest = Partial<CreateUserRequest>;
