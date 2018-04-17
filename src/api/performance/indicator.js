import request from '../index.js'

export const config = {
  indicatorslList: {
    url: '/performance/indicators',
    method: 'get'
  },
  standardsAll: {
    url: '/performance/standards/all',
    method: 'get'
  },
  oneIndicatorDetail: {
    url: '/performance/indicator/{indicatorId}',
    method: 'get'
  },
  //  修改绩效等级
  modifiedIndicator: {
    url: '/performance/indicator/{indicatorId}',
    method: 'put',
    headers: {'Content-Type': 'application/json'}
  },
  // 增加一个绩效指标
  addOneIndicator: {
    url: '/performance/indicator',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  // 启用
  enabledIndicators: {
    url: '/performance/indicators/enabled',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  // 禁用
  disabledIndicators: {
    url: '/performance/indicators/disabled',
    method: 'post',
    headers: {'Content-Type': 'application/json'}

  },
  deleteIndicators: {
    url: '/performance/indicators',
    method: 'put',
    headers: {'Content-Type': 'application/json'}
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
