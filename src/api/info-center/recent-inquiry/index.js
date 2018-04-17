
/**
 * 最近使用查询相关
 */

import request from 'api/index.js'

export const config = {
  // 根据用户id获取最近使用查询
  getRecentInquiry: {
    url: '/msg/query/recently',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
