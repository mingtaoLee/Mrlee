
import request from '../../index'
export const config = {
  // 利润分红(半年度)-列表查询
  getSheetList: {
    url: '/compensation/data/ProfitBonus/YearBonus',
    method: 'get'
  },
  // 利润分红(季度)-列表查询
  modifySheet: {
    url: '/compensation/data/ProfitBonus/QuarterBonus',
    method: 'get'
  },
  // 利润分红-小店列表查询
  getSheetById: {
    url: '/compensation/data/ProfitBonus',
    method: 'get'
  },
  // 利润分红-服装小店列表查询
  markAsSolved: {
    url: '/compensation/data/ClothingProfitBonus',
    method: 'get'
  },
  // 利润分红-电商小店列表查询
  addSheet: {
    url: '/compensation/data/ElectricProfitBonus',
    method: 'get'
  },
  // 数据确认
  confirmData: {
    url: '',
    method: 'put'
  },
  // 抽数
  getSyncData: {
    url: '/compensation/data/cloting-wage/sync-data/{checkMonth}',
    method: 'get',
    timeout: 3600000
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
