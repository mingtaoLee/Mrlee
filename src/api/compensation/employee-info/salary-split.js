/**
 * Created by ZHANZF on 2017-11-23.
 */
import request from '../../index'
// 员工信息设置
export const config = {

  /** 固薪拆分页面 */

  // 根据薪资组id获取固薪拆分列表
  getSalarySplit: {
    url: '/compensation/employee/pay/amount',
    method: 'get'
  },
  getSalary: {
    url: '/compensation/employee/pay/amount/{componentListId}',
    method: 'get'
  },
  // 一键拆分
  splitSalaryManual: {
    url: '/compensation/employee/pay/amount/split',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
