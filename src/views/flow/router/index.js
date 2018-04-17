import Vue from 'vue'
import Router from 'vue-router'
import { checkAuth, getInfo } from '@/utils/auth'
import Main from '../pages/home/main'

const error404 = () => import('components/common/error/404')
const FlowIndex = () => import('../pages/home/index')
Vue.use(Router)

/** 子路由 */
import orgRoutes from './organization.js' // 组织管理
import employeeRoutes from './employee.js' // 人事管理
import performanceRoutes from './performance.js' // 绩效管理
import positionRoutes from './position' // 职位管理
import compensationRoutes from './compensation'
import compileRoutes from './compile' // 编制管理
import iafRoutes from './iaf'
import recruit from './recruit'   // 招聘管理
/** */
import Login from 'components/common/login/index'

const router = new Router({
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: Login
    },
    {
      path: '/',
      name: '流程中心',
      component: FlowIndex
    },
    {
      path: '/flow',
      name: 'Flow',
      component: Main,
      children: [
        ...orgRoutes,
        ...employeeRoutes,
        ...performanceRoutes,
        ...positionRoutes,
        ...compileRoutes,
        ...compensationRoutes,
        ...recruit,
        ...iafRoutes
      ]
    },
    {
      path: '*',
      component: error404
    }
  ]
})

router.beforeEach(checkAuth)

router.afterEach(getInfo)
export default router
