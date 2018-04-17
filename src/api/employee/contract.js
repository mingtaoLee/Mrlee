import request from '../index.js'

export const config = {
  // 获取模板列表
  getContractList: {
    url: '/employee/contracts/template',
    method: 'get'
  },
  // 新增模板
  postContractTemplate: {
    url: '/employee/contracts/template',
    method: 'post'
  },
  // 合同台账列表
  getContracts: {
    url: '/employee/contracts',
    method: 'get'
  },
  // 合同个人台账列表
  getPerContracts: {
    url: 'employee/contracts/{employeeCode}/template',
    method: 'get'
  },
  // 合同编号获取
  getContactNo: {
    url: '/employee/contracts/code/{empEmployeeId}',
    method: 'get'
  },
  // 查看合同模板
  showTemplate: {
    url: '/employee/contracts/template/{templateId}',
    method: 'get'
  },

  // 合同模板修改
  putTemplate: {
    url: '/employee/contracts/template',
    method: 'put'
  },

  // 合同模板启用
  putTemplateEnable: {
    url: '/employee/contracts/template/{templateId}/enable',
    method: 'put'
  },
  putTemplateDisable: {
    url: '/employee/contracts/template/{templateId}/disable',
    method: 'put'
  },
  // 合同模板删除
  deleteTemplate: {
    url: '/employee/contracts/template/{templateId}',
    method: 'delete'
  },
  // 合同模板新签列表
  getContractsSignList: {
    url: '/employee/contracts/signpage',
    method: 'get'
  },
  // 合同模板中止
  postTermination: {
    url: '/employee/contracts/termination',
    method: 'put'
  },
  // 合同模板新签
  putContractsSign: {
    url: '/workflow/employees/sign/submit',
    method: 'post'
  },
  putContractsSignByFlow: {
    url: '/workflow/employees/sign/submit',
    method: 'put'
  },
  // 新签时获取的信息
  getDefaultSign: {
    url: 'employee/contracts/sign',
    method: 'get'
  },
  // 获取合同主体列表
  getContentDetailList: {
    url: 'employee/contracts/company',
    method: 'get'
  },
  // 获取合同主体信息
  getContentDetail: {
    url: '/employee/contracts/content/{contractId}',
    method: 'get'
  },
  getDict: {
    url: '/public-access/dicts/{dictCode}/items',
    method: 'get'
  },
  // 合同测试
  getTest: {
    url: 'workflow/employees',
    method: 'get'
  },
  // 合同流程插入获取数据
  getContractWorkflow: {
    url: 'workflow/employees/{empPfId}',
    method: 'get'
  },
  // 批量设置为已签纸质合同
  setSignContracts: {
    url: '/employee/contracts/isSignContract/setY',
    method: 'put'
  },
  // 根据业务ID和业务类型 获取附件列表
  getContractFileList: {
    url: '/system/attachments/files',
    method: 'get'
  },
  // 流程校重
  getcheck: {
    url: 'employee/workflow/check',
    get: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
