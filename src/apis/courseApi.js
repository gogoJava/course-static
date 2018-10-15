import request from '../common/request'
import qs from 'qs'

/**
 * 查询课程订单列表
 */
export const getCourseOrderList = (params) => request.post('/api/courseOrder/list', qs.stringify(params))

/**
 * 新建课程/班级
 */
export const addCourse = (params) => request.post('/api/course/add', qs.stringify(params))

/**
 * 获取课程信息
 */
export const getCourseDetail = (params) => request.post('/api/course/detail', qs.stringify(params))

/**
 * 修改课程/班级
 */
export const updateCourse = (params) => request.post('/api/course/update', qs.stringify(params))
