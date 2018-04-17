/**
 * Created by Younh on 2017/12/17.
 */

import request from '../../index'
export const config = {
  getOkrPersonalDetails: {
    url: '/compensation/data/three-clusters/okr-personal-details/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 数据确认
  confirmData: {
    url: '/compensation/data/okr-personal-details/validaty-data',
    method: 'put'
  },
  // 职务
  getPosTitleIdList: {
    url: '/compensation/data/three-clusters/posTitle',
    method: 'get'
  }
  // 职位
  // getPositionList: {
  //   url: '/compensation/data/three-clusters/posPosition',
  //   method: 'get'
  // }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
