import { defineStore } from 'pinia'
import * as courseApi from '@/api/teacher/courses'

export const useTeacherCourseStore = defineStore('teacherCourses', {
  state: () => ({
    courses: [],
    currentCourse: null,
    loading: false,
    pagination: {
      page: 1,
      per_page: 15,
      total: 0
    }
  }),

  getters: {
    coursesByStatus: (state) => (status) => {
      return state.courses.filter(course => course.status === status)
    },

    ongoingCourses: (state) => {
      return state.courses.filter(course => course.status === 'ongoing')
    }
  },

  actions: {
    async fetchCourses(params = {}) {
      this.loading = true
      try {
        const response = await courseApi.getCourses(params)
        if (response.success) {
          this.courses = response.data.data || response.data
          if (response.data.meta) {
            this.pagination = response.data.meta
          }
        }
      } catch (error) {
        console.error('获取课程列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCourseDetail(courseId) {
      this.loading = true
      try {
        const response = await courseApi.getCourse(courseId)
        if (response.success) {
          this.currentCourse = response.data
          return response.data
        }
      } catch (error) {
        console.error('获取课程详情失败:', error)
      } finally {
        this.loading = false
      }
    },

    async createCourse(courseData) {
      try {
        const response = await courseApi.createCourse(courseData)
        if (response.success) {
          this.courses.unshift(response.data)
          return { success: true, data: response.data }
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '创建失败'
        }
      }
    },

    async updateCourse(courseId, courseData) {
      try {
        const response = await courseApi.updateCourse(courseId, courseData)
        if (response.success) {
          const index = this.courses.findIndex(c => c.id === courseId)
          if (index !== -1) {
            this.courses[index] = response.data
          }
          return { success: true, data: response.data }
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '更新失败'
        }
      }
    },

    async deleteCourse(courseId) {
      try {
        const response = await courseApi.deleteCourse(courseId)
        if (response.success) {
          this.courses = this.courses.filter(c => c.id !== courseId)
          return { success: true }
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '删除失败'
        }
      }
    },

    async addStudents(courseId, data) {
      try {
        const response = await courseApi.addStudents(courseId, data)
        return response
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '添加失败'
        }
      }
    },

    async removeStudent(courseId, studentId) {
      try {
        const response = await courseApi.removeStudent(courseId, studentId)
        return response
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '移除失败'
        }
      }
    }
  }
})
