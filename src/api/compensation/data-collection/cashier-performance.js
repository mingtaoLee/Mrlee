/**
 * Created by ZHANZF on 2017-11-28.
 * 数据收集
 */
import request from '../../index'
export const config = {

  /** 收银绩效页面 */

  // 收银绩效列表获取
  getCashierPerformanceList: {
    url: '/compensation/data/cashs',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 新增收银绩效
  postCashierPerformanceList: {
    url: '/compensation/data/cashs/create',
    method: 'post'
  },
  // 批量删除
  deleteCashierPerformanceList: {
    url: '/compensation/data/cashs',
    method: 'put'
  },
  // 根据id获取对应收银绩效
  getCashierPerformance: {
    url: '/compensation/data/cashs/{id}',
    method: 'get'
  },
  // 根据id删除对应收银绩效
  deleteCashierPerformance: {
    url: '/compensation/data/cashs/{id}',
    method: 'delete'
  },
  // 根据id修改对应收银绩效
  putCashierPerformance: {
    url: '/compensation/data/cashs/{id}',
    method: 'put'
  },
  // 收银绩效抽数
  getCashierExtract: {
    url: '/compensation/data/cashs/extract',
    method: 'get'
  },
  // 获取收银奖惩合计
  getCashierDetails: {
    url: '/compensation/data/cashs/details',
    method: 'get'
  },
  // 一级集群收银绩效抽数
  getSyncFirstData: {
    url: '/compensation/data/cash-performance/one-level/sync-data/{checkMonth}',
    method: 'get'
  },
  // 二级集群收银绩效抽数
  getSyncSecondData: {
    url: '/compensation/data/cash-performance/two-level/sync-data/{checkMonth}',
    method: 'get'
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/cashs/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
