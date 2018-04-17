/**
 * 绩效计划模块
 */
const PlanDetail = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-detail-main')

 /** 计划详情 */
const PlanMake = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-make')

const PlanReject = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-reject')

const PlanAuditing = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-auditing')

const PlanAudited = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-audited')

const PlanSelfEvaluate = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-self-evaluate')

const PlanReEvaluate = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-re-evaluate')

const PlanConfirm = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-confirm')

const PlanRepresentation = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-representation')

const PlanEnd = () => import(/* webpackChunkname: 'my-performance' */'../../../admin/pages/performance/plan-detail/plan-end')

export default [{
  path: '/performance/:planId/plan_detail',
  name: '计划详情',
  component: PlanDetail,
  children: [{
    path: 'plan_make',
    name: '填写绩效计划',
    component: PlanMake
  }, {
    path: 'plan_reject',
    name: '员工计划被驳回',
    component: PlanReject
  }, {
    path: 'plan_auditing',
    name: '审批计划',
    component: PlanAuditing
  }, {
    path: 'plan_audited',
    name: '审批完成',
    component: PlanAudited
  }, {
    path: 'plan_self_evaluate',
    component: PlanSelfEvaluate
  }, {
    path: 'plan_re_evaluate',
    component: PlanReEvaluate
  }, {
    path: 'plan_representation',
    component: PlanRepresentation
  }, {
    path: 'plan_confirm',
    component: PlanConfirm
  }, {
    path: 'plan_end',
    component: PlanEnd
  }]
}]
