import request from '../index.js'
export const config = {
  add: {
    url: '/org/combine/shop/combineInfo',
    method: 'post'
  },
  addReq: {
    url: '/org/combine/shop/{orgShopId}/stores',
    method: 'get'
  },
  querySearch: {
    url: '/org/combine/shopUnitList',
    method: 'get'
  },
  edit: {
    url: '/org/combine/shop/{orgShopId}/combineInfo',
    method: 'get'
  },
  editPut: {
    // url: '/org/combine/shop/{orgShopId}/combineInfo',
    url: '/org/combine/shop/{orgShopId}/{orgCombineShopId}/combineInfo',
    method: 'put'
  },
  end: {
    url: '/org/combine/shop/{orgShopId}/uneffectiveDate',
    method: 'put'
  },
  shops: {
    url: '/org/combine/shops',
    method: 'get'
  },
  stores: {
    url: '/org/combine/stores',
    method: 'get'
  },
  orgStandard: {
    url: '/org/combine/orgStandard',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
