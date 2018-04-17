/**
 * Created by ZHANZF on 2017-11-22.
 * 员工信息设置
 */
const Blank = () => import('components/common/layout/blank')

// 薪资标准
const SalaryStandard = () => import(/* webpackChunkName: "compensation-employeeInfo" */'views/admin/pages/compensation/employee-info/salary-standard')
const SalaryHistory = () => import(/* webpackChunkName: "compensation-employeeInfo" */'views/admin/pages/compensation/employee-info/salary-standard/salary-history')
// const HoursSalary = () => import(/* webpackChunkName: "compensation-employeeInfo" */'views/admin/pages/compensation/employee-info/hours-salary')
const HoursSalaryHistory = () => import(/* webpackChunkName: "compensation-employeeInfo" */'views/admin/pages/compensation/employee-info/hours-salary/salary-history')
const BankAccounts = () => import(/* webpackChunkName: "compensation-employeeInfo" */'views/admin/pages/compensation/employee-info/bank-accounts')
const WorkCalendar = () => import(/* webpackChunkName: "compensation-employeeInfo" */'views/admin/pages/compensation/employee-info/work-calendar')
const SalarySplit = () => import(/* webpackChunkName: "compensation-employeeInfo" */'views/admin/pages/compensation/employee-info/salary-split')
const SalaryGroupDistribute = () => import(/* webpackChunkName: "compensation-employeeInfo" */'views/admin/pages/compensation/employee-info/salary-group-distribute')

export default [{
  path: '/compensation/employee-info',
  name: '员工信息设置',
  component: Blank,
  children: [
    {
      path: 'salary-distribute',
      name: '员工薪资组分配',
      component: SalaryGroupDistribute
    },
    {
      path: 'salary-standard',
      name: '员工工资标准',
      component: SalaryStandard
    },
    {
      path: 'salary-history',
      name: '员工调薪历史查询',
      hide: true,
      meta: { subPage: true },
      component: SalaryHistory
    },
    // {
    //   path: 'hours-salary',
    //   name: '小时工工资标准',
    //   component: HoursSalary
    // },
    {
      path: 'hours-salary-history',
      name: '小时工调薪历史查询',
      hide: true,
      meta: { subPage: true },
      component: HoursSalaryHistory
    },
    {
      path: 'bank-accounts',
      name: '员工银行账户',
      component: BankAccounts
    },
    {
      path: 'work-calendar',
      name: '员工工作制',
      component: WorkCalendar
    },
    {
      path: 'salary-split',
      name: '员工固薪拆分',
      component: SalarySplit
    }
  ]
}]
