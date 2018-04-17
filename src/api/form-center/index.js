import request from '../index'

export const config = {
  // 获取永洪报表URL
  getReportsUrl: {
    url: '/system/menus/reports/{reportPath}'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
