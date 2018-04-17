import request from '../index.js'
export const config = {
  // 获取用户名
  getUserName: {
    url: 'system/users/findUserByLoginId',
    method: 'get'
  },
  // 查询用户拥有的角色列表
  getUserRole: {
    url: 'system/roles/pageQueryUserRole',
    method: 'get'
  },
  // 查找用户未授权角色
  getUnAuthorized: {
    url: 'system/roles/userRole/unAuthorized',
    method: 'get'
  },
  // 更新用户包含角色列表
  getUpdateUserRoled: {
    url: 'system/roles/updateUserRole',
    method: 'put'
  },
  // 删除用户下角色
  deleteRole: {
    url: 'system/roles/role',
    method: 'delete'
  },
  // 获取已赋权户头权限
  getAccount: {
    url: 'system/dataGrant/account',
    method: 'get'
  },
  // 获取未授权户头权限-------------
  getAccountNo: {
    url: 'iaf/basic/accounts/all-accountsByPage',
    method: 'get'
  },
  // 获取已赋权人事范围权限
  getPersonnelGroup: {
    url: 'system/dataGrant/personnelGroup',
    method: 'get'
  },
  // 获取未授权人事范围权限---------
  getPersonnelGroupNo: {
    url: 'common/personnelGroup/unAuthorized',
    method: 'get'
  },
  // 获取已赋权薪资组权限
  getPaygroup: {
    url: 'system/dataGrant/paygroup',
    method: 'get'
  },
  // 获取未授权薪资组权限----------
  getPaygroupNo: {
    url: 'compensation/basic/groups/groupsearchduppage',
    method: 'get'
  },
  // 获取组织权限
  getUnit: {
    url: 'system/dataGrant/unit',
    method: 'get'
  },
  // 获取用户所在组织权限
  getUnitTheUserBelongTo: {
    url: 'system/dataGrant/findHasBelongUnit',
    method: 'get'
  },
  deleteAccount: {
    url: 'system/dataGrant/account',
    method: 'delete'
  },
  deletePaygroup: {
    url: 'system/dataGrant/paygroup',
    method: 'delete'
  },
  deletePersonnelGroup: {
    url: 'system/dataGrant/personnelGroup',
    method: 'delete'
  },
  deleteUnit: {
    url: 'system/dataGrant/unit',
    method: 'delete'
  },
  // 保存角色
  updateUserRole: {
    url: 'system/roles/updateUserRole',
    method: 'put'
  },
  // 除了添加角色外其他统一接口
  saveData: {
    url: 'system/dataGrant',
    method: 'post'
  },
  // 添加角色弹窗表单查询接口
  searchRole: {
    url: 'system/roles/userRole/unAuthorized',
    method: 'get'
  },
  // 保存数据权限
  postDataGrant: {
    url: '/system/dataGrant',
    method: 'post'
  },
  // 获得用户各种授权资源是否全选信息
  getCheck: {
    url: '/system/dataGrant/check/{userId}',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
