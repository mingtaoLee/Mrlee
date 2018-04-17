/**
 * Created by huangzp on 2018-1-11.
 */
import request from '../../index'
// 用款申请资金组
export const config = {
// 用款申请单查看
  getSalaryApplyData: {
    url: '/pay/payroll-audit-check',
    method: 'get'
  },
  // 查询公司编码
  getCompanyCode: {
    url: '/pay/payroll-audit-check/company-list',
    method: 'get'
  },
  // 修改基本账户
  changeBasicAccount: {
    url: '/pay/payroll-audit-check/company-accounts/update',
    method: 'put'
  },
  // 带出支付账户信息
  getPayAccout: {
    url: '/pay/payroll-audit-check/group-accounts',
    method: 'get'
  },
  // 制单
  billsMake: {
    url: '/pay/payroll-audit-check/bills-make',
    method: 'put'
  },
  // 取消制单
  cancelBillsMake: {
    url: '/pay/payroll-audit-check/bills-cancel',
    method: 'put'
  },
  // 调拨
  transerence: {
    url: '/pay/payroll-audit-check/transference',
    method: 'put'
  },
  // 修改薪资组支付账户信息
  changePayAccount: {
    url: '/pay/payroll-audit-check/group-accounts/update',
    method: 'put'
  },
  // 查询公司对应支付账户
  getCompanyPayAccount: {
    url: '/pay/payroll-audit-check/group-accounts/list',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
