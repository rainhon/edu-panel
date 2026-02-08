import request from '../index'

export const getMyCourses = () => {
  return request({
    url: '/student/courses',
    method: 'get'
  })
}

export const getMyCourseDetail = (id) => {
  return request({
    url: `/student/courses/${id}`,
    method: 'get'
  })
}
