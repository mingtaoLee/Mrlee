
import request from '../../index'
export const config = {
  getFirmOperatingCostsList: {
    url: '/compensation/data/firmProfit',
    method: 'get'
  },
  delFirmOperatingCosts: {
    url: '/compensation/data/firmProfit/{id}',
    method: 'delete'
  },
  modifyFirmOperatingCosts: {
    url: '/compensation/data/firmProfit/{id}',
    method: 'put'
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/firmProfit/updateConfirmStatus',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
