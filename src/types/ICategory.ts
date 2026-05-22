/**
 * @description Interface representing a Product Category in As-Sakinah Mart.
 */
export interface ICategory {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
