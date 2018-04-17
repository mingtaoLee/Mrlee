import request from 'api/index'

export const config = {
  // 获取异常出款列表
  getSalaryApplyList: {
    url: '/pay/rollAudit',
    method: 'get'
  },
  getProcessList: {
    url: '/pay/rollAudit/processList',
    method: 'get'
  },
  postTotalData: {
    url: '/pay/rollAudit/audit/summary',
    method: 'post'
  },
  // 申请出款流程前后端校验
  postCheckProcessList: {
    url: '/pay/rollAudit/audit/check',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
