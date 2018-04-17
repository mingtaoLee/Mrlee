const EmployeeCheckin = () => import('../pages/employee/employee-checkin.vue')
const EmployeeEnrollment = () => import('../pages/employee/employee-enrollment')
const EmployeeConversion = () => import('../pages/employee/employee-conversion')
const EmployeeMovement = () => import('../pages/employee/employee-movement')
const EmployeeMultiMovement = () => import('../pages/employee/employee-multi-movement')
const EmployeeDimission = () => import('../pages/employee/employee-dimission')
const EmployeeSecond = () => import('../pages/employee/employee-newsecond.vue')
const NewContract = () => import('../pages/employee/contract-new.vue')
const RenewContract = () => import('../pages/employee/contract-renew.vue')
const ChangeSurety = () => import('../pages/employee/guarantor-change.vue')
const CertificatePrint = () => import('../pages/employee/certificate-print.vue')

export default [
  {
    path: 'new_employee_register',
    name: '人员登记',
    hide: true,
    component: EmployeeCheckin
  },
  {
    path: 'employeeHireProcess',
    name: '员工入职',
    hide: true,
    component: EmployeeEnrollment
  },
  {
    path: 'employeeRegularProcess',
    name: '转正',
    hide: true,
    component: EmployeeConversion
  },
  {
    path: 'employeeTransferProcess',
    name: '调动',
    hide: true,
    component: EmployeeMovement
  },
  {
    path: 'new_employee_multi_movement',
    name: '批量调动',
    hide: true,
    component: EmployeeMultiMovement
  },
  {
    path: 'employeeDimissionProcess',
    name: '离职',
    hide: true,
    component: EmployeeDimission
  },
  {
    path: 'employeeSecondmentProcess',
    name: '新增调用',
    hide: true,
    component: EmployeeSecond
  },
  {
    path: 'empChangeSuretyProcess',
    name: '联保人变更',
    hide: true,
    component: ChangeSurety
  },
  // 合同新签和续签流程
  {
    path: 'empNewContractProcess',
    name: '合同新签',
    hide: true,
    component: NewContract
  },
  {
    path: 'empRenewContractProcess',
    name: '合同续签',
    hide: true,
    component: RenewContract
  },
  {
    path: 'employeeCertificateProcess',
    name: '证明打印',
    hide: true,
    component: CertificatePrint
  }
]
