/**
 * @description IProduct yang mewakili data produk di As-Sakinah Mart.
 */
export interface IProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  image_url: string;
  total_sold?: number;
}
