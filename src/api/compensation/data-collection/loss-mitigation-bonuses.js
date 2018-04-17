
import request from '../../index'
export const config = {
  getLossMitigationList: {
    url: '/compensation/data/reduces',
    method: 'get'
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/reduces/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
