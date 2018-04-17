import request from '../index.js'

export const config = {
  // 详细说明一下接口作用
  example: {
    url: '/example',
    method: 'get'
  },
  // 获取品类列表
  getCategoryList: {
    url: '/org/pos/categorys/avaliable',
    method: 'get'
  },
  // 获取可用的编制模板下拉列表
  getAvailableMods: {
    url: '/org/sca/mods/available',
    method: 'get'
  },
  // 根据模板ID获得可用组织
  getOrgs: {
    url: '/org/sca/mods/{scaModMasterId}/org',
    method: 'get'
  },
  // 获取标准小店列表
  getShopList: {
    url: '/org/standard/shop',
    method: 'get'
  },
  // 获取职位列表
  getTitleList: {
    url: '/org/pos/titles/available',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
