import request from '../index.js'

export const config = {
  // 获取品类列表
  getPosCategoryList: {
    url: '/org/pos/categorys',
    method: 'get'
  },
  // 根据ID获取品类详细内容
  getPosCategoryDetail: {
    url: '/org/pos/categorys/{posCategoryId}',
    method: 'get'
  },
  // 名称唯一性检验
  checkName: {
    url: '/org/pos/categorys/validation',
    method: 'get'
  },
  // 检查品类是否有标准职位
  checkHasStandardJob: {
    url: '/org/pos/categorys/validation/standardJob',
    method: 'get'
  },
  // 校验品类下面是否有组织
  checkHasOrgUnit: {
    url: '/org/pos/categorys/validation/orgUnit',
    method: 'get'
  },
  // 删除品类前的校验
  checkDeleteCategory: {
    url: '/org/pos/categorys/deletion/checkDelete',
    method: 'get'
  },
  // 删除品类
  deleteCategory: {
    url: '/org/pos/categorys/deletion',
    method: 'delete'
  },
  // 获取职位统计信息
  checkPosition: {
    url: '/org/pos/categorys/validation/revocation',
    method: 'get'
  },
  // 获取可用的品类列表
  getEnableCategory: {
    url: '/org/pos/categorys/enable',
    method: 'get'
  },
  // // 提交品类新建表单
  // submitCreateForm: {
  //   url: '/org/pos/categorys/submission',
  //   method: 'post'
  // },
  // // 保存品类新建表单
  // saveCreateForm: {
  //   url: '/org/pos/categorys/hold',
  //   method: 'post'
  // },
  // // 提交品类修改表单
  // submitModifyForm: {
  //   url: '/org/pos/categorys/submission',
  //   method: 'put'
  // },
  // // 保存品类新建表单
  // saveModifyForm: {
  //   url: '/org/pos/categorys/hold',
  //   method: 'put'
  // },
  // // 提交品类撤销表单
  // submitCancelForm: {
  //   url: '/org/pos/categorys/revocation/submission',
  //   method: 'put'
  // },
  // // 保存品类新建表单
  // saveCancelForm: {
  //   url: '/org/pos/categorys/revocation/hold',
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
