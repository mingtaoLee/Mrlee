// 外部数据
import request from '../index.js'
export const config = {
  // 查询商业订单记录
  findLikeInsCommercialPolicy: {
    url: '/iaf/policy/findLikeInsCommercialPolicy',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 添加商业险订单记录
  addInsCommercialPolicy: {
    url: '/iaf/policy/addInsCommercialPolicy',
    method: 'post'
  },
  // 更新商业险订单记录
  updateInsCommercialPolicy: {
    url: '/iaf/policy/updateInsCommercialPolicy',
    method: 'post'
  },
  // // 根据人事范围名称获取人事范围代码
  // findPersonnelGroupCode: {
  //   url: '/iaf/policy/findPersonnelGroupCode',
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  // },
  // 根据人事范围名称获取人事范围代码
  findPersonnelGroupCode: {
    url: '/iaf/basic/personnel-accounts/listsGrant',
    method: 'get'
  },
  // 删除商业险订单记录
  deleteInsCommercialPolicy: {
    url: '/iaf/policy/deleteInsCommercialPolicy',
    method: 'post'
  },
  // 批量删除商业险订单记录
  multipleDeleteCommercialPolicy: {
    url: '/iaf/policy/batchDeleteInsCommercialPolicy',
    method: 'post'
  },
  // 根据保单号带出相应信息
  takeInfo: {
    url: '/iaf/policy/findIafInsCommercialPolicy',
    method: 'post'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
