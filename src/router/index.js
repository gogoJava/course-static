import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import checkLogin from './filter/checkLogin'

// 如果使用 CommonJS 模块规范, 需要显式的使用 Vue.use() 安装路由模块
Vue.use(VueRouter)

// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制
const router = new VueRouter({
  mode: 'history',
  routes // 路由
})
// 检查登录，没登录跳转到登录页
checkLogin(router)

export default router
