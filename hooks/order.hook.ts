"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { cartKeys } from "@/hooks/cart.hook";
import type {
  OrderListParams,
  OrderReportParams,
  UpdateOrderStatusRequest,
} from "@/types/order";

export const orderKeys = {
  all: ["orders"] as const,
  myLists: () => [...orderKeys.all, "me"] as const,
  myList: (params: OrderListParams) => [...orderKeys.myLists(), params] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params: OrderListParams) => [...orderKeys.lists(), params] as const,
  report: (params: OrderReportParams) => [...orderKeys.all, "report", params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrderReport(params: OrderReportParams = {}) {
  return useQuery({
    queryKey: orderKeys.report(params),
    queryFn: () => orderService.report(params),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.myLists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useMyOrders(params: OrderListParams = {}) {
  return useQuery({
    queryKey: orderKeys.myList(params),
    queryFn: () => orderService.myOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: () => orderService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useOrders(params: OrderListParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      orderService.updateStatus(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.myLists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.report({}) });
    },
  });
}
