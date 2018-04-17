/**
 * Created by GENGTP on 2017-11-29.
 * 数据收集
 */
import request from '../../index'
export const config = {

  /** 工资差异页面 */

  // 工资差异列表获取
  getSalaryDiffList: {
    url: '/compensation/data/pays',
    method: 'get'
  },
  // 根据id更新对应差异项
  putSalaryDiff: {
    url: '/compensation/data/pays/{id}',
    method: 'put'
  },
  // 根据id获取对应工资差异详情
  getSalaryDiff: {
    url: '/compensation/data/pays/{id}',
    method: 'get'
  },
  // 工资差异明细查询
  getSalaryDiffDetail: {
    url: '/compensation/data/pays/{id}/info',
    method: 'get'
  },
  // 批量更新对应差异项
  putSalaryDiffLists: {
    url: '/compensation/data/pays',
    method: 'put'
  },
  // // 根据id更新对应差异项
  // putSalaryDiffList: {
  //   url: '/compensation/data/pays/{id}',
  //   method: 'put'
  // },
  // 数据确认
  confirmData: {
    url: '/compensation/data/pays/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
