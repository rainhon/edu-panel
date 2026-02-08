import { defineStore } from 'pinia'
import * as courseApi from '@/api/student/courses'

export const useStudentCourseStore = defineStore('studentCourses', {
  state: () => ({
    courses: [],
    currentCourse: null,
    loading: false
  }),

  actions: {
    async fetchMyCourses() {
      this.loading = true
      try {
        const response = await courseApi.getMyCourses()
        if (response.success) {
          this.courses = response.data
        }
      } catch (error) {
        console.error('获取我的课程失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchMyCourseDetail(courseId) {
      this.loading = true
      try {
        const response = await courseApi.getMyCourseDetail(courseId)
        if (response.success) {
          this.currentCourse = response.data
          return response.data
        }
      } catch (error) {
        console.error('获取课程详情失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
