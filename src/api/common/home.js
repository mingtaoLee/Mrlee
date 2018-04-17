import request from '../index'

export const config = {
  // 获取常用功能
  getCollection: {
    url: '/public-access/home/collection'
  },
  // 编辑常用功能
  postCollection: {
    url: '/public-access/home/collection',
    method: 'post'
  },
  // 我的待审列表
  getTodoList: {
    url: '/message/todo'
  },
  // 获取用户待办数量
  getCountUserTodo: {
    url: '/message/todo/countUserTodo'
  },
  // 获取所有的待办或者待阅列表
  getTodoOrToLook: {
    url: '/message/todo/listTodo'
  },
  // 获取用户待办分页列表
  getCountUserTodoList: {
    url: '/message/todo'
  },
  // 将未读信息置为已读
  putComplete: {
    url: '/message/todo/complete/{todoId}',
    method: 'put'
  },
  // 获取任务跟踪内容
  getTaskFollowData: {
    url: '/common/taskTrace/',
    method: 'get'
  },
  // 提交任务跟踪内容
  postTaskFollowData: {
    url: '/common/taskTrace/',
    method: 'post'
  },
  // 获取添加常用功能菜单接口
  getMenu: {
    url: '/public-access/menus',
    method: 'post'
  },
  // 查看每条任务状态
  getTaskStatu: {
    url: 'common/fileSchedule'
  },
  // 获取导出任务详情
  getExportDetails: {
    url: '/common/fileSchedule/{exportFileId}',
    method: 'get'
  },
  // 获取开始下载任务的id
  getExportTaskId: {
    url: '/common/getFileScheduleId',
    method: 'get'
  },
  // 下载对应的任务
  downExportFile: {
    url: '/common/fileSchedule/{exportFileId}/download',
    method: 'get'
  },
  // 获取导出任务列表
  getExportTaskList: {
    url: '/common/fileSchedules',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
