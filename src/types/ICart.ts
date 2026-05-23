import { IProduct } from "./IProduct";

/**
 * @description ICartItem yang mewakili item tunggal di dalam keranjang belanja.
 */
export interface ICartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Pick<IProduct, "name" | "price" | "image_url" | "slug" | "stock">;
}

/**
 * @description ICart yang mewakili data keranjang belanja milik pembeli.
 */
export interface ICart {
  id: string;
  items: ICartItem[];
}
