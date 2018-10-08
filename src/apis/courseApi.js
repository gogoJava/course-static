import request from '../common/request'
import qs from 'qs'

/**
 * 查询课程订单列表
 */
export const getCourseOrderList = (params) => request.post('/api/courseOrder/list', qs.stringify(params))


