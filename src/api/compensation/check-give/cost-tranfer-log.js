import request from 'api/index'

export const config = {
  // 获取费用划拨记录列表
  getCostTranferLog: {
    url: '/pay/cost/transfer',
    method: 'get'
  },
  // 保存新的划拨信息
  postCostTranferLog: {
    url: '/pay/cost/transfer/add',
    method: 'post'
  },
  // 删除费用划拨信息
  delCostTranferLog: {
    url: '/pay/cost/transfer/delete',
    method: 'put'
  },
  // 通过id查询单条信息
  getByIdCostTranfer: {
    url: '/pay/cost/transfer/{transferId}',
    method: 'get'
  },
  // 保存存在id的划拨信息
  updateByIdCostTranfer: {
    url: '/pay/cost/transfer/update',
    method: 'put'
  },
  // 新增费用划拨页面-根据工号查询员工相关信息
  getByemployeeId: {
    url: '/pay/cost/transfer/query-for-create/employees/{employeeId}/emp-info',
    method: 'get'
  },
  // 新增费用划拨页面-根据划入单位id查询划入成本中心
  getByIdOrgId: {
    url: '/pay/cost/transfer/query-for-create/units/{unitId}/out-cost-info',
    method: 'get'
  },
  // 导入费用划拨信息
  importData: {
    url: '/pay/cost/transfer/import',
    method: 'post'
  },
  // 获取内部订单
  getOrderTable: {
    url: '/pay/cost/transfer/query-for-get/internalOrderNo',
    method: 'get'
  },
  // 分摊金额计算
  postCalculate: {
    url: '/pay/cost/transfer/calculate',
    method: 'post'
  },
  // 获取校验费用分摊天数
  getTransferDays: {
    url: '/pay/cost/transfer/query-for-create/employees/emp-month',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
