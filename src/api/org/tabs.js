import request from '../index.js'
export const config = {
  detail: {
    url: '/org/orgs/{id}/detail/echo'
  },
  // 片区字段
  getAreaField: {
    url: '/org/public/areas/{code}/code',
    method: 'get'
  },
  pos: {
    url: '/org/pos/positions/org/positions',
    method: 'get'
  },
  emp: {
    url: '/org/orgs/employees',
    method: 'get'
  },
  historyDetail: {
    url: '/org/history/{id}/detail',
    method: 'get'
  },
  historyPos: {
    url: '/org/history/{id}/pos',
    method: 'get'
  },
  historyEmp: {
    url: '/org/history/{id}/emp',
    method: 'get'
  },
  history: {
    url: '/org/history/{id}/history',
    method: 'get'
  },
  searchEmp: {
    url: '/org/orgs/employees',
    method: 'get'
  },
  // 查看组织历史员工数量
  getEmpHisCount: {
    url: '/org/history/{id}/emp/count',
    method: 'get'
  },
  // 查看组织的员工数量
  getEmpCount: {
    url: '/org/orgs/{orgUnitId}/employees/count',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
