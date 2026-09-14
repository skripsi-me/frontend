export type ApiStatus = {
	status: 'ok';
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type RegisterRequest = {
	email: string;
	password: string;
	name: string;
	address?: string;
	phone_number?: string;
};

export type ChangePasswordRequest = {
	old_password: string;
	new_password: string;
};
