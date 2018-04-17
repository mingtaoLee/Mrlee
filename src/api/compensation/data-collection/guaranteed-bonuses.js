/**
 * Created by ZHANZF on 2017-11-28.
 * 数据收集
 */
import request from '../../index'
export const config = {

  /** 保底分红页面 */

  // 保底分红列表获取
  // getLowests: {
  //   url: '/compensation/data/lowests',
  //   method: 'get'
  // },
  postLowests: {
    url: '/compensation/data/lowests/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 服装保底分红列表获取
  getClothingLowests: {
    url: '/compensation/data/clothinglowests/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 一集群保底分红
  getSyncBonusData: {
    url: '/compensation/calculate/low-bonus/{checkMonth}',
    method: 'get'
  },
  // 二集群服装保底分红
  getSyncClothBonusData: {
    url: '/compensation/calculate/low-bonus/clothing/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 服装保底分红数据确认
  confirmData: {
    url: '/compensation/data/clothinglowests/updateConfirmStatus',
    method: 'put'
  },
  // 保底分红数据确认
  lowestsConfirmData: {
    url: '/compensation/data/lowests/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
