/**
 * @description Interface representing a Product in As-Sakinah Mart.
 */
export interface IProduct {
  id: string
  name: string
  slug: string
  price: number
  description: string
  stock: number
  image_url: string
  category_id: string
  category: {
    name: string
  }
  sold_count: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}
