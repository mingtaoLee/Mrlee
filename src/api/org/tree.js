import request from '../index.js'
export const config = {
  // 组织维护树根节点
  root: {
    url: '/org/orgs/root'
  },
  roots: {
    url: '/org/orgs/roots'
  },
  hisRoot: {
    url: '/org/history/root',
    method: 'get'
  },
  hisRoots: {
    url: '/org/history/roots'
  },
  // 组织维护树子节点
  children: {
    url: 'org/orgs/{id}/children'
  },
  hisChildren: {
    url: '/org/history/{id}/children',
    method: 'get'
  },
  // 组织维护树节点查找
  searchData: {
    url: '/org/orgs/{name}/like'
  },
  hisSearch: {
    url: '/org/history/{name}/like',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = false) {
  return request(config, funcName, data, isToken, isCancel)
}
