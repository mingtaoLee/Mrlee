/**
 * 历史记录模块
 */
const TodoLayout = () => import('../../pages/performance/todo-list/todo-layout')

 /** 计划历史记录 */
const Performance = () => import('../../pages/performance/history/list-performance')
const Indicator = () => import('../../pages/performance/history/list-indicator')

export default [{
  path: '/performance/history',
  name: '计划历史记录',
  component: TodoLayout,
  redirect: 'performance/history/performance',
  children: [{
    path: 'performance',
    name: '绩效计划记录',
    component: Performance
  }, {
    path: 'indicator',
    name: '指标数据记录',
    component: Indicator
  }]
}]
