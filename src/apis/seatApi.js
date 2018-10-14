import request from '../common/request'
// import qs from 'qs'

/**
 * 获取所有座位
 */
export const getSeatList = () => request.post('/api/seatLayout/list')


