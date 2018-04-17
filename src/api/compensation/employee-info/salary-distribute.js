/**
 * Created by ZHANZF on 2017-11-24.
 * 员工信息设置
 */
import request from '../../index'
export const config = {

  /** 员工薪资组分配页面 */

  // 获取员工薪资组分配列表
  getSalaryGroupEmpList: {
    url: '/compensation/employee/group/pay',
    method: 'get'
  },
  getSalaryGroupEmp: {
    url: '/compensation/employee/pay/amount/{componentListId}',
    method: 'get'
  },
  // 获取薪资组待调入人员列表
  getTransferinEmps: {
    url: '/compensation/employee/group/pay/transferin',
    method: 'get'
  },
  // 调入已选人员
  putTransferinEmps: {
    url: '/compensation/employee/group/pay/transferin',
    method: 'put'
  },
  // 调入全部人员
  putAllTransferinEmps: {
    url: '/compensation/employee/group/pay/transferin/all',
    method: 'put'
  },
  // 调出已选人员
  postBringUpEmps: {
    url: '/compensation/employee/group/pay/transferout',
    method: 'post'
  },
  // 分配其他薪资组
  putEmpsSalaryGroup: {
    url: '/compensation/employee/group/pay/otherSalary',
    method: 'put'
  },
  // 注销员工薪资组
  logoutEmpsSalaryGroup: {
    url: '/compensation/employee/group/pay/logout',
    method: 'put'
  },
  // 已调出人员列表
  getTuneOutEmps: {
    url: '/compensation/employee/group/pay/pertran',
    method: 'get'
  },
  // 未分配薪资组人员列表
  getUndistributedEmps: {
    url: '/compensation/employee/group/pay/unallocate',
    method: 'get'
  },
  // 未分配薪资组人员分配薪资组
  postUndistributedEmpsGroup: {
    url: '/compensation/employee/group/pay/allocate',
    method: 'post'
  },
  // 薪资组分配历史记录
  getHistoryDistributeGroups: {
    url: '/compensation/employee/group/pay/historical',
    method: 'get'
  },
  // 根据empgroupId获取修改薪资组
  getEmpgroupItem: {
    url: '/compensation/employee/group/pay/{empgroupId}',
    method: 'get'
  },
  // 修改薪资组
  putEmpgroupItem: {
    url: '/compensation/employee/group/pay/updatePaycompany',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
