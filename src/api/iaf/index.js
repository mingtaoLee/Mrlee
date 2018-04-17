/**
 * Created by GENGTP on 2017-12-6.
 * 薪酬公用api
 */

import request from '../index'
export const config = {

  // 工资套远程搜索
  getComponentListName: {
    url: '/iaf/basic/groups/search',
    method: 'get'
  },
  // 查询有权限控制的薪资组
  getGroups: {
    url: '/iaf/basic/groups/groupsearch',
    method: 'get'
  },
  // 没有权限控制的薪资组
  getAllGroups: {
    url: '/iaf/basic/groups/groupsearchdup',
    method: 'get'
  },
  // 获取存在的薪资项目
  getComponentNameList: {
    url: '/iaf/basic/pay-components/search',
    method: 'get'
  },
  // 查询户头
  getAccounts: {
    url: '/iaf/basic/accounts/all-accounts',
    method: 'get'
  },
  // 获取银行报盘模板
  getBankTemplates: {
    url: '/iaf/basic/bankTemplates/areaIdBankName',
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
  // 户头设置通过公司代码获取公司名称
  getCompanyName: {
    url: '/iaf/public/insured/companyNameBycompanyCode',
    method: 'get'
  },
  // 户头设置通过公司名称获取公司代码
  getCompanyCode: {
    url: '/iaf/public/insured/companyCodeBycompanyName',
    method: 'get'
  },
  // 户头险种及户头代码带出信息
  getOhterInfo: {
    url: '/iaf/basic/personnel-accounts/getSecurityNumber',
    method: 'get'
  },
  // 户头险种及户头代码带出信息
  getDictData: {
    url: '/public-access/dicts/{dict}/items',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
