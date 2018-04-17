/**
 * Created by Younh on 2017/12/17.
 */

import request from '../../index'
export const config = {
  getNewStoreBonusesList: {
    url: '/compensation/data/newProfitsBonus',
    method: 'get'
  },
  changeNewStoreBonusesListStatus: {
    url: '/compensation/data/newProfitsBonus',
    method: 'put'
  },
  // 新店利润分红包季度抽数
  getNewProfitsBonusOne: {
    url: '/compensation/data/newProfitsBonus/sync-data/1/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 新店利润分红包半年度抽数
  getNewProfitsBonusTwo: {
    url: '/compensation/data/newProfitsBonus/sync-data/2/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/newProfitsBonus/updateConfirmStatus',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
