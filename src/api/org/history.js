import request from '../index.js'
export const config = {
  root: {
    url: '/org/history/root',
    method: 'get'
  },
  search: {
    url: '/org/history/{name}/like',
    method: 'get'
  },
  detail: {
    url: '/org/history/{id}/detail',
    method: 'get'
  },
  children: {
    url: '/org/history/{id}/children',
    method: 'get'
  },
  pos: {
    url: '/org/history/{id}/pos',
    method: 'get'
  },
  emp: {
    url: '/org/history/{id}/emp',
    methods: 'get'
  },
  history: {
    url: '/org/history/{id}/history',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
