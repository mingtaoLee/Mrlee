import request from '../index.js'

export const config = {
  // 获取模板列表
  getTemplateList: {
    url: '/employee/print/template',
    method: 'get'
  },
  postNewTemplate: {
    url: '/employee/print/template',
    method: 'post'
  },
  getDict: {
    url: '/public-access/dicts/{dictCode}/items',
    method: 'get'
  },
    // 查看模板
  showTemplate: {
    url: '/employee/contracts/template/{templateId}',
    method: 'get'
  },
  getInfo: {
    url: '/employee/print/printMessage/{empEmployeeId}',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
