import request from '../common/request'
import qs from 'qs'

/**
 * 获取课程类型
 */
export const getCourseTypeList = (params) => request.post('/api/courseType/list', qs.stringify(params))

