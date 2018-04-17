/**
 * 五险一金模块
 */
const Blank = () => import('components/common/layout/blank')
const CommercialInsurance = () => import('../../pages/iaf/commercial-insurance')
const OtherInsurance = () => import('../../pages/iaf/other-insurance')
const SocialInsurance = () => import('../../pages/iaf/social-insurance')
const BusinessBasic = () => import('../../pages/iaf/business-basic')
const Fund = () => import('../../pages/iaf/fund')
const OutsidePayment = () => import('../../pages/iaf/outside-payment')
const HandicapIaf = () => import('../../pages/iaf/handicap-iaf')
const EmployeeIaf = () => import('../../pages/iaf/employee-iaf')
const IafBills = () => import('../../pages/iaf/iaf-bills')
const IafCalculation = () => import('../../pages/iaf/iaf-calculation')
const ApapLogs = () => import('../../pages/iaf/apap-logs')
const ZeroDeclare = () => import('../../pages/iaf/zero-declare')
// const IafDifference = () => import('../../pages/iaf/iaf-difference')
// const RemoteInsurance = () => import('../../pages/iaf/remote-insurance')
const AccountsSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/iaf/accounts-setting')
const OrgAccountsSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/iaf/org-accounts-setting')
const SecurityPolicy = () => import(/* webpackChunkName: "compensation-baseSetting-policyRequirements" */'views/admin/pages/iaf/security-policy')
const SecurityPolicyDetailSetting = () => import(/* webpackChunkName: "compensation-baseSetting-policyRequirements" */'views/admin/pages/iaf/security-policy/five-one')
const NoneAccountsOrgSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/iaf/org-accounts-setting/none-accounts-org')
const InsuranceAnnualAudit = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/iaf/accounts-setting/annual-audit')
const InsuranceSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/iaf/accounts-setting/insurance-setting')
const SecurityPolicyDetail = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/iaf/accounts-setting/security-policy-detail')

export default [{
  path: '/compensation/iaf',
  name: '五险一金',
  component: Blank,
  redirect: '/compensation/iaf/main',
  children: [{
    path: '/compensation/iaf/basic',
    name: '社保基础设置',
    component: Blank,
    hideIcon: true,
    redirect: '/compensation/iaf/basic/business_basic',
    children: [{
      path: 'security-policy',
      name: '地方社保政策',
      component: SecurityPolicy
    }, {
      path: 'accounts-setting',
      name: '户头设置',
      component: AccountsSetting
    }, {
      path: 'org-accounts-setting',
      name: '人事范围户头设置',
      component: OrgAccountsSetting
    }, {
      path: 'business_basic',
      name: '人事范围商业险设置',
      component: BusinessBasic
    }, {
      path: 'security-policy-detail',
      name: '五险一金设置',
      hide: true,
      meta: { subPage: true },
      component: SecurityPolicyDetailSetting,
      props: (route) => ({ id: route.query.id })
    }, {
      path: 'none-accounts-org',
      name: '无户头人事范围设置',
      hide: true,
      meta: { subPage: true },
      component: NoneAccountsOrgSetting
    }, {
      path: 'insurance-annual-audit',
      name: '失业险年审',
      hide: true,
      meta: { subPage: true },
      component: InsuranceAnnualAudit
    }, {
      path: 'insurance-setting',
      name: '保险设置',
      hide: true,
      meta: { subPage: true },
      component: InsuranceSetting,
      props: ({query}) => ({ accountId: query.accountId, accountInfo: query.accountInfo })
    }, {
      path: 'area-policy-detail',
      name: '地方社保政策详情',
      hide: true,
      meta: { subPage: true },
      component: SecurityPolicyDetail,
      props: ({query}) => ({ areaId: query.areaId, effectiveDate: query.effectiveDate })
    }]
  }, {
    path: '/compensation/iaf/main',
    name: '参保管理',
    component: Blank,
    hideIcon: true,
    redirect: '/compensation/iaf/main/social_insurance',
    children: [{
      path: 'social_insurance',
      name: '社保管理',
      component: SocialInsurance
    }, {
      path: 'fund',
      name: '公积金管理',
      component: Fund
    }, {
      path: 'commercial_insurance',
      name: '商业险管理',
      component: CommercialInsurance
    }, {
      path: 'other_insurance',
      name: '其他社保管理',
      component: OtherInsurance
    }, {
      path: 'employee_iaf',
      name: '员工保险信息查询',
      component: EmployeeIaf
    }, {
      path: 'apap_logs',
      name: '补退数据管理',
      component: ApapLogs
    }, {
      path: 'zero_declare',
      name: '0申报',
      component: ZeroDeclare
    }]
  }, {
    path: '/compensation/iaf/outside',
    name: '外部数据',
    component: Blank,
    hideIcon: true,
    redirect: '/compensation/iaf/outside/outside_payment',
    children: [{
      path: 'outside_payment',
      name: '五险一金外部缴纳',
      component: OutsidePayment
    }, {
      path: 'handicap_iaf',
      name: '残疾人五险一金',
      component: HandicapIaf
    }, {
      path: 'iaf_bills',
      name: '员工社保申报台帐',
      component: IafBills
    }
    // {
    //   path: 'remote_insurance',
    //   name: '异地参保查询',
    //   component: RemoteInsurance
    // }
    ]
  }, {
    path: '/compensation/iaf/calculation',
    name: '社保核算',
    hideIcon: true,
    component: Blank,
    redirect: '/compensation/iaf/calculation/iaf_calculation',
    children: [{
      path: 'iaf_calculation',
      name: '五险一金计算',
      component: IafCalculation
    }
    // {
    //   path: 'iaf_difference',
    //   name: '五险一金差异',
    //   component: IafDifference
    // }
    ]
  }]
}]
