import request from '../index.js'

export const config = {
  // 查询个人评估的计划
  getSelfEvaluationPlan: {
    url: '/performance/plans/selfEvaluation',
    method: 'get'
  },

  // 查询个人审核的绩效计划
  getSelfChecksPlan: {
    url: '/performance/plans/selfChecks',
    method: 'get'
  },

  // 查询我提交的绩效计划
  getSelfSubmits: {
    url: '/performance/plans/selfSubmits',
    method: 'get'
  },

  // 查询我收集的指标数据
  getSelfCollections: {
    url: '/performance/indicators/selfCollections',
    method: 'get'
  },

  // 查询我审核的指标数据
  getSelfChecks: {
    url: '/performance/indicators/selfChecks',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
