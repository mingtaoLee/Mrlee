import request from 'api/index.js'

export const config = {
  // 获取字段集列表
  getFieldList: {
    url: '/msg/infSet/column',
    method: 'get'
  },
  // 获取字段名称列表
  getFieldNameList: {
    url: '/msg/infSet/{tableName}/columns',
    method: 'get'
  },
  // 获取url列表
  getFieldUrlList: {
    url: '/msg/infSet/url',
    method: 'get'
  },
  // 获取字典编码列表
  getDictCodeList: {
    url: '/msg/infSet/dicts',
    method: 'get'
  },
  // 新增字段
  addField: {
    url: '/msg/infSet/column',
    method: 'post'
  },
  // 修改字段
  modifyField: {
    url: '/msg/infSet/column',
    method: 'put'
  },
  // 启用字段
  enableField: {
    url: '/msg/infSet/column/enable',
    method: 'put'
  },
  // 禁用字段
  disableField: {
    url: '/msg/infSet/column/disable',
    method: 'put'
  },
  // 删除字段
  deleteField: {
    url: '/msg/infSet/column',
    method: 'delete'
  },
  // 验证字段名称
  validateColumnName: {
    url: '/msg/infSet/validateColumnName',
    method: 'get'
  },
  // 验证字段编码
  validateFieldName: {
    url: '/msg/infSet/validateColumnFieldName',
    method: 'get'
  },
  // 删除字段时的校验
  validateDeleteColumn: {
    url: '/msg/infSet/checkDeleteColumn',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
