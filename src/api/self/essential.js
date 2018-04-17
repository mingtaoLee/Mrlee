import request from '../index.js'
export const config = {
    // 异动员工异动信息
  empStaffRecord: {
    url: '/self/employee/employees/empStaffRecord',
    method: 'get'
  },
   // 员工银行卡信息
  empBankTax: {
    url: '/self/employeeAccount/getPayEmployeeAccount',
    method: 'get'
  },
  // 银行卡开户信息
  empBankTaxCode: {
    url: '/public-access/areas/{code}/code',
    method: 'get'
  },
  // 员工健康信息
  healthy: {
    url: '/self/employee/employees/healthy',
    method: 'get'
  },
   // 员工家庭信息
  empFamilyMember: {
    url: '/self/employee/employees/empFamilyMember',
    method: 'get'
  },
  // 员工教育经历信息
  empEducation: {
    url: '/self/employee/employees/empEducation',
    method: 'get'
  },
  // 员工工作经验
  empWorkExperience: {
    url: '/self/employee/employees/empWorkExperience',
    method: 'get'
  },
  // 员工培训经历
  empTraining: {
    url: '/self/employee/employees/empTraining',
    method: 'get'
  },
  // 员工资格证书
  empCredential: {
    url: '/self/employee/employees/empCredential',
    method: 'get'
  },
  // 员工基本信息
  getHomeEmployeeInfo: {
    url: '/self/employee/home/getHomeEmployeeInfo',
    method: 'get'
  },
  // 修改员工基本信息
  updateEmployeeBaseInfo: {
    url: '/self/employee/employees/updateEmployeeBaseInfo',
    method: 'post'
  },
  // 修改保存家庭成员信息
  saveEmpFamilyMember: {
    url: '/self/employee/employees/saveEmpFamilyMember',
    method: 'post'
  },
  // 删除家庭成员的信息
  deleteEmpFamilyMember: {
    url: '/self/employee/employees/deleteEmpFamilyMember',
    method: 'post'
  },
  // 上传成功头像，发回数据库
  uploadEmpHeadImage: {
    url: '/self/employee/employees/uploadEmpHeadImage',
    method: 'post',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
}

export default function req (funcName, data, isToken = true, isCancel = false) {
  return request(config, funcName, data, isToken, isCancel)
}
