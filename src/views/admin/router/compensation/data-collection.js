/**
 * Created by ZHANZF on 2017-11-24.
 * 数据收集
 */

const Blank = () => import('components/common/layout/blank')

// 薪资标准
const AttendanceData = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/attendance-data')
const Aging = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/aging')
const GuaranteedBonuses = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/guaranteed-bonuses')
// const GuaranteedBonusesClothing = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/guaranteed-bonuses-clothing')
// const ProfitBonuses = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/profit-bonuses')
// const LogisticsPerformance = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/logistics-performance')
const Incentive = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/short-term-incentive')
const Welfare = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/welfare-subsidy')
const ProblemsSheet = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/problems-sheet')
// const CashierPerformance = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/cashier-performance')
const FirstCashierPerformance = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/first-group-cashier-performance')
const SecondCashierPerformance = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/second-group-cashier-performance')

const CostumePerformance = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/costume-performance')
const SalaryDifference = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/salary-difference')

const TeamBuildingBonuses = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/team-building-bonuses')
const LossMitigationBonuses = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/loss-mitigation-bonuses')
const LossMitigationBonusesHistory = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/loss-mitigation-bonuses-history')
const NewStoreBonuses = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/new-store-bonuses')
const ProfitBonusesDetail = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/profit-bonuses-detail')
const TwoClusters = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/two-clusters')
const FirmOperatingCosts = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/firm-operating-costs')
const TeamDevelopmentBonuses = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/team-development-bonuses')
const ExtraPays = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/extra-pays')
const Sells = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/sells')
const ThreeClusters = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/three-clusters')
const okrPersonalDetails = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/okr-personal-details')
const okrAssessmentBonusPackage = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/okr-assessment-bonus-package')
const PrescriptionsTwo = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/prescriptions-two')
const ClothingWage = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/clothing-wage')
const FirstRaceReward = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/first-race-reward')
const TwoRaceReward = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/two-race-reward')
const FirstClothingStore = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/first-clothing-store')
const firstStoreEmployeeSalary = () => import(/* webpackChunkName: "compensation-dataCollection" */'views/admin/pages/compensation/data-collection/first-store-employee-salary')

export default [{
  path: '/compensation/data-collection',
  name: '数据收集',
  component: Blank,
  children: [
    {
      path: 'attendance-data',
      name: '考勤数据',
      component: AttendanceData
    },
    {
      path: 'aging',
      name: '一集群门店时效数据',
      component: Aging
    },
    {
      path: 'prescriptions-two',
      name: '二集群门店时效数据',
      component: PrescriptionsTwo
    },
    {
      path: 'guaranteed-bonuses',
      name: '保底分红',
      component: GuaranteedBonuses
    },
    {
      path: 'three-clusters',
      name: '三集群计件/计量/非计件计量绩效奖金明细',
      component: ThreeClusters
    },
    {
      path: 'okr-personal-details',
      name: '云商物流OKR考核分红个人明细',
      component: okrPersonalDetails
    },
    {
      path: 'okr-assessment-bonus-package',
      name: '云商物流OKR考核分红包',
      component: okrAssessmentBonusPackage
    },
    {
      path: 'first-group-cashier-performance',
      name: '一集群收银绩效',
      component: FirstCashierPerformance
    },
    {
      path: 'second-group-cashier-performance',
      name: '二集群收银绩效',
      component: SecondCashierPerformance
    },
    {
      path: 'costume-performance',
      name: '服装绩效',
      component: CostumePerformance
    },
    // {
    //   path: 'guaranteed-bonuses-clothing',
    //   name: '服装保底分红',
    //   component: GuaranteedBonusesClothing
    // },
    {
      path: 'clothing-wage',
      name: '服装提成列表',
      component: ClothingWage
    },
    // {
    //   path: 'profit-bonuses',
    //   name: '利润分红',
    //   component: ProfitBonuses
    // },
    {
      path: 'profit-bonuses-detail',
      name: '一集群利润分红明细',
      component: ProfitBonusesDetail
    },
    {
      path: 'two-clusters',
      name: '二集群利润分红明细',
      component: TwoClusters
    },
    {
      path: 'first-race-reward',
      name: '一集群赛马奖励',
      component: FirstRaceReward
    },
    {
      path: 'two-race-reward',
      name: '二集群赛马奖励',
      component: TwoRaceReward
    },
    {
      path: 'team-building-bonuses',
      name: '筹建团队分红',
      component: TeamBuildingBonuses
    },
    {
      path: 'loss-mitigation-bonuses',
      name: '减亏分红',
      component: LossMitigationBonuses
    },
    {
      path: 'loss-mitigation-bonuses-history',
      name: '减亏分红历史',
      hide: true,
      meta: { subPage: true },
      component: LossMitigationBonusesHistory
    },
    {
      path: 'new-store-bonuses',
      name: '新店利润分红包',
      component: NewStoreBonuses
    },
    {
      path: 'firm-operating-costs',
      name: '商行运营成本',
      component: FirmOperatingCosts
    },
    {
      path: 'team-development-bonuses',
      name: '拓展团队分红',
      component: TeamDevelopmentBonuses
    },
    // {
    //   path: 'logistics-performance',
    //   name: '物流绩效',
    //   component: LogisticsPerformance
    // },
    {
      path: 'short-term-incentive',
      name: '短期激励',
      component: Incentive
    },
    {
      path: 'salary-difference',
      name: '工资差异',
      component: SalaryDifference
    },
    {
      path: 'welfare-subsidy',
      name: '福利补贴',
      component: Welfare
    },
    {
      path: 'problems-sheet',
      name: '问题描述单',
      component: ProblemsSheet
    },
    {
      path: 'extra-pays',
      name: '额外支付',
      component: ExtraPays
    },
    {
      path: 'sells',
      name: '门店销售数据',
      component: Sells
    },
    {
      path: 'first-clothing-store',
      name: '一集群服装小店时效',
      component: FirstClothingStore
    },
    {
      path: 'first-store-employee-salary',
      name: '一集群门店全职员工时薪',
      component: firstStoreEmployeeSalary
    }
  ]
}]
