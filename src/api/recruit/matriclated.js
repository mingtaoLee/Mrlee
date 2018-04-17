import request from '../index.js'

export const config = {
  // 录用管理的列表
  matriculatedList: {
    url: '/recruit/interviews/hire',
    method: 'get'
  },
  // 登记入职
  entryRegister: {
    url: '/recruit/interviews/{interviewId}/hire/register',
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  },
  // 查看录用详情
  enrollDetail: {
    url: '/recruit/interviews/{interviewId}/hireProcess',
    method: 'get'
  },
  // 待入职人员信息
  hireDetail: {
    url: '/recruit/interviews/{interviewId}/hire',
    method: 'get'
  },

  // 待录用人员的信息
  waitHireEmp: {
    url: '/recruit/interviewees/hire',
    method: 'get'
  },
  // 合规检查
  backgroundCheck: {
    url: '/recruit/interviews/{interviewId}/background',
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  },
   // 根据组织ID获取该组织下的职位
  getPosList: {
    url: '/org/pos/positions/emp/{orgUnitId}/posList',
    method: 'get'
  },
  // 根据组织ID获取人事范围，组织名字，公司名字
  getArea: {
    url: '/org/orgs/{id}/personnel/area',
    method: 'get'
  },
  // 根据部门id取部门名字&信息
  getOrgUnitName: {
    url: '/org/orgs/organizations',
    method: 'get'
  },
  // 查看组织的员工数量
  getEmpCount: {
    url: '/org/orgs/{orgUnitId}/employees/count',
    method: 'get'
  },
  // 获取公司名称
  getCompanyName: {
    url: '/recruit/company',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}

