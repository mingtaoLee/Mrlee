import request from '../index.js'

export const config = {
  // 通知模板设置的列表
  templateList: {
    url: '/recruit/informs',
    method: 'get'
  },
  // 新增
  addOneTemplate: {
    url: '/recruit/inform',
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  },
  // 修改
  modifiedTemplate: {
    url: '/recruit/informs/{templateId}',
    method: 'put'
  },
  // 启用
  enabledTemplates: {
    url: '/recruit/informs/enabled',
    method: 'post'
  },
  // 禁用
  disabledTemplates: {
    url: '/recruit/informs/disabled',
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  },
  // 删除
  deleteTemplates: {
    url: '/recruit/informs/delete',
    method: 'put'
  },
  // 查看
  oneTemplateDetail: {
    url: '/recruit/informs/{templateId}',
    method: 'get'
  },
  // 查看所有启用的通知模板
  informOpenList: {
    url: '/recruit/informs/enabled',
    method: 'get'
  },
  // 根据部门id取部门名字&信息
  getOrgUnitName: {
    url: '/org/orgs/organizations',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
