import request from '../index.js'
export const config = {
  // 获取角色列表
  getRoleList: {
    url: '/system/roles/page',
    method: 'get'
  },
  getRoleAll: {
    url: '/system/roles/list',
    method: 'get'
  },
  // 新增用户
  createRole: {
    url: '/system/roles',
    method: 'post'
  },
  // 批量删除
  deleteDeleteRoles: {
    url: '/system/roles/ids',
    method: 'delete'
  },
  // 删除
  postDeleteRole: {
    url: '/system/roles/deleteRole',
    method: 'post'
  },
  // 修改
  putEditRole: {
    url: '/system/roles',
    method: 'put'
  },
  // 保存权限
  postSaveRoleResource: {
    url: '/system/roles/saveRoleResource',
    method: 'post'
  },
  // 获取权限
  getRoleResource: {
    url: '/system/roles/resource/',
    method: 'get'
  },
  // 获取某人的权限
  getJurisdictionOne: {
    url: '/system/roles/findUserResource',
    method: 'get'
  },
  // 提交权限配置数据
  postJurisdictionSetting: {
    url: '/system/roles/roleMenuUrlPower',
    method: 'post'
  },
  // 根据id查找角色
  findUserRole: {
    url: '/system/roles/findUserRole',
    method: 'get'
  },
  // 获取户头下拉菜单数据
  getAccountLit: {
    url: '/iaf/basic/accounts/all-accounts',
    method: 'get'
  },
  // 分页查询角色下用户接口
  getRoleUser: {
    url: '/system/roles/pageQueryRoleUser',
    method: 'get'
  },
  // 查找角色下未授权用户
  getUnAuthorizedUser: {
    url: '/system/roles/roleUser/unAuthorized',
    method: 'get'
  },
  postRoleUser: {
    url: '/system/roles/updateRoleUser',
    method: 'post'
  },
  deleteRoleUser: {
    url: '/system/roles/user',
    method: 'delete'
  },
  // 获取角色赋权tab页数据
  getJurisdictionTabs: {
    url: 'system/roles/listTopMenu',
    method: 'get'
  },
  // 获取tab页每项对应树结构数据
  getTabTreeData: {
    url: 'system/roles/findMenuAndUrlByRoleId',
    method: 'get'
  },
  // 提交权限
  submitJurisdictionList: {
    url: '/system/roles/roleMenuUrlPower',
    method: 'post'
  }

}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
