
import request from '../../index'
export const config = {
  // 门店销售额查询明细
  getSellsList: {
    url: '/compensation/data/sells',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 抽数
  getSellsData: {
    url: '/compensation/data/sells/{checkMonth}',
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
