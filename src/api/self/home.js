import request from '../index.js'
export const config = {
  // 招聘公告
  requirements: {
    url: '/self/recruit/requirements',
    method: 'get'
  },
  // 模块的选择
  // getSelfHomePlate: {
  //   url: '/self/homePlate/getSelfHomePlate',
  //   method: 'get'
  // },
  // 自我介绍的详情
  getHomeEmployeeInfo: {
    url: '/self/employee/home/getHomeEmployeeInfo',
    method: 'get'
  },
  // 我的代办
  todo: {
    url: 'self/message/pageTodo',
    method: 'get'
  },
  // 条件查询代办
  pageTodo: {
    url: '/self/message/pageTodo',
    method: 'get'
  },
  // 码表的查询
  items: {
    url: '/public-access/dicts/{dictCode}/items',
    method: 'get'
  },
  // 流程跟踪
  getMySelfProcess: {
    url: '/self/workflow/getMySelfProcess',
    method: 'get'
  },
  // 待阅
  listToRead: {
    url: '/self/message/listToRead',
    method: 'get'
  },
  // 待办
  listTodo: {
    url: '/self/message/listTodo',
    method: 'get'
  },
  // 待阅，待办总数
  countUserTodo: {
    url: '/self/message/countUserTodo',
    method: 'get'
  },
  // 招聘列表
  getRecruitList: {
    url: '/self/recruit/requirements',
    method: 'get'
  },
  // 招聘信息详情
  getRecruitDetail: {
    url: '/self/recruit/requirements/findRctRequirementDetail',
    method: 'get'
  },
  // 将未读信息置为已读
  putComplete: {
    url: '/message/todo/complete/{todoId}',
    method: 'put'
  },
  // 这里是常用功能查询所以可以添加的功能（下）
  defaultmenus: {
    url: 'public-access/defaultmenus',
    method: 'get'
  },
  // 常用功能保存
  postCollection: {
    url: '/public-access/home/collection',
    method: 'post'
  },
  // 编辑常用功能查询
  getCollection: {
    url: '/public-access/home/collection'
  },
  getMenu: {
    url: '/public-access/menus',
    method: 'post'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
