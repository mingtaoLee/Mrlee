import request from '../index.js'

export const config = {

  getMonitorList: {
    url: '/grape/schemes/evaluations',
    method: 'post',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  },

  getMonitorDetail: {
    url: '/grape/schemes/{schemeId}/evaluations',
    method: 'get'
  },

  getDoneDetail: {
    url: '/grape/schemes/{schemeId}/evaluations/evaluated',
    method: 'get'
  },

  getSchemeDetail: {
    url: '/grape/scheme/{schemeId}',
    method: 'get'
  },

  getUnDoDetail: {
    url: '/grape/schemes/{schemeId}/evaluations/notEvaluated',
    method: 'get'
  }

}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
