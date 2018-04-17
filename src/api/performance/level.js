import request from '../index.js'

export const config = {
  // 获取多个绩效等级信息
  levelList: {
    url: '/performance/levels',
    method: 'get'
  },
  // 获取绩效等级信息
  oneLevelDetail: {
    url: '/performance/level/{levelId}',
    method: 'get'
  },
  //  修改绩效等级
  modifiedLevel: {
    url: '/performance/levels/{levelId}',
    method: 'put'
  },
  // 增加一个绩效等级
  addOneLevel: {
    url: '/performance/level',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  // 启用
  enabledLevels: {
    url: '/performance/levels/enabled',
    method: 'post',
    headers: {'Content-Type': 'application/json'}

  },
  // 禁用
  disabledLevels: {
    url: '/performance/levels/disabled',
    method: 'post',
    headers: {'Content-Type': 'application/json'}

  },
  // 删除
  deleteLevels: {
    url: '/performance/levels',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
