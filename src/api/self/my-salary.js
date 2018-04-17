import request from '../index.js'
export const config = {
  // 年份的查询
  getPayTime: {
    url: '/self/pay/getPayTime',
    method: 'get'
  },
  getSelfIncome: {
    url: '/self/pay/getSelfIncome',
    method: 'get'
  },
  getSalaryStandard: {
    url: '/self/pay/findFullsalaryStandard',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
