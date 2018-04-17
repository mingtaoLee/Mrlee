
import request from '../../index'
export const config = {
  getThreeClustersList: {
    url: '/compensation/data/achievement-bonus/three-clusters/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/achievement-bonus/validaty-data',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
