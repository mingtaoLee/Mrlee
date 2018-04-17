/**
 * Created by ZHANZF on 2017-11-22.
 */
import request from '../../index'
// 员工信息设置
export const config = {

  /** 员工工资标准页面 */

  // 获取员工标准工资列表
  getSalaryList: {
    url: '/compensation/employee/pay/standard',
    method: 'get'
  },
  // 根据id获取对应员工工资历史记录
  getEmpSalaryHistory: {
    url: '/compensation/employee/pay/standard/{id}',
    method: 'get'
  },
  // 获取员工标准工资历史列表
  getSalaryHistoryList: {
    url: '/compensation/employee/pay/standard/history',
    method: 'get'
  },
  // 员工标准工资修改
  putUpdatesStandard: {
    url: '/compensation/employee/pay/standard/update',
    method: 'put'
  },
  // 获取员工标准工资修改页面
  getUpdatesStandard: {
    url: '/compensation/employee/pay/standard/find',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
