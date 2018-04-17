import request from '../index.js'
export const config = {
  // 月份的查询
  findIafInformations: {
    url: '/self/common/findIafInformations',
    method: 'get'
  },
  // 商业险
  findCommercialRecordByEmployeeId: {
    url: '/self/common/findCommercialRecordByEmployeeId',
    method: 'get'
  },
  // 参保地
  findInsuredLand: {
    url: '/self/common/findInsuredLand',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
