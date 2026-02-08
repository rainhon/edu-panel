/**
 * 格式化日期
 */
export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  if (!date) return '-'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  if (formatStr === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`
  } else if (formatStr === 'yyyy-MM-dd HH:mm:ss') {
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  return date
}

/**
 * 格式化金额
 */
export const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return '-'
  return `¥${Number(amount).toFixed(2)}`
}

/**
 * 格式化课程状态
 */
export const formatCourseStatus = (status) => {
  const statusMap = {
    planning: '计划中',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

/**
 * 格式化账单状态
 */
export const formatInvoiceStatus = (status) => {
  const statusMap = {
    draft: '草稿',
    sent: '已发送',
    pending: '待支付',
    paid: '已支付',
    cancelled: '已取消',
    refunded: '已退款',
    overdue: '逾期'
  }
  return statusMap[status] || status
}

/**
 * 格式化支付状态
 */
export const formatPaymentStatus = (status) => {
  const statusMap = {
    success: '成功',
    failed: '失败',
    refunding: '退款中',
    refunded: '已退款'
  }
  return statusMap[status] || status
}

/**
 * 获取课程状态标签类型
 */
export const getCourseStatusType = (status) => {
  const typeMap = {
    planning: 'info',
    ongoing: 'success',
    completed: '',
    cancelled: 'danger'
  }
  return typeMap[status] || ''
}

/**
 * 获取账单状态标签类型
 */
export const getInvoiceStatusType = (status) => {
  const typeMap = {
    draft: 'info',
    sent: '',
    pending: 'warning',
    paid: 'success',
    cancelled: 'danger',
    refunded: 'danger',
    overdue: 'danger'
  }
  return typeMap[status] || ''
}

/**
 * 获取支付状态标签类型
 */
export const getPaymentStatusType = (status) => {
  const typeMap = {
    success: 'success',
    failed: 'danger',
    refunding: 'warning',
    refunded: 'info'
  }
  return typeMap[status] || ''
}
