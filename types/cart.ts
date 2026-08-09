export type CartItemProduct = {
	name: string;
	price: string;
	image_url: string;
};

export type CartItem = {
	id: string;
	cart_id: string;
	product_id: string;
	quantity: number;
	product: CartItemProduct;
};

export type Cart = {
	id: string;
	user_id: string;
	items: CartItem[];
};

export type AddCartItemRequest = {
	product_id: string;
	quantity: number;
};

export type UpdateCartItemRequest = {
	quantity: number;
};
