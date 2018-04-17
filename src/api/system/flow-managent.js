import request from '../index.js'

export const config = {
  // 获取流程图
  getDiagram: {
    url: 'workflow/base/diagram',
    method: 'get'
  },
  // 流程发布接口
  postWorkflowDeploy: {
    url: 'workflow/system/deploy',
    method: 'post'
  },
  // 流程权限树
  getWorkflowMenu: {
    url: '/workflow/system/form/menu/{pfFormMenuId}',
    method: 'get'
  },

  getMenuList: {
    url: '/workflow/system/form/menu',
    method: 'get'
  },

  getMenuNameList: {
    url: '/workflow/system/form/menu/list',
    method: 'get'
  },

  // 获取权限配置表单信息

  getFormjurisdiction: {
    url: 'workflow/system/form/field/jurisdiction',
    method: 'get'
  },

  getFormDetail: {
    url: 'workflow/system/form/menu/{pfFormMenuId}',
    method: 'get'
  },

  // 更新表单信息
  putFormData: {
    url: 'workflow/system/form/menu',
    method: 'put'
  },

  // 更新表单信息
  postFormData: {
    url: 'workflow/system/form/menu',
    method: 'post'
  },

  // 获取流程列表
  getProcdefList: {
    url: '/workflow/system/form/resource/procdef',
    method: 'get'
  },
  // 修改表单信息
  modifyFormJurisdiction: {
    url: '/workflow/system/form/field/jurisdiction',
    method: 'post'
  },

  // 流程发布
  deployWorkFlow: {
    url: '/workflow/system/deploy',
    method: 'post'
  },

  // 行内删除表单
  deleteRow: {
    url: 'workflow/system/form/menu/{pfFormMenuId}',
    method: 'delete'
  },

  // 获取角色列表
  getPrincipalList: {
    url: 'workflow/system/principal/{entityType}',
    method: 'get'
  },

  // 查询规则配置
  getRuleConfig: {
    url: 'workflow/base/ruleConfig',
    method: 'get'
  },

  // 修改规则配置
  putRuleConfig: {
    url: 'workflow/base/ruleConfig',
    method: 'put'
  },

  // 获取发起人和角色所属人员
  getEmployeeByEmployeeIdAndPrincipalId: {
    url: 'workflow/base/process-definitions/principal/{principalId}',
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
