
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
  // 获取自定义的查询列表（搜索）
  getCustomInquiry: {
    url: '/msg/query/custom',
    method: 'get'
  },
  // 新增查询
  addCustomInquiry: {
    url: '/msg/query/custom',
    method: 'post'
  },
  // 修改查询
  modifyCustomInquiry: {
    url: '/msg/query/custom',
    method: 'put'
  },
  // 批量共享
  addInquiryShare: {
    url: '/msg/query/custom/share',
    method: 'put'
  },
  // 批量取消共享
  cancelInquiryShare: {
    url: '/msg/query/custom/unshare',
    method: 'put'
  },
  // 批量删除
  deleteInquiry: {
    url: '/msg/query/delete',
    method: 'delete'
  },
  // 验证查询名称的唯一性
  validateQueryName: {
    url: '/msg/query/checkQueryName',
    method: 'get'
  },
  // 新增，复制，修改操作时点击直接查询按钮的接口
  buttonCheckQuery: {
    url: '/msg/query/custom/run',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
