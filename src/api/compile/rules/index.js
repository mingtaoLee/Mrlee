import request from '../../index.js'

export const config = {
  // 职务相关
  // 验证职务规则名称
  checkPositionRuleName: {
    url: '/sca/titleRule/validateRuleName',
    method: 'get'
  },
  // 获取职务规则列表
  getPosRulesList: {
    url: '/sca/titleRule/list',
    method: 'get'
  },
  // 获取职务编制规则详情
  getPosRuleDetail: {
    url: '/sca/titleRule/{scaRuleId}',
    method: 'get'
  },
    // 职务规则新增
  addPosRule: {
    url: '/sca/titleRule/',
    method: 'post'
  },
    // 职务规则修改
  modifyPosRule: {
    url: '/sca/titleRule',
    method: 'put'
  },
    // 职务规则启用
  enablePosRule: {
    url: '/sca/titleRule/enable',
    method: 'put'
  },
    // 职务规则禁用
  disablePosRule: {
    url: '/sca/titleRule/disable',
    method: 'put'
  },
  // 小店相关
  // 验证职务规则名称
  checkShopRuleName: {
    url: '/sca/storeRule/validateRuleName',
    method: 'get'
  },
  // 获取小店规则列表
  getShopRulesList: {
    url: '/sca/storeRule/list',
    method: 'get'
  },
  // 获取小店编制规则详情
  getShopRuleDetail: {
    url: '/sca/storeRule/{scaRuleId}',
    method: 'get'
  },
    // 小店规则新增
  addShopRule: {
    url: '/sca/storeRule/',
    method: 'post'
  },
    // 小店规则修改
  modifyShopRule: {
    url: '/sca/storeRule/',
    method: 'put'
  },
    // 小店规则启用
  enableShopRule: {
    url: '/sca/storeRule/enable',
    method: 'put'
  },
    // 小店规则禁用
  disableShopRule: {
    url: '/sca/storeRule/disable',
    method: 'put'
  },
  // 其他
  // 获取规则状态字典
  getRulesDict: {
    url: '/system/dicts/RULE_STATUS/items',
    method: 'get'
  },
  // 获取集群字典
  getClusterDict: {
    url: '/system/dicts/CLUSTER_CODE/items',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
