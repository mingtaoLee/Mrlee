import request from 'api/index'

export const config = {
  // 获取外部纳税记录列表
  getTaxpayLogList: {
    url: '/pay/external-tax/transfer',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 通过id获取外部纳税信息
  getTaxpayById: {
    url: '/pay/external-tax/transfer/{transferId}/single',
    method: 'get'
  },
  // 更新单条外部纳税信息
  updateTaxpayById: {
    url: '/pay/external-tax/transfer/{transferId}/update',
    method: 'put'
  },
  // 新增外部纳税信息
  addTaxpay: {
    url: '/pay/external-tax/transfer/add',
    method: 'post'
  },
  // 删除外部纳税信息
  delTaxpay: {
    url: '/pay/external-tax/transfer/delete',
    method: 'put'
  },
  // 导出年12w报税表
  exportTaxpayReport: {
    url: '/pay/external-tax/transfer/export/{_year}',
    method: 'get'
  },
  // 导入外部纳税信息
  importTaxpay: {
    url: '/pay/external-tax/transfer/import',
    method: 'post'
  },
  // 通过工号查询详细信息
  getByempoleeCode: {
    url: '/pay/external-tax/transfer/employees/{employeeId}/tax-orgunit',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
