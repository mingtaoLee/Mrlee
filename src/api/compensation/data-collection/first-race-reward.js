
import request from '../../index'
export const config = {
  // GET一集群赛马奖励分页查询
  // getFirstRacingPageList: {
  //   url: '/compensation/data/firstRacing',
  //   method: 'get'
  // },
  getFirstRacingPageList: {
    url: '/compensation/data/firstRacing/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  getFirstRacingData: {
    url: '/compensation/calculate/firstRacing/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  confirmData: {
    url: '/compensation/data/firstRacing',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
