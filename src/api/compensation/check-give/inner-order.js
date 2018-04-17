import request from 'api/index'

export const config = {
  // 获取内部订单记录列表
  getPayCostAufn: {
    url: '/pay/cost/aufn',
    method: 'get'
  },
  // 保存新的划内部订单信息
  postCostTranferLog: {
    url: '/pay/cost/aufn/add',
    method: 'post'
  },
  // 删除内部订单
  delCostTranferLog: {
    url: '/pay/cost/aufn',
    method: 'put'
  },
  // 修改内部订单，通过id查询成本相关信息
  getByIdCostTranfer: {
    url: '/pay/cost/aufn/{costAufnId}',
    method: 'get'
  },
  // 根据id保存修改的内部订单
  updateByIdCostTranfer: {
    url: '/pay/cost/aufn/update',
    method: 'put'
  },
  // 新增内部订单-根据工号查询员工相关信息
  getByemployeeId: {
    url: '/pay/cost/aufn/employees/{employeeId}',
    method: 'get'
  },
  // 导入费用划拨信息
  importData: {
    url: '/pay/cost/transfer/import',
    method: 'post'
  },
  // 获取内部订单
  getOrderTable: {
    url: 'pay/cost/aufn/internalAufn',
    method: 'get'
  },
  // 新增费用划拨页面-根据划入单位id查询划入成本中心
  getByIdOrgId: {
    url: '/pay/cost/transfer/query-for-create/units/{unitId}/out-cost-info',
    method: 'get'
  },
  // 根据员工id和划拨月份查询工资费用合计（Get）：
  getSalaryCount: {
    url: '/pay/cost/aufn/employees/{employeeId}/{month}',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
