import Vue from 'vue'
import Router from 'vue-router'
import { getInfo } from '@/utils/auth'
Vue.use(Router)

/** 子路由 */
import orgRoutes from './organization.js' // 组织管理
import employeeRoutes from './employee.js' // 人事管理
import performanceRoutes from './performance' // 绩效管理
import systemRoutes from './system.js' // 系统管理
import infoCenterRoutes from './infoCenter.js' // 系统管理
import compensationRoutes from './compensation'
import todoRoute from './performance/todo-list.js' // 代办列表
import historyRoute from './performance/history.js' // 历史记录
import plandetailRoute from './performance/plan-detail.js' // 计划详情
import staffDevelopmentRoutes from './staffDevelopment.js' // 员工发展
import recruitRoutes from './recruit'  // 员工招聘
import resumeRoutes from './recruit/resume'   // 简历模块
import grapeRoutes from './grape.js'

/** */

/** 组件 */
import Admin from '../pages/home/home'
import Main from '../pages/home/main'
import CommonUse from '../pages/home/commonUse'
import Login from 'components/common/login/index'
// import watingForHandleInfo from '../pages/home/wating-for-handle-info'

// 引入消息代办
const watingForHandleInfo = () => import('../pages/wating-for-handle-info/wating-for-handle-info')
const SelfService = () => import('../pages/self-service/home/home')
const Error404 = () => import('components/common/error/404')
const FlowHome = () => import('components/flow/home')
const ITableDemo = () => import('components/common/i-table/demo')

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: Login
    },
    {
      path: '/home',
      name: '首页',
      component: Admin,
      redirect: '/main',
      children: [
        {
          path: '/main',
          name: '首页',
          component: Main
        },
        {
          path: '/commonUse',
          name: '首页常用功能',
          component: CommonUse
        },
        {
          path: '/flow',
          name: '流程中心',
          component: FlowHome
        }
      ]
    },
    {
      path: '/watingForHandleInfo',
      name: '消息待办',
      component: watingForHandleInfo
    }, {
      path: '/self_service',
      name: '员工自助',
      component: SelfService
    },
    {
      path: 'error_404',
      component: Error404
    },
    {
      path: '*',
      component: Error404
    },
    {
      path: '/i-table-demo',
      hidden: true,
      component: ITableDemo
    },
    ...todoRoute,
    ...historyRoute,
    ...plandetailRoute,
    ...resumeRoutes
  ]
})

export const asyncRoutes = [{
  path: '/',
  name: '首页',
  component: Admin,
  redirect: '/main',
  children: [
    ...orgRoutes,
    ...employeeRoutes,
    ...compensationRoutes,
    ...performanceRoutes,
    ...grapeRoutes,
    ...recruitRoutes,
    ...staffDevelopmentRoutes,
    ...infoCenterRoutes,
    ...systemRoutes
  ]
}]

router.afterEach((to, from, next) => {
  getInfo(to, from, next, true)
})
export default router
