import { IProduct } from "./IProduct";

/**
 * @description Tipe status untuk pesanan pembeli.
 */
export type IOrderStatus = "pending" | "processing" | "shipped" | "completed" | "cancelled";

/**
 * @description IOrderItem yang mewakili item produk yang dibeli di dalam pesanan.
 */
export interface IOrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: string;
  product: Pick<IProduct, "name" | "price" | "image_url" | "slug">;
}

/**
 * @description IOrder yang mewakili data transaksi pembelian/pesanan.
 */
export interface IOrder {
  id: string;
  total_amount: string;
  status: IOrderStatus;
  items: IOrderItem[];
  createdAt: string;
  address?: string;
  phoneNumber?: string;
  userName?: string;
}

/**
 * @description IOrderReport untuk struktur data laporan penjualan harian.
 */
export interface IOrderReport {
  date: string;
  total_amount: number;
  order_count: number;
}
