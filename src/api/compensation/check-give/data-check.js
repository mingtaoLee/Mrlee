/**
 * Created by huangzp on 2017-12-5.
 */
import request from '../../index'
// 数据稽查
export const config = {
// 数据稽查结果列表
  getDataCheck: {
    url: '/pay/data-check',
    method: 'get'
  },
  // 查询异常
  getSalaryException: {
    url: '/pay/data-check/exception/{employeeId}',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
