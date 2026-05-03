import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/lib/api'

interface User {
  id: string
  email: string
  full_name: string
  role: { name: string }
  permissions: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
  setTokens: (access: string, refresh: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,

      setTokens: (access, refresh) => {
        localStorage.setItem('stours_token', access)
        set({ token: access, refreshToken: refresh })
      },

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authApi.login(email, password)
          localStorage.setItem('stours_token', data.access_token)
          set({ token: data.access_token, refreshToken: data.refresh_token })
          const me = await authApi.me()
          set({ user: me.data })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        localStorage.removeItem('stours_token')
        set({ user: null, token: null, refreshToken: null })
        window.location.href = '/login'
      },

      fetchMe: async () => {
        // Demo mode: skip API call entirely, use mock user
        if (localStorage.getItem('stours_demo') === 'true') {
          set({ user: {
            id: 'demo-user',
            email: 'demo@rihla.ma',
            full_name: 'Demo Admin',
            role: { name: 'super_admin' },
            permissions: ['*'],
          }})
          return
        }
        try {
          const { data } = await authApi.me()
          set({ user: data })
        } catch {
          set({ user: null, token: null, refreshToken: null })
        }
      },
    }),
    { name: 'stours-auth', partialize: (s) => ({ token: s.token, refreshToken: s.refreshToken }) }
  )
)

// Clear store state when the api interceptor detects an expired/invalid token
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    if (localStorage.getItem('stours_demo') !== 'true') {
      useAuthStore.getState().logout()
    }
  })
}
