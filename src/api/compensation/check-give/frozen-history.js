import request from 'api/index'

export const config = {
  // 获取冻结列表
  getFrozenList: {
    url: '/pay/blocked/records',
    method: 'get'
  },
  // 解除冻结
  putRefreshFrozen: {
    url: '/pay/blocked/records/unblock',
    method: 'put'
  },
  // 再次支付流程-获取冻结列表
  getBlockList: {
    url: '/pay/blocked/records/unblock',
    method: 'get'
  },
  // 解冻前校验
  postCheckData: {
    url: '/pay/blocked/records/charm',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
