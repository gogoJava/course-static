import request from '../common/request'
import qs from 'qs'

/**
 * 查询用户列表
 */
export const getUserList = (params) => request.post('/api/user/list', qs.stringify(params))

/**
 * 获取验证码
 */
export const getCode = (params) => request.post('/api/user/sendCode', qs.stringify(params))

/**
 * 新建用户
 */
export const addUser = (params) => request.post('/api/user/add', qs.stringify(params))

/**
 * 修改用户信息
 */
export const updateUser = (params) => request.post('/api/user/update', qs.stringify(params))
