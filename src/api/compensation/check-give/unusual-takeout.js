import request from 'api/index'

export const config = {
  // 获取异常出款列表
  getUnusualTakeoutList: {
    url: '/pay/abnormal/records',
    method: 'get'
  },
  // 异常出款通知
  unusualInform: {
    url: '/pay/abnormal/records/inform',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
