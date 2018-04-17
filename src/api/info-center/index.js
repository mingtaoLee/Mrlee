
/**
 * 信息中心公用api
 */

import request from '../index.js'

export const config = {
  // 收藏查询
  addCollection: {
    url: '/msg/query/collection',
    method: 'put'
  },
  getInquiryTableHead: {
    url: '/msg/query/custom/{msgQueryId}/title',
    method: 'get'
  },
  getInquiryTable: {
    url: '/msg/query/custom/{msgQueryId}/run',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
