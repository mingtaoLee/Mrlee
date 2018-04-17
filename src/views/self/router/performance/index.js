// import Blank from 'components/common/layout/blank'
// const MyPerformance = () => import(/* webpackChunkname: 'my-performance' */ '../../pages/performance/self-performance/self-performance.vue')
const MyPerformance = () => import(/* webpackChunkname: 'my-performance' */ '../../pages/performance/my-performance/index.vue')
export default [
  {
    path: '/self_performance',
    name: '我的绩效',
    component: MyPerformance
  }
]
