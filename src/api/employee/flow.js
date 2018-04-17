import request from '../index.js'

export const config = {
  // 流程控制信息
  getWorkflow: {
    url: '/workflow/information/{processInstanceId}',
    method: 'get'
  },
  // 流程流转日志
  getWorkflowLog: {
    url: '/workflow/log/{taskId}',
    method: 'get'
  },
  // 流程审批信息
  getWorkflowComment: {
    url: '/workflow/comment/{taskId}',
    method: 'get'
  },

// 流程审批信息
  getworkflowbasehistory: {
    url: '/workflow/base/history/informaton',
    method: 'get'
  },
// 下面是组件利用的接口
  // 获取流程图
  getWorkflowImage: {
    url: '/workflow/base/history/image',
    method: 'get'
  },

// 获取待审流程
  getWorkflowRunning: {
    url: '/workflow/base/running/task',
    method: 'get'
  },

  // 全部信息获取
  getWorkflowBase: {
    url: '/workflow/base/running/task/info',
    method: 'get'
  },

  // 流程提交总接口
  postWorkflowSubmit: {
    url: '/workflow/base/submit',
    method: 'post'
  },
// 流程扭转
  putWorkflowSubmit: {
    url: '/workflow/base/submit',
    method: 'put'
  },
  // 暂存
  postWorkflowSave: {
    url: '/workflow/base/save',
    method: 'post'
  },

  // 获取流程历史节点
  getWorkflowOverrule: {
    url: '/workflow/base/overrule',
    method: 'get'
  },
  // 驳回
  putWorkflowOverrule: {
    url: '/workflow/base/overrule',
    method: 'put'
  },

  // 废弃流程
  deleteTask: {
    url: '/workflow/base/running/task/{taskId}',
    method: 'delete'
  },
  // 流程暂时测试使用的接口
  // 获取流程信息
  getWorkflowByEmpId: {
    url: '/workflow/employees/{empPfId}',
    method: 'get'
  },
  // 转正人员流程获取
  getWorkflowRegular: {
    url: 'workflow/employees/regular',
    method: 'get'
  },
  // 转正流程发起
  postWorkflowRegularSubmit: {
    url: '/workflow/employees/regular/submit',
    method: 'post'
  },

  // 转正流程转下一步
  putWorkflowRegularSubmit: {
    url: '/workflow/employees/regular/submit',
    method: 'put'
  },

  getWorkflowDimission: {
    url: '/workflow/employees/dimission',
    method: 'get'
  },
  postWorkflowDimissionSubmit: {
    url: '/workflow/employees/dimission/submit',
    method: 'post'
  },
  putWorkflowDimissionSubmit: {
    url: '/workflow/employees/dimission/submit',
    method: 'put'
  },
  // 借调测试接口
  // 发起借调流程
  postWorkflowSecondSubmit: {
    url: '/workflow/employees/secondment/submit',
    method: 'post'
  },
  // 获取借调流程信息
  getWorkflowSecond: {
    url: '/workflow/employees/secondment',
    method: 'get'
  },
  //  借调扭转下一步
  putWorkflowSecondSubmit: {
    url: '/workflow/employees/secondment/submit',
    method: 'put'
  },

  // 下面是流程中心的内容
  getWorkflowProcessCategory: {
    url: '/workflow/base/process-category',
    method: 'get'
  },
  getProcessCategory: {
    url: '/workflow/base/process-category/{id}',
    method: 'get'
  },
  // 发起流程
  getFlowStart: {
    url: 'workflow/base/process/{processType}/start/{ispc}',
    method: 'get'
  },
  // 流程中心搜索
  getFindProcess: {
    url: '/workflow/base/process/{ispc}/find/',
    method: 'get'
  },
  // 已审流程列表
  getPassProcess: {
    url: 'workflow/base/process/pass',
    method: 'get'
  },
  // 我的流程列表
  getSelfProcess: {
    url: 'workflow/base/process/self',
    method: 'get'
  },
  // 获取流程定义节点以及需要设计节点审批人
  getWorkflowAssiginee: {
    url: '/workflow/base/assiginee',
    method: 'get'
  },
  // 收藏流程模板
  postCollection: {
    url: '/workflow/base/collection',
    method: 'post'
  },
  // 取消流程模板
  deleteCollection: {
    url: '/workflow/base/collection',
    method: 'delete'
  },
  // 获取收藏列表
  getCollection: {
    url: '/workflow/base/collection',
    method: 'get'
  },
  // 获取最近列表
  getLately: {
    url: '/workflow/base/lately',
    method: 'get'
  },
  getMessageList: {
    url: '/workflow/base/reject/message',
    method: 'get'
  },
  postMessage: {
    url: '/workflow/base/reject/message',
    method: 'post'
  },
  deleteMessage: {
    url: '/workflow/base/reject/message',
    method: 'delete'
  },
  getMessageListS: {
    url: '/workflow/base/agree/message',
    method: 'get'
  },
  postMessageS: {
    url: '/workflow/base/agree/message',
    method: 'post'
  },
  deleteMessageS: {
    url: '/workflow/base/agree/message',
    method: 'delete'
  },
  putWorkFlowRecall: {
    url: 'workflow/base/recall/{taskId}',
    method: 'put'
  },
  putWorkFlowTransfer: {
    url: '/workflow/base/transfer/assignee',
    method: 'put'
  },
  // 根据模板KEY 获取流程节点及处理人
  postFlowAssigneeByKey: {
    url: '/workflow/base/process-definitions/keys/{key}/nodes',
    method: 'post'
  },

  // 判断是否是新版流程图模板的接口
  getNewVersion: {
    url: '/workflow/base/definition/new-version/{procDefKey}',
    method: 'get'
  },

  // 获取流程所有信息
  getWorkflowAllInfo: {
    url: '/workflow/base/informaton',
    method: 'get'
  },

    // 获取所有新版流程
  getNewVersionFlow: {
    url: '/workflow/base/definition/new-version-arr',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
