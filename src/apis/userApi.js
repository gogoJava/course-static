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

/**
 * 删除用户信息
 */
export const deleteUser = (params) => request.post('/api/user/delete', qs.stringify(params))

/**
 * 新建管理员
 */
export const addAdmin = (params) => request.post('/api/user/addManager', qs.stringify(params))

/**
 * 修改密码
 */
export const updatePasswor = (params) => request.post('/api/user/updPassword', qs.stringify(params))
