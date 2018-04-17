import request from '../index.js'
export const config = {
    // 获取菜单列表
  getMenusList: {
    url: '/system/menus/list',
    method: 'get'
  },
  // 编辑修改菜单
  putMenu: {
    url: '/system/menus/menu',
    method: 'put'
  },

  // 创建菜单
  postCreateMenu: {
    url: '/system/menus/menu',
    method: 'post'
  },
  // 新增菜单列表
  createMenu: {
    url: '/system/menus/createMenu',
    method: 'post'
  },
  // 修改菜单
  updateMenu: {
    url: '/system/menus/updateMenu',
    method: 'put'
  },
  // 删除菜单
  deleteMenu: {
    url: '/system/menus/menu',
    method: 'delete'
  },
  // 请求报表菜单数据
  getReportsMenu: {
    url: '/system/menus/reports',
    method: 'get'
  },
  // 图片地址
  getPic: {
    url: 'system/attachments/image/{imageId}',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
