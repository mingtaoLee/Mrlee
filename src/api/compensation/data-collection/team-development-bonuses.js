
import request from '../../index'
export const config = {
  getTeamDevBonusesList: {
    url: '/compensation/data/teams/expand/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/teams/expand/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
