import request from '../index'

export const getMyInvoices = () => {
  return request({
    url: '/student/invoices',
    method: 'get'
  })
}

export const getMyInvoiceDetail = (id) => {
  return request({
    url: `/student/invoices/${id}`,
    method: 'get'
  })
}

export const payInvoice = (id, data) => {
  return request({
    url: `/student/invoices/${id}/pay`,
    method: 'post',
    data
  })
}

export const getInvoicePayments = (id) => {
  return request({
    url: `/student/invoices/${id}/payments`,
    method: 'get'
  })
}
