import request from './index'

/**
 * 获取 Omise 配置
 */
export const getOmiseConfig = () => {
  return request({
    url: '/omise/config',
    method: 'get'
  })
}

/**
 * 创建 Omise 支付
 */
export const createOmisePayment = (invoiceId, data) => {
  return request({
    url: `/omise/invoices/${invoiceId}/pay`,
    method: 'post',
    data
  })
}

/**
 * 获取支付状态
 */
export const getPaymentStatus = (chargeId) => {
  return request({
    url: `/omise/charges/${chargeId}`,
    method: 'get'
  })
}
