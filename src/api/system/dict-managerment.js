import request from '../index.js'
export const config = {
    // 获取字典列表
  getDictList: {
    url: '/system/dicts/list',
    method: 'get'
  },
//   查询字典
  getDictOne: {
    url: '/system/dicts/find',
    method: 'get'
  },
// 新增字典
  createDict: {
    url: '/system/dicts/createDict',
    method: 'post'
  },
//   编辑字典
  updateDict: {
    url: '/system/dicts/updateDict',
    method: 'post'
  },
//   删除字典
  deleteDict: {
    url: '/system/dicts/deleteDict',
    method: 'delete'
  },
  // 刷新缓存
  updateCache: {
    url: 'system/dicts/deleteDictCache',
    method: 'delete'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
