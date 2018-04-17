/**
 * Created by Younh on 2017/12/17.
 */

import request from '../../index'
export const config = {
  getOkrAssessmentBonusPackage: {
    url: '/compensation/data/three-clusters/okr-assessment-bonus-package/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },

  // 数据确认
  confirmData: {
    url: '/compensation/data/okr-assessment-bonus-package/validaty-data',
    method: 'put'
  },
  getBusinessTypeId: {
    url: '/compensation/data/okr-assessment-bonus-package/businessType',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
