
const WageDifferentialsPlatform = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/wage-differentials-platform')
const WageDifferentialsStores = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/wage-differentials-stores')
const WageDifferentialsSummaryStores = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/wage-differentials-summary-stores')
const profitBonusesHalfYear = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/profit-bonuses-half-year')
const ProfitBonusesMonth = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/profit-bonuses-month')

const AdditionalPayment = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/additional-payment')
const CashierPerformance = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/cashier-performance')
const PayCompanyChange = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/pay-company-change')
const WelfareSubsidy = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/welfare-subsidy')
const WorkHourAllocation = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/work-hour-allocation')
const urgentStopPayment = () => import(/* webpackChunkName: "urgenStopPayment" */'../pages/compensation/urgent-stop-payment')
const SalaryAdjustments = () => import(/* webpackChunkName: "salary-adjustments-flow" */'../pages/compensation/salary-adjustments')
const BestirWorkflow = () => import(/* webpackChunkName: "bestirWorkflow-flow" */'../pages/compensation/short-term-bestir')
const applyTakeout = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/apply-takeout')
const payAgain = () => import(/* webpackChunkName: "compensation-flow" */'../pages/compensation/pay-again')
const ShortTermIncentiveBonuses = () => import(/* webpackChunkName: "short-term-incentive-bonuses" */'../pages/compensation/short-term-incentive-bonuses')
const threeClustersNormal = () => import(/* webpackChunkName: "three-clusters-normal-flow" */'../pages/compensation/three-clusters-normal')
const threeClustersConstant = () => import(/* webpackChunkName: "three-clusters-constant-flow" */'../pages/compensation/three-clusters-constant')
const threeClustersNormalConstant = () => import(/* webpackChunkName: "three-clusters-normal-constant-flow" */'../pages/compensation/three-clusters-normal-constant')

const CostAllocation = () => import(/* webpackChunkName: "cost-allocation" */'../pages/compensation/cost-allocation')
const PolicySalaryAdjustments = () => import(/* webpackChunkName: "cost-allocation" */'../pages/compensation/policy-salary-adjustments')
const InternalPolicySalaryAdjustments = () => import(/* webpackChunkName: "cost-allocation" */'../pages/compensation/internal-policy-salary-adjustments')
const NewProfitBonusWorkflow = () => import(/* webpackChunkName: "cost-allocation" */'../pages/compensation/new-store-profit-bonus')
const AccountChange = () => import(/* webpackChunkName: "emp-account-change-process" */'../pages/compensation/account-change')
const okrAssessmentPackage = () => import(/* webpackChunkName: "emp-account-change-process" */'../pages/compensation/okr-assessment-package')
const paySeverance = () => import(/* webpackChunkName: "emp-account-change-process" */'../pages/compensation/pay-severance')

// 注意：path必须为processType的值，否则后台无法识别;还需要在utils/flow.js 添加映射,否则无法识别流程名称
export default [
  {
    path: 'payDiffWorkFlow',
    name: '工资差异(平台)',
    component: WageDifferentialsPlatform
  },
  {
    path: 'payDiffStore',
    name: '工资差异(门店)',
    component: WageDifferentialsStores
  },
  {
    path: 'wage-differentials-summary-stores',
    name: '工资差异汇总(门店)',
    component: WageDifferentialsSummaryStores
  },
  {
    path: 'profitBonusWorkflow',
    name: '利润分红',
    component: profitBonusesHalfYear
  },
  {
    path: 'profit-bonuses-month',
    name: '利润分红(月度)',
    component: ProfitBonusesMonth
  },
  {
    path: 'bestirPlanAllocationProcess',
    name: '短期激励奖金包',
    component: ShortTermIncentiveBonuses
  },
  {
    path: 'okrAssessmentPackage',
    name: '三集群OKR团队分红',
    component: okrAssessmentPackage
  },
  {
    path: 'extraPayWorkFlow',
    name: '额外支付',
    component: AdditionalPayment,
    props: ({query}) => ({ taskId: query.taskId, taskKey: query.taskKey })
  },
  {
    path: 'cashPerfSubmitWorkFlow',
    name: '收银绩效',
    component: CashierPerformance
  },
  {
    path: 'PayChangeEmpObject',
    name: '员工发薪主体',
    component: PayCompanyChange
  },
  {
    path: 'allowanceWorkFlow',
    name: '福利补贴',
    component: WelfareSubsidy
  },
  {
    path: 'policySalaryAdjust',
    name: '政策调薪',
    component: PolicySalaryAdjustments
  },
  {
    path: 'insideSalaryChange',
    name: '内部政策调薪',
    component: InternalPolicySalaryAdjustments
  },
  {
    path: 'workingHoursTransferWorkingFlow',
    name: '工时划拨',
    component: WorkHourAllocation
  },
  {
    path: 'costTransferRecordWorkflow',
    name: '工时/费用划拨',
    component: CostAllocation
  },
  {
    path: 'PayProcessSuspendProcess',
    name: '紧急止付',
    hide: true,
    component: urgentStopPayment
  },
  {
    path: 'paySeveranceProcess',
    name: '离职补偿金流程',
    hide: true,
    component: paySeverance
  },
  {
    path: 'postSalaryAdjustmentWorkflow',
    name: '原岗调薪',
    hide: true,
    component: SalaryAdjustments
  },
  {
    path: 'paySalaryApprovalProcess',
    name: '申请出款',
    hide: true,
    component: applyTakeout
  },
  {
    path: 'bestirWorkflow',
    name: '短期激励（方案）',
    component: BestirWorkflow
  },
  {
    path: 'payMentAgainProcess',
    name: '再次支付',
    hide: true,
    component: payAgain
  },
  {
    path: 'paySeveranceProcess',
    name: '离职补偿金流程',
    hide: true,
    component: paySeverance
  },
  {
    path: 'newStoreProfitBonusWorkflow',
    name: '新店利润分红',
    component: NewProfitBonusWorkflow
  },
  {
    path: 'empAccountChangeWorkFlow',
    name: '员工银行卡信息修改',
    hide: true,
    component: AccountChange
  },
  {
    path: 'pieceConstTemp',
    name: '三集群计件计量绩效奖金（常温）',
    component: threeClustersNormal
  },
  {
    path: 'pieceUnconstTemp',
    name: '三集群计件计量绩效奖金（定温）',
    component: threeClustersConstant
  },
  {
    path: 'unpieceWorkFlow',
    name: '三集群非计件计量绩效奖金（常温定温）',
    component: threeClustersNormalConstant
  }
]
