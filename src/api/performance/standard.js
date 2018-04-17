import request from '../index.js'

export const config = {
  // 获取多个评分标准信息
  standardList: {
    url: '/performance/standards',
    method: 'get'
  },
  // 获取评分标准详细信息
  oneStandardDetail: {
    url: '/performance/standard/{standardId}',
    method: 'get'
  },
  //  修改绩效等级
  modifiedStandard: {
    url: '/performance/standards/{standardId}',
    method: 'put'
  },
  // 增加一个评分标准
  addOneStandard: {
    url: '/performance/standard',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  enabledStandards: {
    url: '/performance/standards/enabled',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  // 禁用
  disabledStandards: {
    url: '/performance/standards/disabled',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  // 删除
  deleteStandards: {
    url: '/performance/standards',
    method: 'put',
    headers: {'Content-Type': 'application/json'}
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
