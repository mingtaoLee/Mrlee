import Vue from 'vue'
import Router from 'vue-router'
import { getInfo } from '@/utils/auth'
Vue.use(Router)

import SelfLayout from 'components/common/layout/self-layout'
import compensationRoutes from './compensation'

// 绩效自助端路由
import performanceRoutes from './performance/index'
import todoList from './performance/todo-list'
import planDetail from './performance/plan-detail'
import performanceHistory from './performance/history.js'

// 劳动合同路由
import selfLaborContract from './labor-contract/index'
// 我的保险
import myInsurance from './my-insurances/index'
// 基本信息
const essential = () => import('../pages/home/essential.vue')
const planReEvaluate = () => import(/* webpackChunkname: 'my-performance' */ '../../admin/pages/performance/plan-detail/plan-end.vue')

// 招聘信息路由
import recruitNewsRoutes from './recruit-news/index'

// 我的团队路由
import myTeamRoutes from './my-team/index'

// 招聘自助端路由
import recruitRoutes from './recruit/index'
// 我的代办
const waitingProcess = () => import('../pages/home/waiting-process.vue')

const ResumeDetail = () => import('../../admin/pages/recruit/resume-detail/index')

// 问卷调查的路由
const GuarantorPeerDetail = () => import('../../admin/pages/employee/guarantor/guarantor-peer/detail')
const CommonFeatureCard = () => import('../pages/compensation/common-feature-card')

import Login from 'components/common/login/index'
const Error404 = () => import('components/common/error/404')
const Home = () => import('../pages/home/index.vue')
const FlowHome = () => import('components/flow/home')

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: Login
    },
    {
      path: '*',
      component: Error404
    },
    {
      path: '/',
      name: '首页',
      component: SelfLayout,
      redirect: '/home',
      children: [{
        path: '/home',
        name: '首页',
        component: Home
      }, {
        path: '/flow',
        name: '流程中心',
        component: FlowHome
      }]
    },
    {
      path: '/recruit/resume/resumeDetail',
      name: '简历',
      component: ResumeDetail
    },
    ...planDetail
  ]
})

export const asyncRoutes = [{
  path: '/',
  name: '首页',
  component: SelfLayout,
  redirect: '/home',
  children: [
    {
      path: '/performance/:id/detail',
      hide: true,
      prop: true,
      name: '绩效计划',
      component: planReEvaluate
    },
    {
      path: '/essential',
      hide: true,
      prop: true,
      name: '基本信息',
      component: essential
    },
    {
      path: '/employee/guarantor/guarantor_peer_detail/:id',
      hide: true,
      name: '问卷',
      component: GuarantorPeerDetail
    },
    {
      path: '/waitingProcess',
      hide: true,
      prop: true,
      name: '我的待办',
      component: waitingProcess
    },
    {
      path: '/CommonFeatureCard',
      name: '常用功能',
      hide: true,
      component: CommonFeatureCard
    },
    ...recruitNewsRoutes,
    ...compensationRoutes,
    ...myInsurance,
    ...myTeamRoutes,
    ...selfLaborContract,
    ...performanceRoutes,
    ...todoList,
    ...performanceHistory,
    ...recruitRoutes,
    {
      path: '/flow',
      name: '流程中心',
      component: FlowHome
    }
  ]
}]

router.afterEach(getInfo)

export default router
