export const namespace = 'account'

export const getters = {
  loginInfo: 'loginInfo',
  loginSession: 'loginSession',
  currentUser: 'currentUser',
}

export const actions = {
  login: 'login',
  logout: 'logout',
  getCurrentUser: 'getCurrentUser',
}

export const mutations = {
  loginSuccess: 'loginSuccess',
  logoutSuccess: 'logoutSuccess',
  getCurrentUserSuccess: 'getCurrentUserSuccess',
}
