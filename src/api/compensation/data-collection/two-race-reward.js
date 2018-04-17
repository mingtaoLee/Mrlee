/**
 * 二集群赛马
 */
import request from '../../index'
export const config = {
  // GET二集群赛马奖励分页查询
  // getTwoRacingPageList: {
  //   url: '/compensation/data/secondRacing',
  //   method: 'get'
  // },
  getTwoRacingPageList: {
    url: '/compensation/data/secondRacing/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  getSecondRacingData: {
    url: '/compensation/calculate/secondRacing/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  getAvailable: {
    url: '/org/pos/titles/available',
    method: 'get'
  },
  getOrgUnitList: {
    url: '/compensation/data/secondRacing/OrgUnitList',
    method: 'get'
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/secondRacing',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
