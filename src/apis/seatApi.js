import request from '../common/request'
import qs from 'qs'

/**
 * 获取所有座位
 */
export const getSeatList = () => request.post('/api/seatLayout/list')

/**
 * 选择座位
 */
export const choiceSeat = (params) => request.post('/api/seatLayout/choice', qs.stringify(params))


