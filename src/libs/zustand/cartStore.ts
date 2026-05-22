import { create } from 'zustand'
import { IProduct } from '../../types/IProduct'
import mockCarts from '../../datas/carts.json'

export interface ICartItem {
  id: string
  product_id: string
  quantity: number
  product: {
    name: string
    price: number
    image_url: string
  }
}

interface ICartState {
  items: ICartItem[]
  loadUserCart: (userId: string) => void
  addToCart: (product: IProduct, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

// Find default user cart (Fatimah - 01HSUSER000000000000000030)
const defaultCart = mockCarts.find((c) => c.user_id === '01HSUSER000000000000000030')
const initialItems = defaultCart ? (defaultCart.items as ICartItem[]) : []

/**
 * @description Zustand store for managing offline shopping cart items and totals.
 */
export const useCartStore = create<ICartState>((set, get) => {
  return {
    items: initialItems,
    loadUserCart: (userId) => {
      const userCart = mockCarts.find((c) => c.user_id === userId)
      if (userCart) {
        set({ items: userCart.items as ICartItem[] })
      } else {
        set({ items: [] })
      }
    },
    addToCart: (product, quantity = 1) => {
      set((state) => {
        const existingItem = state.items.find((item) => item.product_id === product.id)
        if (existingItem) {
          const updatedItems = state.items.map((item) =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
          return { items: updatedItems }
        } else {
          const newItem: ICartItem = {
            id: `01HSITEM${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            product_id: product.id,
            quantity,
            product: {
              name: product.name,
              price: product.price,
              image_url: product.image_url,
            },
          }
          return { items: [...state.items, newItem] }
        }
      })
    },
    removeFromCart: (productId) => {
      set((state) => ({
        items: state.items.filter((item) => item.product_id !== productId),
      }))
    },
    updateQuantity: (productId, quantity) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        ),
      }))
    },
    clearCart: () => set({ items: [] }),
    getTotalItems: () => {
      return get().items.reduce((total, item) => total + item.quantity, 0)
    },
    getTotalPrice: () => {
      return get().items.reduce((total, item) => total + item.quantity * item.product.price, 0)
    },
  }
})
