import request from '../index.js'
export const config = {
  contract: {
    url: '/self/emp/contract',
    method: 'get'
  },
  history: {
    url: '/self/emp/contract/history',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
