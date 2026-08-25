import type { CartItem } from '@/types/cart';

export function sumCart(items: CartItem[]) {
	return items.reduce(
		(acc, item) => ({
			quantity: acc.quantity + item.quantity,
			price: acc.price + Number(item.product.price) * item.quantity,
		}),
		{ quantity: 0, price: 0 },
	);
}