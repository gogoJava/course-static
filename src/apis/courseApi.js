import request from '../common/request'
import qs from 'qs'

/**
 * 查询课程订单列表
 */
export const getCourseOrderList = (params) => request.post('/api/courseOrder/list', qs.stringify(params))

/**
 * 新建课程/班级
 */
export const addCourse = (params) => request.post('/api/course/add', qs.stringify(params))

/**
 * 获取课程信息
 */
export const getCourseDetail = (params) => request.post('/api/course/detail', qs.stringify(params))

/**
 * 修改课程/班级
 */
export const updateCourse = (params) => request.post('/api/course/update', qs.stringify(params))

/**
 * 发布课程
 */
export const publishCourse = (params) => request.post('/api/course/publish', qs.stringify(params))

/**
 * 获取考勤列表
 */
export const getCourseAttendance = (params) => request.post('/api/course/courseAttendance', qs.stringify(params))

/**
 * 添加串课学生
 */
export const courseAdditional = (params) => request.post('/api/course/additional', qs.stringify(params))

/**
 * 老师开始上课
 */
export const startCourse = (courseId) => request.get('/api/course/courseStart?courseId=' + courseId)