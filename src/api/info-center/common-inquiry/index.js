
/**
 * 公共查询相关
 */

import request from 'api/index.js'

export const config = {
  // 获取公共（共享）查询
  getCommonInquiry: {
    url: '/msg/query/public',
    method: 'get'
  },
  // 查看查询方案详情信息
  getCustomList: {
    url: '/msg/query/custom/{msgQueryId}'
  },
  // 根据信息集 id 获取所有启用的字段
  getColumnList: {
    url: '/msg/infSet/column/{infTableId}/list'
  },
  // 获取所有启用的信息集
  getTableList: {
    url: '/msg/infSet/table/{status}/list'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
