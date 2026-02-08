import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi, getUserInfo } from '@/api/auth'
import { setToken, getToken, removeToken } from '@/utils/storage'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken() || null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isTeacher: (state) => {
      const userStore = useUserStore()
      return userStore.user?.user_type === 'teacher'
    },

    isStudent: (state) => {
      const userStore = useUserStore()
      return userStore.user?.user_type === 'student'
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const response = await loginApi(credentials)
        if (response.success) {
          this.token = response.data.token
          setToken(response.data.token)
          this.isAuthenticated = true
          const userStore = useUserStore()
          userStore.setUser(response.data.user)
          return { success: true }
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '登录失败'
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await logoutApi()
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        this.token = null
        this.isAuthenticated = false
        removeToken()
        const userStore = useUserStore()
        userStore.clearUser()
      }
    },

    async fetchUserInfo() {
      if (!this.token) return

      try {
        const response = await getUserInfo()
        if (response.success) {
          const userStore = useUserStore()
          userStore.setUser(response.data)
          this.isAuthenticated = true
        }
      } catch (error) {
        this.logout()
      }
    }
  }
})
