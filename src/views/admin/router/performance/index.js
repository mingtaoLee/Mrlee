/**
 * 一级菜单绩效管理
 */
const Layout = () => import('components/common/layout/layout')
const Blank = () => import('components/common/layout/blank')

// 二级菜单组织管理
// 基础设置
const Level = () => import('../../pages/performance/level/level')
const Standard = () => import('../../pages/performance/standard/standard')
const indicator = () => import('../../pages/performance/indicator/indicator')
const Template = () => import('../../pages/performance/template/template')

// 绩效方案
const SchemeManage = () => import('../../pages/performance/scheme/scheme')

// 管理绩效计划模块组件
const planManage = () => import('../../pages/performance/plan/manage.vue')
const planReEvaluate = () => import('../../pages/performance/plan-detail/plan-end.vue')
const detailManage = () => import('../../pages/performance/plan/test-manage.vue')
const ScoreAppealHandle = () => import('../../pages/performance/plan/score-appeal-handle')

// zzf试用页面
// const Demo = () => import(/* webpack-chunkName: demo */'../../pages/performance/demo/demo.vue')

// 绩效应用
const EmployeePerformanceArchives =
  () => import('../../pages/performance/application/employee-performance-archives')
// 绩效结果分析
const resultAnalyze =
  () => import('../../pages/performance/application/result-analyze')

export default [{
  path: '/performance',
  name: '绩效管理',
  component: Layout,
  redirect: '/performance/basic',
  children: [{
    path: '/performance/basic',
    name: '基础设置',
    component: Blank,
    redirect: '/performance/basic/level',
    children: [
      // {
      //   path: 'demo',
      //   name: 'demo',
      //   hide: true,meta: { subPage: true },
      //   component: Demo
      // },
      {
        path: 'level',
        name: '通用绩效等级',
        component: Level
      }, {
        path: 'standard',
        name: '通用评分标准',
        component: Standard
      }, {
        path: 'indicator',
        name: '通用绩效指标',
        component: indicator
      }, {
        path: 'template',
        name: '通用绩效模版',
        component: Template
      }]
  }, {
    path: '/performance/scheme',
    name: '绩效方案',
    component: Blank,
    redirect: '/performance/scheme/manage',
    children: [{
      path: 'manage',
      name: '管理绩效方案',
      component: SchemeManage
    }]
  }, {
    path: '/performance/plan',
    name: '绩效计划',
    component: Blank,
    redirect: '/performance/plan/manage',
    children: [{
      path: 'manage',
      name: '管理绩效计划',
      component: planManage
    },
    {
      path: ':id/detail',
      hide: true,
      meta: { subPage: true },
      name: '管理绩效计划详情',
      component: detailManage
    },
    {
      path: '/plan/:id/detail',
      hide: true,
      meta: { subPage: true },
      prop: true,
      name: '绩效计划',
      component: planReEvaluate
    },
    {
      path: 'appeal',
      name: '处理评分申诉',
      component: ScoreAppealHandle
    }]
  },
  {
    path: '/performance/application',
    name: '绩效应用',
    component: Blank,
    redirect: '/performance/application/employee_performance_archives',
    children: [
      {
        path: 'employee_performance_archives',
        name: '员工绩效档案',
        component: EmployeePerformanceArchives
      },
      {
        path: 'resultAnalyze',
        name: '绩效结果分析',
        component: resultAnalyze
      }
      // {
      //   path: 'GrapeStandard',
      //   name: '葡萄图评分标准',
      //   component: GrapeStandard
      // },
      // {
      //   path: 'GrapeScheme',
      //   name: '葡萄图绩效方案',
      //   component: GrapeScheme
      // },
      // {
      //   path: 'GrapeEvaMonitor',
      //   name: '葡萄图评分监控',
      //   component: GrapeEvaMonitor
      // }, {
      //   path: 'complaintPanel',
      //   name: '葡萄图评分申诉',
      //   component: complaintPanel
      // }
    ]
  }]
}]
