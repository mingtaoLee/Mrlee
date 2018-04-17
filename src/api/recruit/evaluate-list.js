import request from '../index.js'

export const config = {
  // 评估表模板管理的列表
  evaluateList: {
    url: '/recruit/evaluationTemplates',
    method: 'get'
  },
  // 新增
  addOneTemplate: {
    url: '/recruit/evaluationTemplate',
    method: 'post'
  },
  // 修改
  modifiedTemplate: {
    url: 'recruit/evaluationTemplates/{evaluationTemplateId}',
    method: 'put'
  },
  // 启用
  enabledTemplates: {
    url: '/recruit/evaluationTemplates/enabled',
    method: 'post'
  },
  // 禁用
  disabledTemplates: {
    url: '/recruit/evaluationTemplates/disabled',
    method: 'post'
  },
  // 删除
  deleteTemplates: {
    url: '/recruit/evaluationTemplates/delete',
    method: 'put'
  },
  // 查看所有启用的评估表模板管理
  evaluateOpenList: {
    url: '/recruit/evaluationTemplates/enabled',
    method: 'get'
  },
  // 选择评估模板
  getEvaluationOptionsEnabled: {
    url: '/recruit/evaluationOptions/enabled',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}

