import request from '../index.js'
export const config = {
  orgType: {
    url: '/org/standard/type',
    method: 'get'
  },
  tableList: {
    url: '/org/standard/{type}/list',
    method: 'get'
  },
  create: {
    url: '/org/standard/creation',
    method: 'post'
  },
  detail: {
    url: '/org/standard/{id}/detail',
    method: 'get'
  },
  category: {
    url: '/org/pos/categorys/avaliable',
    method: 'get'
  },
  containOrg: {
    url: '/org/standard/{id}/orgs',
    method: 'get'
  },
  containJobs: {
    url: '/org/standard/{id}/jobs',
    method: 'get'
  },
  enable: {
    url: '/org/standard/enable',
    method: 'put'
  },
  repealRequest: {
    url: '/org/standard/{id}/repeal',
    method: 'get'
  },
  repeal: {
    url: '/org/standard/repeal',
    method: 'put'
  },
  modifyGet: {
    url: '/org/standard/{id}',
    method: 'get'
  },
  modifyPut: {
    url: '/org/standard/modification',
    method: 'put'
  },
  delete: {
    url: '/org/standard/{id}/delete',
    method: 'delete'
  },
  jobs: {
    url: '/org/pos/standardJobs',
    method: 'get'
  },
  search: {
    url: '/org/standard/list',
    method: 'get'
  },
  kz: {
    url: '/org/itg/kz',
    method: 'get'
  },
  // 标准组织库名称重名校验
  valiLibName: {
    url: '/org/standard/check',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
