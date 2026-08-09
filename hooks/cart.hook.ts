"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";
import type { AddCartItemRequest, UpdateCartItemRequest } from "@/types/cart";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: cartService.get,
  });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddCartItemRequest) => cartService.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemRequest }) =>
      cartService.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useDeleteCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartService.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
