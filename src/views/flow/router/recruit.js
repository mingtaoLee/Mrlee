const RecruitDemand = () => import('../pages/recruit/recruit-demand/index')
const RecruitEmploy = () => import('../pages/recruit/recruit-employ/index')

export default [
  {
    path: 'rctRequirementProcess4shop',
    name: '门店端招聘需求填报流程',
    hide: true,
    component: RecruitDemand
  },
  {
    path: 'rctRequirementProcess4comp',
    name: '综合事务岗招聘需求填报流程',
    hide: true,
    component: RecruitDemand
  },
  {
    path: 'rctRequirementProcess4platform',
    name: '平台端招聘需求填报流程',
    hide: true,
    component: RecruitDemand
  },
  {
    path: 'hireAuditProcess',
    name: '招聘录用审批流程',
    hide: true,
    component: RecruitEmploy
  }
]
