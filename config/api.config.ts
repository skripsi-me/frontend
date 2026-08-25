export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export const API_ENDPOINTS = {
	auth: {
		login: '/api/auth/login',
		logout: '/api/auth/logout',
		changePassword: '/api/auth/change-password',
	},
	users: {
		me: '/api/users/me',
		list: '/api/users/',
		detail: (id: string) => `/api/users/${id}`,
		create: '/api/users/',
	},
	categories: {
		list: '/api/categories/',
		detail: (id: string) => `/api/categories/${id}`,
		create: '/api/categories/',
	},
	products: {
		list: '/api/products/',
		detail: (id: string) => `/api/products/${id}`,
		bySlug: (slug: string) => `/api/products/slug/${slug}`,
		bestSellers: '/api/products/best-sellers',
		create: '/api/products/',
	},
	carts: {
		get: '/api/carts/',
		addItem: '/api/carts/items',
		item: (itemId: string) => `/api/carts/items/${itemId}`,
	},
	orders: {
		report: '/api/orders/report',
		create: '/api/orders/',
		myOrders: '/api/orders/me',
		detail: (id: string) => `/api/orders/${id}`,
		list: '/api/orders/',
		status: (id: string) => `/api/orders/${id}/status`,
	},
};
