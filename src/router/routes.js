
// 配置路由
const routes = [
  {
    path: '/home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('../views/About.vue')
  },
  {
    path: '*',
    component: {
      render() {
        return `<h1>404</h1>`
      }
    }
  }
]

export default routes
