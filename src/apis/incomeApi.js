import request from '../common/request'
import qs from 'qs'

/**
 * 查询收入详情
 */
export const getIncomeList = (params) => request.post('/api/income/list', qs.stringify(params))

/**
 * 清算
 */
export const handleIncome = (params) => request.post('/api/income/handle', qs.stringify(params))
