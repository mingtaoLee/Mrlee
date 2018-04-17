import request from '../../index'
export const config = {
  // 一集群服装小店时效列表
  postClotingStoreList: {
    url: '/compensation/data/prescriptions/PrescriptionClothingStore',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 抽数
  getClotingStoreSyncData: {
    url: '/compensation/calculate/prescription/clothing/{checkMonth}',
    method: 'get',
    timeout: 3600000
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/prescriptions/PrescriptionClothingStore/updateConfirmStatus',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
