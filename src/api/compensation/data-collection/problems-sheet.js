
import request from '../../index'
export const config = {

  /** 问题描述单页面 */

  // 列表查询问题描述单
  getSheetList: {
    url: '/compensation/data/costumes/questions',
    method: 'get'
  },
  // 问题描述单的修改
  modifySheet: {
    url: '/compensation/data/costumes/questions/{id}',
    method: 'put'
  },
  // 问题描述单查询
  getSheetById: {
    url: '/compensation/data/costumes/questions/{id}',
    method: 'get'
  },
  // 问题描述单处理标记状态
  markAsSolved: {
    url: '/compensation/data/costumes/questions',
    method: 'put'
  },
  // 问题描述单提交
  addSheet: {
    url: '/compensation/data/costumes/questions',
    method: 'post'
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/costumes/questions/updateConfirmStatus',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
