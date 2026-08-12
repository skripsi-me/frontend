export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItemProduct = {
	name: string;
};

export type OrderItem = {
	id: string;
	order_id: string;
	product_id: string;
	quantity: number;
	price_at_purchase: string;
	product: OrderItemProduct;
};

export type Order = {
	id: string;
	user_id: string;
	total_amount: string;
	status: OrderStatus;
	created_at: string;
	items: OrderItem[];
};

export type OrderListParams = {
	page?: number;
	limit?: number;
	status?: OrderStatus;
};

export type UpdateOrderStatusRequest = {
	status: OrderStatus;
};

export type OrderReportParams = {
	start_date?: string;
	end_date?: string;
};

export type OrderReportItem = {
	date: string;
	total_amount: number;
	order_count: number;
};
