import request from '../index.js'

export const config = {
  // 获取编制模板列表，搜索公用
  getTempList: {
    url: '/org/sca/mods',
    method: 'get'
  },
  // 删除模板，传入模板id数组
  deleteTemp: {
    url: '/org/sca/mods',
    method: 'delete'
  },
  // 获取某个模板的详细数据
  getDetailById: {
    url: '/org/sca/mods/{scaModMasterId}',
    method: 'get'
  },
  // 启用模板
  startTemp: {
    url: '/org/sca/mods/{scaModMasterId}/enable',
    method: 'put'
  },
  // 停用模板
  stopTemp: {
    url: '/org/sca/mods/{scaModMasterId}/disable',
    method: 'put'
  },
  // 模板新建
  newTemplate: {
    url: '/org/sca/mods',
    method: 'post'
  },
  // 模板修改
  motifyTemplate: {
    url: '/org/sca/mods',
    method: 'put'
  },
  // 根据模板id获取模板明细信息
  getModsInfo: {
    url: '/org/sca/mods/{scaModMasterId}',
    method: 'get'
  },
  // 根据适用范围获取可用职务列表
  getTitles: {
    url: '/org/sca/mods/titles/available',
    method: 'get'
  },
  // 根据适用范围获取可用职位列表
  getPositions: {
    url: '/org/sca/mods/positions/available',
    method: 'get'
  },
  // 根据适用范围获取可用标准职位列表
  getStdJobs: {
    url: '/org/sca/mods/stdJobs/available',
    method: 'get'
  },
  // 模板名称可用性校验
  checkName: {
    url: '/org/sca/mods/validateName',
    method: 'get'
  },
  // 判断是否为永辉模板
  checkIsYongHui: {
    url: '/org/sca/mods/suites/using',
    method: 'get'
  },
  // 是否有建议数
  checkHasSuggest: {
    url: '/org/sca/mods/isExistProposal',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
