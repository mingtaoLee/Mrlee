import request from 'api/index.js'

export const config = {
  // 获取信息集列表
  getInfoList: {
    url: '/msg/infSet',
    method: 'get'
  },
  // 获取表名列表
  getTableNameList: {
    url: '/msg/infSet/tables',
    method: 'get'
  },
  // 新增信息集
  addInfo: {
    url: '/msg/infSet',
    method: 'post'
  },
  // 删除信息集
  deleteInfo: {
    url: '/msg/infSet',
    method: 'delete'
  },
  // 删除信息集校验
  validateDeleteInfo: {
    url: '/msg/infSet/checkDeleteInfSet',
    methods: 'get'
  },
  // 修改信息集
  modifyInfo: {
    url: '/msg/infSet',
    method: 'put'
  },
  // 查看信息集
  checkInfo: {
    url: '/msg/infSet/{infTableId}',
    method: 'get'
  },
  // 启用信息集
  enableInfo: {
    url: '/msg/infSet/enable',
    method: 'put'
  },
  // 禁用信息集
  disableInfo: {
    url: '/msg/infSet/disable',
    method: 'put'
  },
  // 验证信息集表名唯一性
  validateTableName: {
    url: '/msg/infSet/validateTableName',
    method: 'get'
  },
  // 验证信息集名称
  validateInfoName: {
    url: '/msg/infSet/validateInfName',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
