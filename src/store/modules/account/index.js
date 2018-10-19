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

    commit($mutations.loginSuccess, { loginInfo: resp.data })

    return resp
  },

  [$actions.logout]: async ({ commit }) => {
    const resp = await accountApi.logout().catch(e => e)

    commit($mutations.logoutSuccess)
    return resp
  },
}

/**
 * mutations
 */
const mutations = {

  [$mutations.loginSuccess] (state, { loginInfo }) {
    localStorage.setItem('currentUser', JSON.stringify(loginInfo))
    state.currentUser = loginInfo
  },

  [$mutations.logoutSuccess] (state) {
    localStorage.setItem('currentUser', JSON.stringify(null))
    state.currentUser = null
    state.loginSession = null
  },

}

export default {

  namespaced: true,

  state,

  getters,

  actions,

  mutations
}
