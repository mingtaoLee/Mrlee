import request from '../index.js'

export const config = {
  // 获取所有职群职种树节点
  getAllTree: {
    url: '/org/pos/jobFamilys',
    method: 'get'
  },
  // 获取可用的职群职种节点
  getTreeAvailable: {
    url: '/org/pos/jobFamilys/available?type=2&includeEndNode=true',
    method: 'get'
  },
  // 根据职群职种树节点获取某个节点的信息
  getDetailsByTreeId: {
    url: '/org/pos/jobFamilys/{posJobFamilyId}/{jobFamilyType}',
    method: 'get'
  },
  // 在职群职种的时候，被撤销需要检验时候查询的人数
  cancelCheckByPeople: {
    url: '/org/pos/jobFamilys/validation/revocation',
    method: 'get'
  },
  // 在职群职种的首页中，批量删除的时候需要先验证是否能删除
  checkJobFamilyDelPermission: {
    url: '/org/pos/jobFamilys/{posJobFamilyId}/checkDelete',
    method: 'get'
  },
  // 在职群职种设置页中，搜索标准职位的详细信息
  searchStandardJobs: {
    url: '/org/pos/standardJobs',
    method: 'get'
  },
  // 在职群职种设置页中，搜索职位的详细信息
  searchJobs: {
    url: '/org/pos/positions/search',
    method: 'get'
  },
  // 在职群职种设置页中，搜索员工的详细信息
  searchEmployees: {
    url: '/org/pos/positions/search/employee',
    method: 'get'
  },
  // 在职位设置页中，根据职位id查看包含员工
  searchPostEmployees: {
    url: '/org/pos/positions/{posPositionId}/employees',
    method: 'get'
  },
  // 获取申请人的详细信息
  getApplcantInfo: {
    url: '/org/pos/{loginId}',
    method: 'get'
  },
  // 检查职群职种名称唯一性
  checkOcName: {
    url: '/org/pos/jobFamilys/validation',
    method: 'get'
  },
  // 根据职群职种id获取明细信息,用于职群职种修改的时候带出数据
  getOcDetails: {
    url: '/org/pos/jobFamilys/{posJobFamilyId}/detail',
    method: 'get'
  },
  // 在职群职种的页面，判断某个节点下能否新建
  checkCanNewOrNot: {
    url: '/org/pos/jobFamilys/validation/endNode',
    method: 'get'
  },
  // 提交创建职群职种
  submitCreateOc: {
    url: '/org/pos/jobFamilys/submission',
    method: 'post'
  },
  // 暂存创建职群职种
  saveCreateOc: {
    url: '/org/pos/jobFamilys/hold',
    method: 'post'
  },
  // 提交修改职群职种
  submitModifyOc: {
    url: '/org/pos/jobFamilys/submission',
    method: 'put'
  },
  // 暂存修改职群职种
  saveModifyOc: {
    url: '/org/pos/jobFamilys/hold',
    method: 'put'
  },
  // 提交撤销职群职种
  submitCancelOc: {
    url: '/org/pos/jobFamilys/revocation/submission',
    method: 'put'
  },
  // 暂存撤销职群职种
  saveCancelOc: {
    url: '/org/pos/jobFamilys/revocation/hold',
    method: 'put'
  },
  // 删除职群或职种
  deleteOc: {
    url: '/org/pos/jobFamilys/{posJobFamilyId}',
    method: 'delete'
  },
  // 如果是冻结中的，获取被冻结的信息，通用接口
  getFrozenInfo: {
    url: '/org/pos/{bussinessKey}/workFlowInfo ',
    method: 'get'
  },
  // 获取职群职种树流程的限制生效时间
  getLimitTime: {
    url: '/org/pos/jobFamilys/effDate',
    method: 'get'
  },
  // 获取批量新增职群职种的限制生效时间
  getBatchLimitTime: {
    url: '/org/pos/jobFamilys/batchCreateEffDate',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
