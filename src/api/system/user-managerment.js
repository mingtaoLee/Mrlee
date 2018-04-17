import request from '../index.js'
export const config = {
  // 获取用户表格数据
  getUserList: {
    url: '/system/users/findUserList',
    method: 'get'
  },
  // 新增用户
  createUser: {
    url: '/system/users/createUser',
    method: 'post'
  },
  // 修改用户
  updateUser: {
    url: '/system/users/updateUser',
    method: 'put'
  },
  // 停用用户
  stopUser: {
    url: '/system/users/disable/{userId}',
    method: 'put'
  },
  // 启用用户
  startUser: {
    url: '/system/users/enabled/{userId}',
    method: 'put'
  },
  // 获取薪资组用户
  getGroups: {
    url: '/compensation/basic/groups/groupsearchdup',
    method: 'get'
  },
  // 根据id获取用户信息进行修改
  getUserInfo: {
    url: '/system/users/findUserByLoginId',
    method: 'get'
  },
  // 根据id查找用户
  findUserAndGrant: {
    url: '/system/users/findUserAndGrantByLoginId',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
