// 葡萄图绩效
const GrapeStandard = () => import('../pages/performance/grape/grape-standard/grape-standard')
const GrapeScheme = () => import('../pages/performance/grape/grape-scheme/index')
const complaintPanel = () => import('../pages/performance/grape/grape-complaint/complaint-panel')
const GrapeEvaMonitor = () => import('../pages/performance/grape/grape-evaluate-monitor')
const Layout = () => import('components/common/layout/layout')
// const Blank = () => import('components/common/layout/blank')

export default [{
  path: '/grape',
  name: '葡萄图',
  component: Layout,
  redirect: '/grape/standard',
  children: [
    {
      path: 'standard',
      name: '葡萄图标准',
      component: GrapeStandard
    },
    {
      path: 'scheme',
      name: '葡萄图方案',
      component: GrapeScheme
    },
    {
      path: 'complaintPanel',
      name: '葡萄图评分申诉',
      component: complaintPanel
    },
    {
      path: 'monitor',
      name: '葡萄图评分监控',
      component: GrapeEvaMonitor
    }
  ]
}]
