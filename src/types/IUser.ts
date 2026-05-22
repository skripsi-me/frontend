/**
 * @description Interface representing a User in As-Sakinah Mart.
 */
export interface IUser {
  id: string
  email: string
  name: string
  address: string
  phone_number: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
  deleted_at: string | null
}
