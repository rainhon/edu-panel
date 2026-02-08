import request from '../index'

export const getInvoices = (params) => {
  return request({
    url: '/teacher/invoices',
    method: 'get',
    params
  })
}

export const getInvoice = (id) => {
  return request({
    url: `/teacher/invoices/${id}`,
    method: 'get'
  })
}

export const createInvoice = (data) => {
  return request({
    url: '/teacher/invoices',
    method: 'post',
    data
  })
}

export const updateInvoice = (id, data) => {
  return request({
    url: `/teacher/invoices/${id}`,
    method: 'put',
    data
  })
}

export const deleteInvoice = (id) => {
  return request({
    url: `/teacher/invoices/${id}`,
    method: 'delete'
  })
}

export const sendInvoice = (id) => {
  return request({
    url: `/teacher/invoices/${id}/send`,
    method: 'post'
  })
}
