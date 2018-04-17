/**
 * Created by LIUMIAN on 2017-11-29
 * 核算发放模块
 */
const Blank = () => import('components/common/layout/blank')

// 数据稽查
const DataCheck = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/data-check')
// 工资计算
const SalaryCount = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-count')
const ViewCountDetail = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-count/view-count-detail')
const ViewCountDetailFail = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-count/view-count-detail-fail')
// 工资确认
const SalaryConfirm = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-confirm')
const SalaryConfirmDetail = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-confirm/salary-confirm-detail')
// 工资发放
const SalaryGive = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-give')
const SalaryGiveDetail = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-give/salary-give-detail')
// 用款申请
const SalaryApply = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-apply')
// 资金组用款申请管理
const SalaryApplyCheck = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/salary-apply-check')
// 异常出款
const UnusualTakeout = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/unusual-takeout')
const UnusualTakeoutLog = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/unusual-takeout/unusual-takeout-log')
// 冻结记录
const FrozenHistory = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/frozen-history')
// 工时划拨
// const LaborhourTranfer = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/laborhour-tranfer')
// 费用划拨记录
const CostTranferLog = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/cost-tranfer-log')
// 外部纳税记录
const OuterTaxpayLog = () => import(/* webpackChunkName: "compensation-checkGive" */'views/admin/pages/compensation/check-give/outer-taxpay-log')
export default [{
  path: '/compensation/check-give',
  name: '核算发放',
  component: Blank,
  redirect: '/data-check',
  children: [
    {
      path: 'data-check',
      name: '数据稽查',
      component: DataCheck
    },
    {
      path: 'salay-count',
      name: '工资计算',
      component: SalaryCount
    }, {
      path: 'view-count-detail',
      name: '成功明细',
      hide: true,
      meta: { subPage: true },
      component: ViewCountDetail
    }, {
      path: 'view-count-detail-fail',
      name: '失败明细',
      hide: true,
      meta: { subPage: true },
      component: ViewCountDetailFail
    }, {
      path: 'salary-confirm',
      name: '工资确认',
      component: SalaryConfirm
    }, {
      path: 'salary-confirm-detail',
      name: '工资确认细节',
      hide: true,
      meta: { subPage: true },
      component: SalaryConfirmDetail
    }, {
      path: 'salary-give',
      name: '工资发放',
      component: SalaryGive
    }, {
      path: 'salary-apply',
      name: '用款申请',
      component: SalaryApply
    }, {
      path: 'salary-apply-check',
      name: '资金组用款申请管理',
      component: SalaryApplyCheck
    }, {
      path: 'salary-give-detail',
      name: '查看明细',
      hide: true,
      meta: { subPage: true },
      component: SalaryGiveDetail
    }, {
      path: 'unusual-takeout',
      name: '异常出款',
      component: UnusualTakeout
    }, {
      path: 'unusual-takeout-log',
      name: '历史异常出款记录',
      hide: true,
      meta: { subPage: true },
      component: UnusualTakeoutLog
    }, {
      path: 'frozen-history',
      name: '冻结记录',
      component: FrozenHistory
    },
    // {
    //   path: 'laborhour-tranfer',
    //   name: '工时划拨',
    //   component: LaborhourTranfer
    // },
    {
      path: 'cost-tranfer-log',
      name: '费用/工时划拨记录',
      component: CostTranferLog
    },
    {
      path: 'outer-taxpay-log',
      name: '外部纳税记录',
      component: OuterTaxpayLog
    }
  ]
}]
