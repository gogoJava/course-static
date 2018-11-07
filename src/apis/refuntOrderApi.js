import request from '../common/request'
import qs from 'qs'


/**
 * 确认退款
 */
export const refundOrderConfirm = (params) => request.post('/api/refundOrder/confirm', qs.stringify(params))


/**
 * 获取退费订单列表
 */
export const refundOrderList = (params) => request.post('/api/refundOrder/list', qs.stringify(params))

