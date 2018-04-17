
import request from '../../index'
export const config = {
  // 二集群数据分红明细查询
  postTwoClusters: {
    url: '/compensation/data/profit-bonus/two-clusters/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // putValidatyData: {
  //   url: '/compensation/data/profit-bonus/two-clusters/validaty-data',
  //   method: 'put'
  // },
  // 数据确认
  confirmData: {
    url: '/compensation/data/profit-bonus/two-clusters/validaty-data',
    method: 'put'
  },
  // 抽数
  getTwoClustersSyncData: {
    url: '/compensation/data/profit-bonus/two-level/sync-data/{checkMonth}',
    method: 'get',
    timeout: 3600000
  }
  // // 下拉职务接口
  // getPosTitleIdList: {
  //   url: '/compensation/data/profit-bonus/areas/posTitle',
  //   method: 'get'
  // }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
