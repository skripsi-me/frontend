'use client';

import { useUpdateOrderStatus } from '@/hooks/order.hook';
import { isApiError } from '@/lib/api';
import type { OrderStatus } from '@/types/order';
import { toast } from 'sonner';

export function useOrderStatusUpdate() {
	const mutation = useUpdateOrderStatus();

	async function update(orderId: string, status: OrderStatus, verb: string) {
		try {
			await mutation.mutateAsync({ id: orderId, data: { status } });
			toast.success(`Pesanan #${orderId.slice(0, 8)} ${verb}.`);
		} catch (error) {
			toast.error(
				isApiError(error)
					? error.message
					: 'Gagal memperbarui status pesanan.',
			);
		}
	}

	return { mutation, update };
}