import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";

Vue.config.productionTip = false;
// config
import config from './config'
// request
import request from './common/request'
// moment
import moment from 'moment'
Vue.prototype.$moment = moment

request.defaults.baseURL = config.apiUrl
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
// Add a response interceptor
request.interceptors.response.use((response) => {
  // Do something with response data
  return response
}, (error) => {
  if (error.code === '100') { // 登录信息已过期
    alert('登录信息已过期，请重新登录')
    window.location.href = `/login?redirect=${window.encodeURIComponent(window.location.pathname)}`
  }
  return Promise.reject(error)
})

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
