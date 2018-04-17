import request from '../index.js'

var config = {
  uploadFile: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plans/import',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'}
  },

  downloadFile: {
    url: '/templates/pfmPlanTemplate/download',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
