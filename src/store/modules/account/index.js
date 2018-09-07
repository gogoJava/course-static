// apis
import * as accountApi from '../../../apis/testApi'
// utils
import request from '../../../common/request'
import persistedState from '../../../common/persistedState'
import md5 from 'md5'

import {
  namespace,
  getters as $getters,
  actions as $actions,
  mutations as $mutations
} from './types'

/**
 * state
 */
const state = persistedState(namespace, {
  loginInfo: {},
  loginSession: null
}, {
  currentUser: null
})
if (state.loginSession) {
  request.setLoginSession(state.loginSession)
}

/**
 * getters
 */
const getters = {

  [$getters.loginInfo]: (state) => state.loginInfo,
  [$getters.loginSession]: (state) => state.loginSession,
  [$getters.currentUser]: (state) => state.currentUser
}

/**
 * actions
 */
const actions = {

  [$actions.login]: async ({ commit }, { userName, password }) => {
    // api
    const resp = await accountApi.login({
      userName,
      password: md5(password)
    })

    const { loginSession } = resp

    // 设置token
    request.setLoginSession(loginSession)

    commit($mutations.loginSuccess, { loginInfo: { userName }, loginSession })

    return resp
  },

  [$actions.logout]: async ({ commit }) => {
    await accountApi.logout().catch(e => {
      if (process.env.NODE_ENV !== 'production') {
        console.error(e)
      }
    })

    request.setLoginSession(null)

    commit($mutations.logoutSuccess)
  },

  [$actions.getCurrentUser]: async ({ commit }) => {
    const resp = await accountApi.getCurrentUserInfo().catch(e => e)

    const { errCode, user, loginSession } = resp

    if (!errCode) {
      commit($mutations.getCurrentUserSuccess, { loginSession, userInfo: user })
    }

    return resp
  }
}

/**
 * mutations
 */
const mutations = {

  [$mutations.loginSuccess] (state, { loginInfo, loginSession }) {
    // 将password去掉
    loginInfo = { ...loginInfo }
    delete loginInfo.password
    state.loginSession = loginSession
  },

  [$mutations.logoutSuccess] (state) {
    state.currentUser = null
    state.loginSession = null
  },

  [$mutations.getCurrentUserSuccess] (state, { loginSession, userInfo }) {
    state.currentUser = userInfo
    state.loginSession = loginSession
  }

}

export default {

  namespaced: true,

  state,

  getters,

  actions,

  mutations
}
