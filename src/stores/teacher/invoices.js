import { defineStore } from 'pinia'
import * as invoiceApi from '@/api/teacher/invoices'

export const useTeacherInvoiceStore = defineStore('teacherInvoices', {
  state: () => ({
    invoices: [],
    currentInvoice: null,
    loading: false,
    pagination: {
      page: 1,
      per_page: 15,
      total: 0
    }
  }),

  getters: {
    invoicesByStatus: (state) => (status) => {
      return state.invoices.filter(invoice => invoice.status === status)
    },

    draftInvoices: (state) => {
      return state.invoices.filter(invoice => invoice.status === 'draft')
    }
  },

  actions: {
    async fetchInvoices(params = {}) {
      this.loading = true
      try {
        const response = await invoiceApi.getInvoices(params)
        if (response.success) {
          this.invoices = response.data.data || response.data
          if (response.data.meta) {
            this.pagination = response.data.meta
          }
        }
      } catch (error) {
        console.error('获取账单列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchInvoiceDetail(invoiceId) {
      this.loading = true
      try {
        const response = await invoiceApi.getInvoice(invoiceId)
        if (response.success) {
          this.currentInvoice = response.data
          return response.data
        }
      } catch (error) {
        console.error('获取账单详情失败:', error)
      } finally {
        this.loading = false
      }
    },

    async createInvoice(invoiceData) {
      try {
        const response = await invoiceApi.createInvoice(invoiceData)
        if (response.success) {
          this.invoices.unshift(response.data)
          return { success: true, data: response.data }
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '创建失败'
        }
      }
    },

    async updateInvoice(invoiceId, invoiceData) {
      try {
        const response = await invoiceApi.updateInvoice(invoiceId, invoiceData)
        if (response.success) {
          const index = this.invoices.findIndex(i => i.id === invoiceId)
          if (index !== -1) {
            this.invoices[index] = response.data
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

    async deleteInvoice(invoiceId) {
      try {
        const response = await invoiceApi.deleteInvoice(invoiceId)
        if (response.success) {
          this.invoices = this.invoices.filter(i => i.id !== invoiceId)
          return { success: true }
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '删除失败'
        }
      }
    },

    async sendInvoice(invoiceId) {
      try {
        const response = await invoiceApi.sendInvoice(invoiceId)
        if (response.success) {
          const index = this.invoices.findIndex(i => i.id === invoiceId)
          if (index !== -1) {
            this.invoices[index] = response.data
          }
          return { success: true }
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '发送失败'
        }
      }
    }
  }
})
