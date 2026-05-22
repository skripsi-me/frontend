import { create } from 'zustand'
import { IUser } from '../../types/IUser'
import mockUsers from '../../datas/users.json'

interface IAuthState {
  user: IUser | null
  login: (email: string) => boolean
  logout: () => void
  updateProfile: (profile: Partial<IUser>) => void
}

/**
 * @description Zustand store for managing user authentication state and active session user.
 */
export const useAuthStore = create<IAuthState>((set) => {
  const defaultUser = (mockUsers as IUser[]).find(
    (u) => u.email === 'fatimah@gmail.com'
  ) || (mockUsers[0] as IUser)

  return {
    user: defaultUser || null,
    login: (email) => {
      const foundUser = (mockUsers as IUser[]).find((u) => u.email === email)
      if (foundUser) {
        set({ user: foundUser })
        return true
      }
      return false
    },
    logout: () => set({ user: null }),
    updateProfile: (profile) =>
      set((state) => ({
        user: state.user ? { ...state.user, ...profile, updated_at: new Date().toISOString() } : null,
      })),
  }
})
