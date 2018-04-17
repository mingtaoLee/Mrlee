
/**
 * 已收藏查询相关
 */

import request from 'api/index.js'

export const config = {
  // 根据用户id获取用户收藏的查询
  getCollection: {
    url: '/msg/query/collection',
    method: 'get'
  },
  // 取消收藏查询（批量）
  cancelCollection: {
    url: '/msg/query/collection/cancel',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
