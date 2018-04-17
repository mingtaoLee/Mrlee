/**
 * Created by ZHANZF on 2017-11-23.
 */
import request from '../../index'
// 员工信息设置
export const config = {

  /** 小时工工资标准页面 */

  // 获取员工标准工资列表
  getHoursSalaryList: {
    url: '/compensation/employee/pay/houremp',
    method: 'get'
  },
  // 获取员工标准工资历史列表
  getHoursSalaryHistoryList: {
    url: '/compensation/employee/pay/houremp/history',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
