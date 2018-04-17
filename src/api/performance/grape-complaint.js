import request from '../index.js'

export const config = {
  // 获取多个评分标准信息
  complaintList: {
    url: '/grape/evaluations/complaints',
    method: 'get'
  },
  complainedList: {
    url: '/grape/evaluations/complained',
    method: 'get'
  },
  // 驳回或者确定申诉
  staffComplaint: {
    url: '/grape/evaluations/{evaluationId}/settlement',
    method: 'post'
  },
  // 评分申诉详情
  complainedDetail: {
    url: '/grape/evaluations/{evaluationId}/complained',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
