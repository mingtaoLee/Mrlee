import request from '../index.js'

export const config = {
  // 获取编制计划列表，搜索共用
  getPlanList: {
    url: '/org/sca/plans',
    method: 'get'
  },
  // 删除编制计划
  deletePlan: {
    url: '/org/sca/plans',
    method: 'delete'
  },
  // 发布编制计划
  publishPlan: {
    url: 'org/sca/plans/{scaPlanId}/issue',
    method: 'put'
  },
  // 结束编制计划
  endPlan: {
    url: 'org/sca/plans/{scaPlanId}/end',
    method: 'put'
  },
  // 根据编制计划id获取详情
  getPlanDetail: {
    url: '/org/sca/plans/{scaPlanId}/details',
    method: 'get'
  },
  // 修改编制计划
  motifyPlan: {
    url: '/org/sca/plans',
    method: 'put'
  },
  // 编制计划新建
  newPlan: {
    url: '/org/sca/plans',
    method: 'post'
  },
  // 校验编制计划名称唯一性
  checkName: {
    url: '/org/sca/plans/validateName',
    method: 'get'
  },
  // 根据编制计划id获取编制填报列表表头信息
  getTableHeadByPlanId: {
    url: 'org/sca/mods/tableTitles',
    mehotd: 'get'
  },
  // 根据计划id获取编制填报列表（搜索公用）
  getPlanTableById: {
    url: '/org/sca/manage',
    method: 'get'
  },
  // 获取组织人效情况
  getPeopleEffDetails: {
    url: '/org/sca/manage/{orgUnitId}/peopleEffDetails',
    method: 'get'
  },
  // 查看新店人效
  getNewShopPeopleEffect: {
    url: '/org/sca/manage/newPeopleEffDetails',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
