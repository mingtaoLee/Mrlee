import request from '../index.js'
export const config = {
    // 获取参数列表
  getParamsList: {
    url: '/system/param/config',
    method: 'get'
  },
// 新增用户
  createParams: {
    url: '/system/param/config',
    method: 'post'
  },
  // 新增用户
  deleteParams: {
    url: '/system/param/config',
    method: 'delete'
  },
//   编辑用户
  updateUser: {
    url: '/system/param/config',
    method: 'put'
  },
//   根据id查找用户
  findUser: {
    url: '/system/users/findUserByLoginId',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
