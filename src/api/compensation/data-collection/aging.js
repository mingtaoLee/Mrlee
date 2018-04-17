/**
 * Created by ZHANZF on 2017-11-28.
 * 数据收集
 */
import request from '../../index'
export const config = {

  /** 时效数据页面 */

  // 时效数据列表获取
  getAgings: {
    url: '/compensation/data/prescriptions/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // getAgings: {
  //   url: '/compensation/data/prescriptions',
  //   method: 'get'
  // },
  // 时效数据批量删除
  deleteAgings: {
    url: '/compensation/data/prescriptions',
    method: 'put'
  },
  // 时效数据单条删除
  deleteAging: {
    url: '/compensation/data/prescriptions/{id}',
    method: 'delete'
  },
  getSyncPrescriptData: {
    url: '/compensation/calculate/prescription/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  confirmData: {
    url: '/compensation/data/prescriptions/updateConfirmStatus',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
