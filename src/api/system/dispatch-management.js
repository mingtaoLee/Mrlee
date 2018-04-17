import request from '../index.js'

export const config = {
  // 任务管理相关
  // 新增任务
  addTask: {
    url: '/scheduler/jobs',
    method: 'post'
  },
  // 更新任务
  updateTask: {
    url: '/scheduler/jobs',
    method: 'post'
  },
  // 任务绑定触发器
  bindTrigger: {
    url: '/scheduler/jobs/{jobId}/triggers/bind',
    method: 'post'
  },
  // 暂停任务
  pauseTask: {
    url: '/scheduler/jobs/pause',
    method: 'post'
  },
  // 删除任务
  deleteTask: {
    url: '/scheduler/jobs/{ids}',
    method: 'delete'
  },
  // 任务解绑触发器
  // unbindTrigger: {
  //   url: '/scheduler/jobs/{jobId}/triggers/unbind',
  //   method: 'post'
  // },
  // 恢复任务
  resumeTask: {
    url: '/scheduler/jobs/resume',
    method: 'post'
  },
  // 获取任务列表
  getTaskList: {
    url: '/scheduler/jobs',
    method: 'get'
  },
  // 查询任务
  searchTask: {
    url: '/scheduler/jobs/{id}',
    method: 'get'
  },
  // 获得该任务的执行记录
  getExecuteRecord: {
    url: '/scheduler/jobs/{id}/records',
    method: 'get'
  },
  // 获得任务绑定的触发器
  getBindedTrigger: {
    url: '/scheduler/jobs/{id}/triggers',
    method: 'get'
  },
  // 手动执行任务
  executeTask: {
    url: '/scheduler/jobs/{id}',
    method: 'put'
  },
  // 获得可绑定的触发器
  getAcessTrigger: {
    url: '/scheduler/jobs/{jobId}/unbindTriggers',
    method: 'get'
  },
  getAllTriggers: {
    url: '/scheduler/triggers/list',
    method: 'get'
  },
  // 触发器管理相关
  // 添加触发器
  addTrigger: {
    url: '/scheduler/triggers',
    method: 'post'
  },
  // 修改触发器
  modifyTrigger: {
    url: '/scheduler/triggers',
    method: 'post'
  },
  // 删除触发器
  deleteTrigger: {
    url: '/scheduler/triggers/{ids}',
    method: 'delete'
  },
  // 绑定任务
  bindTask: {
    url: '/scheduler/triggers/{triggerId}/jobs/bind',
    method: 'post'
  },
  // 解除绑定任务
  unbindTask: {
    url: '/scheduler/triggers/{triggerId}/jobs/unbind',
    method: 'post'
  },
  // 验证cron表达式
  verifyCronExpression: {
    url: '/scheduler/triggers/cronExpression/validate',
    method: 'get'
  },
  // 获得触发器列表
  getTriggerList: {
    url: '/scheduler/triggers',
    method: 'get'
  },
  // 获得触发器绑定的任务
  getBindedTask: {
    url: '/scheduler/triggers/{id}/jobs',
    method: 'get'
  },
  // 获得触发器的信息
  getTriggerInfo: {
    url: '/scheduler/triggers/{id}',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
