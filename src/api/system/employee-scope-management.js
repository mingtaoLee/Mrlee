import request from '../index.js'
export const config = {
  // 获取列表
  getEmployeeScopeManagementList: {
    url: '/common/personnelGroup',
    method: 'get'
  },
  // 获取公司列表’
  getCompanyList: {
    url: '/common/company',
    method: 'get'
  },
  // 获取单个人事范围
  getEmployeeScope: {
    url: '/common/personnelGroup/{personnelGroupCode}',
    method: 'get'
  },
  // 新增
  createEmployeeScope: {
    url: '/common/personnelGroup',
    method: 'post'
  },
  // 修改
  updateEmployeeScope: {
    url: '/common/personnelGroup',
    method: 'put'
  },
  // 删除
  delEmployeeScope: {
    url: '/common/personnelGroup/{personnelGroupCode}',
    method: 'delete'
  },
  // 失效
  loseEfficacy: {
    url: '/common/personnelGroup/disable/{personnelGroupCode}',
    method: 'put'
  }

}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
