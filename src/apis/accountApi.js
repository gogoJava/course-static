import request from '../common/request'
import qs from 'qs'
/**
 * 登录
 */
export const login = (params) => request.post('/pass/toLogin', qs.stringify(params))

/**
 * 登出
 */
export const logout = () => request.get('/pass/logout', {
  headers: {
    'Content-Type': 'application/json;'
  },
})

/**
 * 获取当前账号用户信息
 */
export const getCurrentUserInfo = () => request.get('/account/current-user-info')

/**
 * 查询后台账号列表
 */
export const searchList = (params) => request.get('/account/list', {params})

/**
 * 查询用户账号信息
 */
export const getUserInfo = (userId) => request.get(`/account/info/${userId}`)

