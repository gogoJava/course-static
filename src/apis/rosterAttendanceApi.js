import request from '../common/request'
import qs from 'qs'


/**
 * 出勤情况
 */
export const rosterAttendanceList = (params) => request.post('/api/rosterAttendance/list', qs.stringify(params))


