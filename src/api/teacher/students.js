import request from '../index'

export const getStudents = (params) => {
  return request({
    url: '/teacher/students',
    method: 'get',
    params
  })
}

export const getStudent = (id) => {
  return request({
    url: `/teacher/students/${id}`,
    method: 'get'
  })
}
