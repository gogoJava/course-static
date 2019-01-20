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
 * 学生申请退款
 */
export const courseOrderApplyBack = (params) => request.post('/api/courseOrder/applyback', qs.stringify(params))

/**
 * 调起支付
 */
export const payCourseOrder = (params) => request.get('/api/courseOrder/wechatPay', {params})

/**
 * 模拟下单支付
 */
export const testCourseOrder = (params) => request.post('/api/courseOrder/orderId', qs.stringify(params))

/**
 * 取消订单
 */
export const cancelCourseOrder = (params) => request.get('/api/courseOrder/cancel', {params})
