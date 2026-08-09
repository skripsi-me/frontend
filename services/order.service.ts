import { get, patch, post } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api.config";
import type { Paginated } from "@/lib/api/types";
import type {
  Order,
  OrderListParams,
  OrderReportItem,
  OrderReportParams,
  UpdateOrderStatusRequest,
} from "@/types/order";

export const orderService = {
  report: (params: OrderReportParams = {}) =>
    get<OrderReportItem[]>(API_ENDPOINTS.orders.report, { params }),
  create: () => post<Order>(API_ENDPOINTS.orders.create),
  myOrders: (params: OrderListParams = {}) =>
    get<Paginated<Order>>(API_ENDPOINTS.orders.myOrders, { params }),
  getById: (id: string) => get<Order>(API_ENDPOINTS.orders.detail(id)),
  list: (params: OrderListParams = {}) =>
    get<Paginated<Order>>(API_ENDPOINTS.orders.list, { params }),
  updateStatus: (id: string, data: UpdateOrderStatusRequest) =>
    patch<Order>(API_ENDPOINTS.orders.status(id), data),
};
