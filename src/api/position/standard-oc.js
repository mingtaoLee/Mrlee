import request from '../index.js'

export const config = {
  // 在标准职位设置页中，获取某个节点下的所有标准职位
  getStandardJobDetails: {
    url: '/org/pos/standardJobs',
    method: 'get'
  },
  // 根据某个树节点获取所有标准职位的详细信息
  getJobDetailsById: {
    url: '/org/pos/standardJobs/{posStandardJobId}',
    method: 'get'
  },
  // 获取某个标准职位下有多少职位和员工
  getPeopleDetails: {
    url: '/org/pos/standardJobs/{posStandardJobId}/posAndEmpNum',
    method: 'get'
  },
  // 校验标准职位名称的唯一性
  checkStandardJobName: {
    url: '/org/pos/standardJobs/validation',
    method: 'get'
  },
  // 获取职务列表
  getTitleList: {
    url: '/org/pos/titles/available',
    method: 'get'
  },
  // 获取标准职位下的职位列表
  getPosition: {
    url: '/org/pos/positions/{posStandardJobId}/positions',
    method: 'get'
  },
  // 获取标准职位下的员工列表
  getEmployee: {
    url: '/org/pos/positions/{posStandardJobId}/stdJobEmps',
    method: 'get'
  },
  // 验证是否能删除标准职位
  checkDeleteStandardJob: {
    url: '/org/pos/standardJobs/deletion/checkDelete',
    method: 'get'
  },
  // 删除标准职位
  deleteStandardJob: {
    url: '/org/pos/standardJobs/deletion',
    method: 'delete'
  },
  // 获取限制时间
  getLimitTime: {
    url: '/org/pos/standardJobs/effDate',
    method: 'get'
  }
  // // 提交创建标准职位
  // submitCreateStandardJob: {
  //   url: '/org/pos/standardJobs/submission',
  //   method: 'post'
  // },
  // // 暂存创建标准职位
  // saveCreateStandardJob: {
  //   url: '/org/pos/standardJobs/hold',
  //   method: 'post'
  // },
  // // 提交修改标准职位
  // submitModifyStandardJob: {
  //   url: '/org/pos/standardJobs/submission',
  //   method: 'put'
  // },
  // // 暂存修改标准职位
  // saveModifyStandardJob: {
  //   url: '/org/pos/standardJobs/hold',
  //   method: 'put'
  // },
  // // 提交撤销标准职位
  // submitCancelStandardJob: {
  //   url: '/org/pos/standardJobs/revocation/submission',
  //   method: 'put'
  // },
  // // 暂存撤销标准职位
  // saveCancelStandardJob: {
  //   url: '/org/pos/standardJobs/revocation/hold',
  //   method: 'put'
  // }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
