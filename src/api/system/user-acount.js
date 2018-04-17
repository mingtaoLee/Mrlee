import request from '../index.js'
export const config = {
    // 获取员工列表
  getStaffList: {
    url: '/employee/systems/user',
    method: 'get'
  },
  // 获取用户列表
  getUserList: {
    url: '/system/users/findUserList',
    method: 'get'
  },
  // 获取用户列表新接口
  getUserListNew: {
    url: '/system/users/findUserListExpAdmin',
    method: 'get'
  },
// 绑定员工
  acountUser: {
    url: '/employee/systems/binding',
    method: 'post'
  },
//   解绑
  unbindUser: {
    url: '/employee/systems/disBinding',
    method: 'delete'
  },
  //   锁定用户
  disableUser: {
    url: '/system/users/disable/{userId}',
    method: 'put'
  },
  //   解锁用户
  enabledUser: {
    url: '/system/users/enabled/{userId}',
    method: 'put'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
