
import request from '../../index'
export const config = {

  /** 物流绩效页面 */

  // 短期激励信息列表查询
  getBestirsList: {
    url: '/compensation/data/bestirs/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 短期激励数据更改
  modifyBestirs: {
    url: '/compensation/data/bestirs/{id}',
    method: 'put'
  },
  // 短期激励查询-id查询
  getBestirsById: {
    url: '/compensation/data/bestirs/{id}',
    method: 'get'
  },
  // 短期激励信息批量删除
  delBestirs: {
    url: '/compensation/data/bestirs',
    method: 'put'
  },
  // 短期激励数据新增
  addBestirs: {
    url: '/compensation/data/bestirs/insert',
    method: 'post'
  },
  // 选择人员带出人事范围
  getGroup: {
    url: '/compensation/data/bestirs/getGroup',
    method: 'get'
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/bestirs/updateConfirmStatus',
    method: 'put'
  }
  // 金额查询接口
  // getPlanName: {
  //   url: '/compensation/data/bestirs/getPlanName',
  //   method: 'get'
  // }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
