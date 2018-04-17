import request from '../index.js'

export const config = {
  // 获取职务列表
  getPosJobList: {
    url: '/org/pos/titles',
    method: 'get'
  },
  // 根据职务ID获取详细内容
  getPosJobDetail: {
    url: '/org/pos/titles/{posTitleId}',
    method: 'get'
  },
  // 检查职务名称唯一性
  checkName: {
    url: '/org/pos/titles/validation',
    method: 'get'
  },
  // 检查职务是否有标准职位
  checkHasStandardJob: {
    url: '/org/pos/titles/validation/standardJob',
    method: 'get'
  },
  // 检查职务是否有挂人
  checkHasEmployee: {
    url: '/org/pos/titles/validation/employee',
    method: 'get'
  },
  // 删除职务前校验
  checkDeleteTitle: {
    url: '/org/pos/titles/deletion/checkDelete',
    method: 'get'
  },
  // 删除职务
  deleteTitle: {
    url: '/org/pos/titles/deletion',
    method: 'delete'
  },
  // 获取职务下属有多少职位和员工
  getPositionAndStaff: {
    url: '/org/pos/titles/validation/revocation',
    method: 'get'
  },
  getEnableTitle: {
    url: '/org/pos/titles/enable',
    method: 'get'
  },
  // // 提交职务新建表单
  // submitCreateForm: {
  //   url: '/org/pos/titles/submission',
  //   method: 'post'
  // },
  // // 保存职务新建表单
  // saveCreateForm: {
  //   url: '/org/pos/titles/hold',
  //   method: 'post'
  // },
  // // 提交职务修改表单
  // submitModifyForm: {
  //   url: '/org/pos/titles/submission',
  //   method: 'put'
  // },
  // // 保存职务修改表单
  // saveModifyForm: {
  //   url: '/org/pos/titles/hold',
  //   method: 'put'
  // },
  // // 提交职务撤销表单
  // submitCancelForm: {
  //   url: '/org/pos/titles/revocation/submission',
  //   method: 'put'
  // },
  // // 保存职务修改表单
  // saveCancelForm: {
  //   url: '/org/pos/titles/revocation/hold',
  //   method: 'put'
  // },
  // 获取申请人信息
  getApplcantInfo: {
    url: '/org/pos/:loginId',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
