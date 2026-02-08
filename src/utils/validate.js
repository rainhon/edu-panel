/**
 * 验证邮箱
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * 验证手机号
 */
export const validatePhone = (phone) => {
  const re = /^1[3-9]\d{9}$/
  return re.test(phone)
}

/**
 * 验证密码强度（至少6位）
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) return false
  return true
}

/**
 * 验证金额（非负数）
 */
export const validateAmount = (amount) => {
  return !isNaN(amount) && Number(amount) >= 0
}

/**
 * 验证必填
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  return true
}
