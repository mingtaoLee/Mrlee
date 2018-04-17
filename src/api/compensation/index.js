/**
 * Created by GENGTP on 2017-12-6.
 * 薪酬公用api
 */

import request from '../index'
export const config = {

  // 工资套远程搜索
  getComponentListName: {
    url: '/compensation/basic/groups/search',
    method: 'get'
  },
  // 查询有权限控制的薪资组
  getGroups: {
    url: '/compensation/basic/groups/groupsearch',
    method: 'get'
  },
  // 没有权限控制的薪资组
  getAllGroups: {
    url: '/compensation/basic/groups/groupsearchdup',
    method: 'get'
  },
  // 获取存在的薪资项目
  getComponentNameList: {
    url: '/compensation/basic/pay-components/search',
    method: 'get'
  },
  // 查询户头
  getAccounts: {
    url: '/compensation/basic/accounts/all-accounts',
    method: 'get'
  },
  // 获取银行报盘模板
  getBankTemplates: {
    url: '/compensation/basic/bankTemplates/areaIdBankName',
    method: 'get'
  },
  // 获取公司及公司代码
  getCompanies: {
    url: '/common/company',
    method: 'get'
  },
  // 获取人事范围列表
  getPersonnelGroups: {
    url: '/common/personnelGroup/usable',
    method: 'get'
  },
  // 获取工资项
  getSalaryItem: {
    url: '/compensation/basic/pay-components/search',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
