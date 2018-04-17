/**
 * 基础设置模块
 */
const Blank = () => import('components/common/layout/blank')

// 政策规定
const NationalTaxRate = () => import(/* webpackChunkName: "compensation-baseSetting-policyRequirements" */'views/admin/pages/compensation/base-setting/policy-requirements/national-tax-rate')
const SecurityPolicy = () => import(/* webpackChunkName: "compensation-baseSetting-policyRequirements" */'views/admin/pages/compensation/base-setting/policy-requirements/security-policy')
const SecurityPolicyDetailSetting = () => import(/* webpackChunkName: "compensation-baseSetting-policyRequirements" */'views/admin/pages/compensation/base-setting/policy-requirements/security-policy/five-one')

// 公司规定
const CompensationItemSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/compensation-item-setting')
const PayComponents = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/pay-components')
const PayComponentEdit = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/pay-components/detail-edit')
const SecurityPolicyDetail = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/accounts-setting/security-policy-detail')
const InsuranceSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/accounts-setting/insurance-setting')
const InsuranceAnnualAudit = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/accounts-setting/annual-audit')
const NoneAccountsOrgSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/org-accounts-setting/none-accounts-org')
const BankNumberSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/bank-number-setting')
const FinancesSetting = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/finances-setting')
const SalaryGroups = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/salary-groups')
const SalaryItems = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/salary-groups/salary-items')
const SalaryForms = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/salary-forms')
// const projectCalculationRules = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/project-calculation-rules')
const employeesCalculationRules = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/project-calculation-rules/employees-calculation-rules')
const clothingSalary = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/clothing-salary')
const companyPayAccount = () => import(/* webpackChunkName: "compensation-baseSetting-companyRules" */'views/admin/pages/compensation/base-setting/company-rules/company-pay-account')

// 报表模板
const BankOffer = () => import(/* webpackChunkName: "compensation-baseSetting-report" */'views/admin/pages/compensation/base-setting/report-form-templates/bank-offer')
const TaxDeclaration = () => import(/* webpackChunkName: "compensation-baseSetting-report" */'views/admin/pages/compensation/base-setting/report-form-templates/tax-declaration')

export default [{
  path: '/compensation/base-setting',
  name: '基础设置',
  component: Blank,
  redirect: '/compensation/base-setting/policy-requirements',
  children: [
    {
      path: '/compensation/base-setting/policy-requirements',
      name: '政策规定',
      component: Blank,
      redirect: '/compensation/base-setting/policy-requirements/national-tax-rate',
      hideIcon: true,
      children: [{
        path: 'national-tax-rate',
        name: '国家税率表',
        component: NationalTaxRate
      }, {
        path: 'security-policy',
        name: '地方政策',
        component: SecurityPolicy
      }, {
        path: 'security-policy-detail',
        name: '五险一金设置',
        hide: true,
        meta: { subPage: true },
        component: SecurityPolicyDetailSetting,
        props: (route) => ({ id: route.query.id })
      }]
    },
    {
      path: '/compensation/base-setting/company-rules',
      name: '公司规定',
      component: Blank,
      hideIcon: true,
      children: [{
        path: 'compensation-item-setting',
        name: '薪资项目设置',
        component: CompensationItemSetting
      }, /* {
        path: 'project-calculation-rules',
        name: '项目计算规则',
        component: projectCalculationRules
      }, */ {
        path: 'pay-components',
        name: '工资套设置',
        component: PayComponents
      }, {
        path: 'employees-calculation-rules',
        name: '员工计算规则查询',
        hide: true,
        meta: { subPage: true },
        component: employeesCalculationRules
      }, {
        path: 'pay-component-add',
        name: '工资套新增',
        hide: true,
        meta: { subPage: true },
        component: PayComponentEdit,
        props: ({query}) => ({ componentListId: query.componentListId, editorStatus: query.editorStatus, title: query.title, idKey: query.idKey })
      }, {
        path: 'pay-component-edit',
        name: '工资套修改',
        hide: true,
        meta: { subPage: true },
        component: PayComponentEdit,
        props: ({query}) => ({ componentListId: query.componentListId, editorStatus: query.editorStatus, title: query.title, idKey: query.idKey })
      }, {
        path: 'salary-groups',
        name: '薪资组设置',
        component: SalaryGroups
      }, {
        path: 'salary-items',
        name: '薪资组工资套设置',
        component: SalaryItems,
        hide: true,
        meta: { subPage: true }
      }, {
        path: 'salary-forms',
        name: '薪档表设置',
        component: SalaryForms
      }, {
        path: 'security-policy-detail',
        name: '地方社保政策详情',
        hide: true,
        meta: { subPage: true },
        component: SecurityPolicyDetail,
        props: ({query}) => ({ areaId: query.areaId })
      }, {
        path: 'insurance-setting',
        name: '保险设置',
        hide: true,
        meta: { subPage: true },
        component: InsuranceSetting,
        props: ({query}) => ({ accountId: query.accountId, accountInfo: query.accountInfo })
      }, {
        path: 'insurance-annual-audit',
        name: '失业险年审',
        hide: true,
        meta: { subPage: true },
        component: InsuranceAnnualAudit
      }, {
        path: 'none-accounts-org',
        name: '无户头人事范围设置',
        hide: true,
        meta: { subPage: true },
        component: NoneAccountsOrgSetting
      }, {
        path: 'bank-number-setting',
        name: '联行号设置',
        component: BankNumberSetting
      }, {
        path: 'finances-setting',
        name: '薪资项目财务属性设置',
        component: FinancesSetting
      }, {
        path: 'clothing-salary',
        name: '服装底薪',
        hide: true,
        meta: { subPage: true },
        component: clothingSalary
      }, {
        path: 'company-pay-account',
        name: '公司支付账户维护',
        component: companyPayAccount
      }]
    }, {
      path: '/compensation/base-setting/report-form-templates',
      name: '报表模板',
      component: Blank,
      hideIcon: true,
      children: [{
        path: 'bank-offer',
        name: '银行报盘模板',
        component: BankOffer
      }, {
        path: 'tax-declaration',
        name: '个税申报模板',
        component: TaxDeclaration
      }]
    }
  ]
}]
