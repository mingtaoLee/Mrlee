import request from '../index.js'
export const config = {
  // 默认菜单
  getDefaultMenus: {
    url: '/public-access/defaultmenus'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
