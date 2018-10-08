// apis
import * as accountApi from '../../../apis/accountApi'
// utils
import request from '../../../common/request/index'
import persistedState from '../../../common/persistedState'
// import md5 from 'md5'

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
  [$getters.currentUser]: (state) => state.currentUser || JSON.parse(localStorage.getItem('currentUser'))
}

/**
 * actions
 */
const actions = {

  [$actions.login]: async ({ commit }, { userName, password }) => {
    // api
    const resp = await accountApi.login({
      userName,
      password
    })
    console.log('3333')

    // const { loginSession } = resp

    // 设置token
    // if (resp.code === '200') {
    //   request.setLoginSession(resp.data)
    // }

    commit($mutations.loginSuccess, { loginInfo: resp.data })

    return resp
  },

  [$actions.logout]: async ({ commit }) => {
    const resp = await accountApi.logout().catch(e => e)
    console.log('resp', resp)

    // request.setLoginSession(null)

    commit($mutations.logoutSuccess)
    return resp
  },

  // [$actions.getCurrentUser]: async ({ commit }) => {
  //   const resp = await accountApi.getCurrentUserInfo().catch(e => e)
  //
  //   const { errCode, user, loginSession } = resp
  //
  //   if (!errCode) {
  //     commit($mutations.getCurrentUserSuccess, { loginSession, userInfo: user })
  //   }
  //
  //   return resp
  // }
}

/**
 * mutations
 */
const mutations = {

  [$mutations.loginSuccess] (state, { loginInfo }) {
    localStorage.setItem('currentUser', JSON.stringify(loginInfo))
    state.currentUser = loginInfo
    // state.loginSession = loginInfo
  },

  [$mutations.logoutSuccess] (state) {
    localStorage.setItem('currentUser', JSON.stringify(null))
    state.currentUser = null
    state.loginSession = null
  },

  // [$mutations.getCurrentUserSuccess] (state, { loginSession, userInfo }) {
  //   state.currentUser = userInfo
  //   state.loginSession = loginSession
  // }

}

export default {

  namespaced: true,

  state,

  getters,

  actions,

  mutations
}
