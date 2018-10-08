import request from '../common/request'
import qs from 'qs'

/**
 * 查询班级/课程列表
 */
export const getClassList = (params) => request.post('/api/course/list', qs.stringify(params))


