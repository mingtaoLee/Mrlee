import request from '../index.js'
export const config = {
  // 年份的查询
  getMyPayrollRecords: {
    url: '/self/Pay/employee/fullsalary/history',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
