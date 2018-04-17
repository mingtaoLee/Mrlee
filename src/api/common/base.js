import request from '../index'

export const config = {
  // 获取所有的地区信息
  allAreas: {
    url: '/org/public/areas/plain/admin'
  },
  // 获取所有永辉区域信息
  allYongHuiAreas: {
    url: '/org/public/areas/all/plain'
  },
  // 获取省份
  provinces: {
    url: '/public-access/areas/province'
  },
  // 下级地区
  childArea: {
    url: '/public-access/areas/{code}/code/child'
  },
  // 地区详细信息
  areaInfo: {
    url: '/public-access/areas/{code}/code'
  },
  areas: {
    url: '/org/orgs/areas/{codes}/codes'
  }
}

export default function req (funcName, data, isToken = true, isCancel = false) {
  return request(config, funcName, data, isToken, isCancel)
}
