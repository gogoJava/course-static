
// 配置路由
const routes = [
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
    meta: {notLogin: true},
  },
  {
    path: '/',
    component: () => import('../App.vue'),
    children: [
      {path:'',redirect: ''},
    ]
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [
      {path:'',redirect: ''},
      //  班级信息
      {path: 'class/list', meta: {title: '班级管理'}, component: () => import('../views/class/list/view.vue')},
      {path: 'class/create', meta: {title: '创建班级'}, component: () => import('../views/class/info/create.vue')},
      {path: 'class/edit', meta: {title: '修改课程'}, component: () => import('../views/class/info/edit.vue')},
      {path: 'class/attendance', meta: {title: '出勤签到'}, component: () => import('../views/class/attendance/view.vue')},
      {path: 'class/release', meta: {title: '发布课程'}, component: () => import('../views/class/release/view.vue')},
      // 学生管理
      {path: 'student/list', meta: {title: '学员管理'}, component: () => import('../views/student/list/view.vue')},
      // 教师管理
      {path: 'teacher/list', meta: {title: '教师管理'}, component: () => import('../views/teacher/list/view.vue')},
      // 管理员
      {path: 'administrators/list', meta: {title: '管理员'}, component: () => import('../views/administrators/list/view.vue')},
      // 课程订单
      {path: 'course/order/refund/list', meta: {title: '退费订单'}, component: () => import('../views/course/order/refund/list.vue')},
      {path: 'course/order/paid/list', meta: {title: '支付成功订单'}, component: () => import('../views/course/order/paid/list.vue')},
      {path: 'course/order/unpaid/list', meta: {title: '未支付订单'}, component: () => import('../views/course/order/unpaid/list.vue')},
      // 收入
      {path: 'income/detail', meta: {title: '收入情况'}, component: () => import('../views/income/detail/view.vue')},
    ]
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
