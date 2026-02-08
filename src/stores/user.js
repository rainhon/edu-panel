import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null
  }),

  getters: {
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    userType: (state) => state.user?.user_type || '',

    teacherInfo: (state) => {
      return state.user?.user_type === 'teacher' ? state.profile : null
    },

    studentInfo: (state) => {
      return state.user?.user_type === 'student' ? state.profile : null
    }
  },

  actions: {
    setUser(userData) {
      this.user = {
        id: userData.id,
        user_type: userData.user_type,
        name: userData.name,
        email: userData.email
      }
      if (userData.teacher) {
        this.profile = userData.teacher
      } else if (userData.student) {
        this.profile = userData.student
      }
    },

    clearUser() {
      this.user = null
      this.profile = null
    }
  }
})
