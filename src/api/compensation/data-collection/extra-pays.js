/**
 * Created by ZHANZF on 2017-11-28.
 * 数据收集
 */
import request from '../../index'
export const config = {

  /** 额外支付页面 */
  // 额外支付列表头部获取
  getExtraPaysPerformanceListTitle: {
    url: '/compensation/data/extraPays/list/title',
    method: 'get'
  },
  // 额外支付列表获取
  getExtraPaysPerformanceList: {
    url: '/compensation/data/extraPays/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 新增额外支付
  postExtraPaysPerformanceList: {
    url: '/compensation/data/extraPays',
    method: 'post'
  },
  // 批量删除
  deleteExtraPaysPerformanceList: {
    url: '/compensation/data/extraPays',
    method: 'put'
  },
  // 根据id获取对应额外支付
  getExtraPaysPerformance: {
    url: '/compensation/data/extraPays/{id}',
    method: 'get'
  },
  // 根据id删除对应额外支付
  deleteExtraPaysPerformance: {
    url: '/compensation/data/extraPays/{id}',
    method: 'delete'
  },
  // 根据id修改对应额外支付
  putExtraPaysPerformance: {
    url: '/compensation/data/extraPays/{id}',
    method: 'put'
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/extraPays/updateConfirmStatus',
    method: 'put'
  }
  // 收银绩效抽数
//   getCashierExtract: {
//     url: '/compensation/data/cashs/extract',
//     method: 'get'
//   },
  // 获取收银奖惩项
//   getCashierOptions: {
//     url: '/compensation/data/cashs/prices',
//     method: 'get'
//   }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
