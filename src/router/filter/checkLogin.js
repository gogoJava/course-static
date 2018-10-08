// import store from '../../store'
// import * as $account from '../../store/modules/account/types'

export default (router) => {
  router.beforeEach(async (to, from, next) => {
    if (to.meta && to.meta.notLogin) {
      // 不需要登录,直接跳过
      next()
      return
    }

    // const loginSession = store.getters[`${$account.namespace}/${$account.getters.loginSession}`]
    // if (!loginSession) {
    //   // 未登录
    //   return notLogin(router, to)
    // }
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser) {
      // 已登录
      next()
      // return
    } else {
      alert('登录信息已过期，请重新登录')
      notLogin(router, to)
    }

    // // 获取当前用户
    // await store.dispatch(`${$account.namespace}/${$account.actions.getCurrentUser}`)
    //
    // currentUser = store.getters[`${$account.namespace}/${$account.getters.currentUser}`]
    // if (currentUser) {
    //   return next()
    // }
  })
}

function notLogin(router, to) {
  // 未登录
  router.replace({
    path: '/login',
    query: to.fullPath === '/' ? {} : {redirect: to.fullPath}
  })
}
