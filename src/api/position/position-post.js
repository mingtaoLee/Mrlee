import request from '../index.js'

export const config = {
  // 根据职位id查看明细
  getPostDetailsById: {
    url: '/org/pos/positions/{posPositionId}',
    method: 'get'
  },
  // 根据组织id分页获取职位列表
  getPostList: {
    url: '/org/pos/positions',
    method: 'get'
  },
  // 职位的表单页面，根据职位id获取获取汇报职位
  getReportJob: {
    url: '/org/pos/positions/parentPositions',
    method: 'get'
  },
  // 职位的主页，根据职群职种id和type来获取对应的标准职位列表
  getStandardJobByOccupation: {
    url: '/org/pos/standardJobs/{posJobFamilyId}/idAndNameList',
    method: 'get'
  },
  // 检验职位名称唯一性
  checkJobName: {
    url: '/org/pos/positions/validation',
    method: 'get'
  },
  // 查看职位下挂有多少员工
  checkIfEmployee: {
    url: '/org/pos/positions/{posPositionId}/employeeNum',
    method: 'get'
  },
  // 根据职位id查看包含员工
  getEmployee: {
    url: '/org/pos/positions/{posPositionId}/employees',
    method: 'get'
  },
  // 根据职位id获取人员数
  getEmployeeNum: {
    url: '/org/pos/positions/{posPositionId}/employeeNum',
    method: 'get'
  },
  // 检验删除职位是否可行
  checkDeletePosition: {
    url: '/org/pos/positions/deletion/checkDelete',
    method: 'get'
  },
  // 删除职位
  deletePosition: {
    url: '/org/pos/positions/deletion',
    method: 'delete'
  },
  // 获取品类列表
  getCategoryList: {
    url: '/org/pos/categorys/avaliable',
    method: 'get'
  },
  // 获取限制时间
  getLimitTime: {
    url: '/org/pos/positions/effDate',
    method: 'get'
  }
  // // 提交创建职位
  // submitCreateJob: {
  //   url: '/org/pos/positions/submission',
  //   method: 'post'
  // },
  // // 暂存创建职位
  // saveCreateJob: {
  //   url: '/org/pos/positions/hold',
  //   method: 'post'
  // },
  // // 提交修改职位
  // submitModifyJob: {
  //   url: '/org/pos/positions/submission',
  //   method: 'put'
  // },
  // // 暂存修改职位
  // saveModifyJob: {
  //   url: '/org/pos/positions/hold',
  //   method: 'put'
  // },
  // // 提交撤销职位
  // submitCancelJob: {
  //   url: '/org/pos/positions/revocation/submission',
  //   method: 'put'
  // },
  // // 暂存撤销职位
  // saveCancelJob: {
  //   url: '/org/pos/positions/revocation/hold',
  //   method: 'put'
  // }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
