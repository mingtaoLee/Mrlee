import request from 'api/index.js'

export const config = {
  // 获取标准小店列表
  getShopList: {
    url: '/org/standard/shop',
    method: 'get'
  },
  // 获取职位列表
  getTitleList: {
    url: '/org/pos/titles/available',
    method: 'get'
  },
  // 获取组织类型（平台，小店, 合并小店）
  getOrgType: {
    url: '/sca/report/orgType/{orgUnitId}',
    method: 'get'
  },
  // 查看任意时间点编制
  getViewReport: {
    url: '/sca/report',
    method: 'get'
  },
  // 获取初始化的职务规则（供编制调整）
  getDutyRule: {
    url: '/sca/titleRule/initSca',
    method: 'get'
  },
  // 根据组织编码判断该组织是否小店（包括合并小店）
  getJudgeStore: {
    url: '/sca/report/checkStore/{orgUnitId}',
    method: 'get'
  },
  // 获取所有编制维护的列表
  getMaintainList: {
    url: '/sca/report/title',
    method: 'get'
  },
  // 职位的表单页面，根据职位id获取获取汇报职位
  getReportJob: {
    url: '/org/pos/positions/{orgUnitId}/available',
    method: 'get'
  },
  // 获取职务编制的列表
  getJobList: {
    url: '/sca/report/{scaTitleId}/title',
    method: 'get'
  },
  // 判断是小店or平台的接口
  selectOrgUnit: {
    url: '/sca/report/checkStore/{orgUnitId}',
    method: 'get'
  },
  // 获取职务历史编制的列表
  getHistoryList: {
    url: '/sca/report/history',
    method: 'get'
  },
  // 获取组织编制情况的列表
  getOrgList: {
    url: '/sca/report/org',
    method: 'get'
  },
  // 组织编制情况的---合计人数
  getTotalPerson: {
    url: '/sca/report/{orgUnitId}/scaleNum',
    method: 'get'
  },
  // 刷新状态接口
  updateState: {
    url: '/sca/report/updateScaleNum',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
