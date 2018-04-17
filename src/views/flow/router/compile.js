const SmallShopApply = () => import('../pages/compile/small-shop-plan-apply')
const NormalPlanApply = () => import('../pages/compile/normal-plan-apply')
const NewShopPlanApply = () => import('../pages/compile/new-shop-plan-apply')
const CompileAdjust = () => import('../pages/compile/compile-adjust')

export default [
  {
    path: 'scaTitleUpdateProcess',
    name: '编制调整流程申请',
    component: CompileAdjust
  },
  {
    path: 'storeScaReportCreateProcess',
    name: '填报小店编制计划',
    component: SmallShopApply
  },
  {
    path: 'smallShopModify',
    name: '小店修改',
    component: SmallShopApply
  },
  {
    path: 'scaReportCreateProcess',
    name: '填报常规编制计划',
    component: NormalPlanApply
  },
  {
    path: 'normalModify',
    name: '常规修改',
    component: NormalPlanApply
  },
  {
    path: 'newStoreScaReportCreateProcess',
    name: '填报新店编制计划',
    component: NewShopPlanApply
  }
]
