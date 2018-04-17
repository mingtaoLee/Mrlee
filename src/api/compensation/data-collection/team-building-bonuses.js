
import request from '../../index'
export const config = {
  getTeamBuildingBonusesList: {
    url: '/compensation/data/teams/build/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/teams/build/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
