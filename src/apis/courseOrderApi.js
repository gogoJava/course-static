import request from '../common/request'
import qs from 'qs'

/**
 * 学生创建订单
 */
export const createCourseOrder = (params) => request.post('/api/courseOrder/create', qs.stringify(params))

/**
 * 订单列表
 */
export const courseOrderList = (params) => request.post('/api/courseOrder/list', qs.stringify(params))

/**
 * 调起支付
 */
export const payCourseOrder = (params) => request.post('/api/courseOrder/pay', qs.stringify(params))
