import request from '../index.js'

export const config = {
  // 获取多个绩效
  schemeList: {
    url: '/performance/schemes',
    method: 'get'
  },
  // 绩效方案编辑查询指标
  indicatorslList: {
    url: '/performance/schemes/indicators',
    method: 'get'
  },
  addOneIndicator: {
    url: '/performance/indicator',
    method: 'post'
  },
  // 获取
  oneSchemeDetail: {
    url: '/performance/scheme/{schemeId}',
    method: 'get'
  },
  //  修改
  modifiedScheme: {
    url: '/performance/scheme/{schemeId}',
    method: 'put'
  },
  // 增加一个
  addOneScheme: {
    url: '/performance/schemes',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  // 启用
  enabledSchemes: {
    url: '/performance/schemes/open',
    method: 'put'
  },
  // 禁用
  closeSchemes: {
    url: '/performance/schemes/close',
    method: 'put'
  },
  // 删除
  deleteSchemes: {
    url: '/performance/schemes',
    method: 'put'
  },
  // 获取所有启用的
  levelsOpenList: {
    url: '/performance/levels/all',
    method: 'get'

  },
  // 获取所有启用的
  templatesOpenList: {
    url: '/performance/templates/all',
    method: 'get'
  },
  getOrgObj: {
    url: '/org/orgs/{id}/detail/echo',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
