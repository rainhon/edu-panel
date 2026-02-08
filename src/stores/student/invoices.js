import { defineStore } from 'pinia'
import * as invoiceApi from '@/api/student/invoices'

export const useStudentInvoiceStore = defineStore('studentInvoices', {
  state: () => ({
    invoices: [],
    currentInvoice: null,
    payments: [],
    loading: false
  }),

  getters: {
    unpaidInvoices: (state) => {
      return state.invoices.filter(invoice =>
        ['draft', 'sent', 'pending'].includes(invoice.status)
      )
    },

    paidInvoices: (state) => {
      return state.invoices.filter(invoice => invoice.status === 'paid')
    }
  },

  actions: {
    async fetchMyInvoices() {
      this.loading = true
      try {
        const response = await invoiceApi.getMyInvoices()
        if (response.success) {
          this.invoices = response.data
        }
      } catch (error) {
        console.error('获取我的账单失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchMyInvoiceDetail(invoiceId) {
      this.loading = true
      try {
        const response = await invoiceApi.getMyInvoiceDetail(invoiceId)
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

    async payInvoice(invoiceId, paymentData) {
      try {
        const response = await invoiceApi.payInvoice(invoiceId, paymentData)
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
          message: error.response?.data?.message || '支付失败'
        }
      }
    },

    async fetchInvoicePayments(invoiceId) {
      try {
        const response = await invoiceApi.getInvoicePayments(invoiceId)
        if (response.success) {
          this.payments = response.data
        }
      } catch (error) {
        console.error('获取支付记录失败:', error)
      }
    }
  }
})
