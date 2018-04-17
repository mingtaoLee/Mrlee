import request from '../index.js'
// 开发阶段使用代理，上线就把/api删掉
export const config = {
  // 获取表头信息
  getStandardPositionHead: {
    url: '/org/pos/titles/available',
    method: 'get'
  },
  // 标准职位图谱查询
  standardPositionSearch: {
    url: '/org/pos/standardJobAtlas/search',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
