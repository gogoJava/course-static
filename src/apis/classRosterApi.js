import request from '../common/request'
import qs from 'qs'

/**
 * 获取课程名单
 */
export const getClassRosterList = (params) => request.post('/api/classRoster/list', qs.stringify(params))
