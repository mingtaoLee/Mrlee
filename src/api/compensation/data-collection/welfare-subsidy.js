
import request from '../../index'
export const config = {

  // 列表表头获取
  getAllowancesListTitle: {
    url: '/compensation/data/allowances/list/title',
    method: 'get'
  },
  // 列表查询福利补贴
  getAllowancesList: {
    url: '/compensation/data/allowances/list',
    method: 'get'
  },
  // 福利补贴修改
  modifyAllowances: {
    url: '/compensation/data/allowances/{id}',
    method: 'put'
  },
  // 根据员工id查询福利补贴
  getAllowancesById: {
    url: '/compensation/data/allowances/{id}',
    method: 'get'
  },
  // 福利补贴-批量删除
  delAllowances: {
    url: '/compensation/data/allowances',
    method: 'put'
  },
  // 福利补贴新增
  addAllowances: {
    url: '/compensation/data/allowances',
    method: 'post'
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/allowances/confirm',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
