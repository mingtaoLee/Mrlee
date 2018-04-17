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

  // 获取员工权限列表
  getpageQueryRoleUser: {
    url: '/system/users/role/page',
    method: 'get'
  },

  // 获取员工权限信息
  getRole: {
    url: '/system/users/role',
    method: 'get'
  },
  // 获取员工权限
  getUserRole: {
    url: 'system/roles/UserRole',
    method: 'get'
  },
  // 新建或者更新角色列表
  putUpdateUserRole: {
    url: '/system/roles/updateUserRole',
    method: 'put'
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
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
