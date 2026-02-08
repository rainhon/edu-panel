import request from '../index'

export const getCourses = (params) => {
  return request({
    url: '/teacher/courses',
    method: 'get',
    params
  })
}

export const getCourse = (id) => {
  return request({
    url: `/teacher/courses/${id}`,
    method: 'get'
  })
}

export const createCourse = (data) => {
  return request({
    url: '/teacher/courses',
    method: 'post',
    data
  })
}

export const updateCourse = (id, data) => {
  return request({
    url: `/teacher/courses/${id}`,
    method: 'put',
    data
  })
}

export const deleteCourse = (id) => {
  return request({
    url: `/teacher/courses/${id}`,
    method: 'delete'
  })
}

export const addStudents = (courseId, data) => {
  return request({
    url: `/teacher/courses/${courseId}/students`,
    method: 'post',
    data
  })
}

export const removeStudent = (courseId, studentId) => {
  return request({
    url: `/teacher/courses/${courseId}/students/${studentId}`,
    method: 'delete'
  })
}
