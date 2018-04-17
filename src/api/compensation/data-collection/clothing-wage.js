
import request from '../../index'
export const config = {
  // 服装提成列表
  // getClotingWageList: {
  //   url: '/compensation/data/cloting-wage',
  //   method: 'get'
  // },
  postClotingWageList: {
    url: '/compensation/data/cloting-wage/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 抽数
  getSyncData: {
    url: '/compensation/data/cloting-wage/sync-data/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/cloting-wage/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
