import request from './index'

export const login = (credentials) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data: credentials
  })
}

export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export const getUserInfo = () => {
  return request({
    url: '/auth/me',
    method: 'get'
  })
}

export const changePassword = (passwordData) => {
  return request({
    url: '/auth/change-password',
    method: 'post',
    data: passwordData
  })
}
