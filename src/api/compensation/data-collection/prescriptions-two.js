
import request from '../../index'
export const config = {
  getPrescriptTwoList: {
    url: '/compensation/data/prescriptionTwos/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // getPrescriptTwoList: {
  //   url: '/compensation/data/prescriptionTwos',
  //   method: 'get'
  // },
  getPrescriptionTwos: {
    url: '/compensation/data/prescriptionTwos/sync-data/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/prescriptionTwos/updateConfirmStatus',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
