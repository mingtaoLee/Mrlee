import request from '../index.js'

export const config = {
  // 获取我的列表
  planSelf: {
    url: '/performance/plans/self',
    method: 'get'
  },
  // 获取待办列表
  myTask: {
    url: '/performance/myTask',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
