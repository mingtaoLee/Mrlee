import request from '../index.js'

export const config = {
  // 获取绩效模版列表
  templateList: {
    url: '/performance/templates',
    method: 'get'
  },
  // 获取绩效模版信息
  oneTemplateDetail: {
    url: '/performance/template/{templateId}',
    method: 'get'
  },
  //  修改绩效模版
  modifiedTemplate: {
    url: '/performance/template/{templateId}',
    method: 'put'
  },
  // 增加一个绩效模版
  addOneTemplate: {
    url: '/performance/template',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  // 启用
  enabledTemplates: {
    url: '/performance/templates/enabled',
    method: 'post'
  },
  // 禁用
  disabledTemplates: {
    url: '/performance/templates/disabled',
    method: 'post'
  },
  // 删除
  deleteTemplates: {
    url: '/performance/templates/',
    method: 'put'
  },
  // 获取所有启动的评分标准
  standardsOpenList: {
    url: '/performance/standards/all',
    method: 'get'
  },
  // 模板自定义导出
  postTemplateExport: {
    url: '/performance/templates/{name}/export',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
