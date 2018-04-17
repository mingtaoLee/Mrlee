
import request from '../../index'
export const config = {

  /** 物流绩效页面 */

  // 物流绩效列表查询
  getLogisticsList: {
    url: '/compensation/data/logistics',
    method: 'get'
  },
  // 物流绩效修改
  modifyLogistics: {
    url: '/compensation/data/logistics/{id}',
    method: 'put'
  },
  // 物流绩效查询
  getLogisticsById: {
    url: '/compensation/data/logistics/{id}',
    method: 'get'
  },
  // 物流绩效删除
  delLogistics: {
    url: '/compensation/data/logistics',
    method: 'put'
  },
  // 物流绩效新增
  addLogistics: {
    url: '/compensation/data/logistics',
    method: 'post'
  },
  // 数据确认
  confirmData: {
    url: '',
    method: 'put'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
