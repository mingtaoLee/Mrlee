/**
 * 代办列表模块
 */
const TodoLayout = () => import(/* webpackChunkname: 'my-performance' */ '../../../admin/pages/performance/todo-list/todo-layout')

/** 代办列表 */
const MakePending = () => import(/* webpackChunkname: 'my-performance' */ '../../../admin/pages/performance/todo-list/make-pending')

const AuditPending = () => import(/* webpackChunkname: 'my-performance' */ '../../../admin/pages/performance/todo-list/audit-pending')

const CollectPending = () => import(/* webpackChunkname: 'my-performance' */ '../../../admin/pages/performance/todo-list/collect-pending')

const CheckPending = () => import(/* webpackChunkname: 'my-performance' */ '../../../admin/pages/performance/todo-list/check-pending')

const SelfRatingPending = () => import(/* webpackChunkname: 'my-performance' */ '../../../admin/pages/performance/todo-list/self-rating-pending')

const ReviewPending = () => import(/* webpackChunkname: 'my-performance' */ '../../../admin/pages/performance/todo-list/review-pending')

const ConfirmPending = () => import(/* webpackChunkname: 'my-performance' */ '../../../admin/pages/performance/todo-list/confirm-pending')

export default [{
  path: '/performance/todo',
  name: '待办列表',
  hide: true,
  component: TodoLayout,
  redirect: '/performance/todo/make',
  children: [{
    path: 'make',
    name: '待制定绩效',
    component: MakePending
  },
  {
    path: 'audit',
    name: '待审核绩效',
    component: AuditPending
  },
  {
    path: 'collect',
    name: '待收集绩效',
    component: CollectPending
  },
  {
    path: 'check',
    name: '待审核指标',
    component: CheckPending
  },
  {
    path: 'selfrating',
    name: '待自评绩效',
    component: SelfRatingPending
  },
  {
    path: 'review',
    name: '待复评绩效',
    component: ReviewPending
  },
  {
    path: 'confirm',
    name: '待确认评分',
    component: ConfirmPending
  }]
}]
