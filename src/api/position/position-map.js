import request from '../index.js'
// 开发阶段使用代理，上线就把/api删掉
export const config = {
  // 根据组织ID获取职位信息
  getPositionInfo: {
    url: '/org/pos/positions',
    method: 'get'
  },
  // 获取标准职位图谱树
  getJobFamilysTree: {
    url: '/org/pos/jobFamilys',
    method: 'get'
  },
  // 根据职位id获取职位图谱信息
  getPositionAtlas: {
    url: '/org/pos/positionAtlas/{posPositionId}',
    method: 'get'
  },
  // 根据职位id获取全部人员信息
  getPositionAllEmploee: {
    url: '/org/pos/positions/{posPositionId}/employees',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
