import request from '../common/request'
import qs from 'qs'

/**
 * 获取课程类型
 */
export const getCourseTypeList = (params) => request.post('/api/courseType/list', qs.stringify(params))

/**
 * 新增课程类型
 */
export const addCourseType = (params) => request.post('/api/courseType/add', params, {
  headers: {
    'Content-Type': 'application/json;'
  },
})


/**
 * 修改课程类型
 */
export const updateCourseType = (params) => request.post('/api/courseType/update', params, {
  headers: {
    'Content-Type': 'application/json;'
  },
})

/**
 * 修改课程
 */
export const deleteCourseType = (params) => request.get('/api/courseType/delete', {params})

