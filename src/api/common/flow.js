import request from '../index'

export const config = {
  // 根据任务ID 获取流程相关信息
  getFlowDetails: {
    url: '/workflow/base/running/task/{taskId}',
    method: 'get'
  },

  // 根据模板ID 获取流程模板信息
  getFlowDefinitionById: {
    url: '/workflow/base/diagram/definition/id/{id}',
    method: 'get'
  },

  // 根据实例ID 获取流程实例信息
  getFlowInstance: {
    url: '/workflow/base/diagram/instance/{id}',
    method: 'get'
  },

  // 根据模板KEY 获取流程模板信息
  getFlowDefinitionByKey: {
    url: '/workflow/base/diagram/definition/key/{id}',
    method: 'get'
  },

  // 根据模板KEY 获取流程节点及处理人
  getFlowAssigneeByKey: {
    url: '/workflow/base/process-definitions/keys/{key}/nodes',
    method: 'get'
  },

  // 获取维度管理列表
  getFlowDimension: {
    url: '/workflow/system/dimensions',
    method: 'get'
  },

  // 修改维度管理列表
  putFlowDimension: {
    url: '/workflow/system/dimensions',
    method: 'put'
  },

  // 新增维度管理列表
  postFlowDimension: {
    url: '/workflow/system/dimensions',
    method: 'post'
  },

  // 删除维度管理列表
  deleteFlowDimension: {
    url: '/workflow/system/dimensions/{dimensionId}',
    method: 'delete'
  },

  // 检测维度Key是否重复
  getIsKeyDuplicate: {
    url: '/workflow/system/dimensions/keys/{dimensionKey}/exist',
    method: 'get'
  },

  // 获取主体管理列表
  getFlowPrincipal: {
    url: '/workflow/system/principal',
    method: 'get'
  },

  // 新增主体管理列表
  postFlowPrincipal: {
    url: '/workflow/system/principal',
    method: 'post'
  },

  // 修改主体管理列表
  putFlowPrincipal: {
    url: '/workflow/system/principal',
    method: 'put'
  },

  // 删除主体管理列表项
  deleteFlowPrincipal: {
    url: 'workflow/system/principal/delete/{principalId}',
    method: 'delete'
  },

  // 检查主体Code是否重复
  getIsCodeDuplicate: {
    url: '/workflow/system/principal/checkCode/{code}/exist',
    method: 'get'
  },

  // 检查主体Name是否重复
  getIsNameDuplicate: {
    url: '/workflow/system/principal/checkName/{name}/exist',
    method: 'get'
  },

  // 获取主体维度列表
  getFlowPrincipalDimension: {
    url: 'workflow/system/principal/queryDimension',
    method: 'get'
  },

  // 获取决策表左等式下拉
  getDecisionAttrs: {
    url: 'workflow/base/ruleConfig/decisionInit',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
