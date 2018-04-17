/**
 * Created by ZHANZF on 2017-11-23.
 */
import request from '../../index'
// 员工信息设置
export const config = {

  /** 员工发薪账户设置页面 */

  // 获取员工标准工资列表
  getBankAccounts: {
    url: '/compensation/employee/group/account',
    method: 'get'
  },
  // 新增员工标准工资列表
  postBankAccounts: {
    url: '/compensation/employee/group/account/insert',
    method: 'post'
  },
  // 根据id获取对应员工发薪账号
  getBankAccount: {
    url: '/compensation/employee/group/account/{empAccountId}',
    method: 'get'
  },
  // 根据id更新对应员工发薪账号
  putBankAccount: {
    url: '/compensation/employee/group/account/{empAccountId}',
    method: 'put'
  },
  // 根据id删除对应员工发薪账号
  deleteBankAccount: {
    url: '/compensation/employee/group/account/{empAccountId}',
    method: 'delete'
  },
  // 批量删除
  deleteBankAccounts: {
    url: '/compensation/employee/group/account',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
