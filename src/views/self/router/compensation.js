/**
 * 我的薪酬路由
 */
import Blank from 'components/common/layout/blank'
const MySalary = () => import(/* webpackChunkname: 'my-salary' */ '../pages/compensation/my-salary')
const MyPayrollRecords = () => import(/* webpackChunkname: 'my-payroll-records' */ '../pages/compensation/my-payroll-records')
export default [
  {
    path: '/self_compensation',
    name: '我的薪酬',
    component: Blank,
    hideIcon: true,
    redirect: '/self_compensation/my_salary',
    children: [{
      path: 'my_salary',
      name: '我的工资',
      component: MySalary
    },
    {
      path: 'my_payroll_records',
      name: '调薪记录',
      component: MyPayrollRecords
    }]
  }
]
