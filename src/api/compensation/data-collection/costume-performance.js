/**
 * Created by GENGTP on 2017-11-29.
 * 数据收集
 */
import request from '../../index'
export const config = {

  /** 服装绩效页面 */

  // 服装绩效列表获取
  getCostumes: {
    url: '/compensation/data/costumes',
    method: 'get'
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
