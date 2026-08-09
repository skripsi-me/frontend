import { del, get, post, put } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api.config";
import type {
  AddCartItemRequest,
  Cart,
  UpdateCartItemRequest,
} from "@/types/cart";

export const cartService = {
  get: () => get<Cart>(API_ENDPOINTS.carts.get),
  addItem: (data: AddCartItemRequest) =>
    post<Cart>(API_ENDPOINTS.carts.addItem, data),
  updateItem: (itemId: string, data: UpdateCartItemRequest) =>
    put<Cart>(API_ENDPOINTS.carts.item(itemId), data),
  deleteItem: (itemId: string) =>
    del<Cart>(API_ENDPOINTS.carts.item(itemId)),
};
