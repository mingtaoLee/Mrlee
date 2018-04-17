import request from '../index.js'

export const config = {
  // 获取列表
  schemesList: {
    url: '/performance/resultAnalysis/schemes',
    method: 'get'
  },
  // 获取百分比饼图
  percentPie: {
    url: '/performance/schemes/{schemeId}/periods/{period}/resultAnalysis',
    method: 'get'
  },
  //  获取详情
  planList: {
    url: '/performance/schemes/{schemeId}/periods/{period}/levels/plans',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
