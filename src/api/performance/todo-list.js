import request from '../index.js'

export const config = {
  // 查询未审核绩效计划
  getAuditPendingPlan: {
    url: '/performance/plans/unCheck',
    method: 'get'
  },

  // 查询未制定的绩效计划
  getMakePendingPlan: {
    url: '/performance/plans/unmake',
    method: 'get'
  },

  // 查询待审核的绩效指标
  getCheckPendingIndicator: {
    url: '/performance/indicators/notCheck',
    method: 'get'
  },

  // 提交审核的指标
  postCheckIndicator: {
    url: '/performance/indicators/checks',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },

  // 驳回收集的绩效指标
  postRejectIndicator: {
    url: '/performance/indicators/reject',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },

  // 查询待收集的绩效指标
  postCollectPendingIndicator: {
    url: '/performance/indicators/notCollection',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },

  // 提交收集的绩效指标
  postCollectIndicator: {
    url: '/performance/indicators/collections',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },

  // 查询未自评的绩效
  getSelfRatingPendingIndicator: {
    url: '/performance/plans/unSelfEvaluation',
    method: 'get'
  },

  // 查询未复评的绩效计划
  getReviewPendingIndicator: {
    url: '/performance/plans/unLeaderEvaluation',
    method: 'get'
  },

  // 查询未确认评分绩效
  getConfirmPendingIndicator: {
    url: '/performance/plans/unConfirm',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
