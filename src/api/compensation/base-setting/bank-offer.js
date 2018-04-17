import request from 'api/index'

export const config = {
  // 银行报盘模板删除
  delBankTpl: {
    url: '/compensation/basic/bankTemplates/{bankTemplateId}',
    method: 'delete'
  },
  // 银行报盘模板详情增、改、删
  modifyBankTplContent: {
    url: '/compensation/basic/bankTemplates/{bankTemplateId}/updateBankTmpContent',
    method: 'post'
  },
  // 银行报盘模板详情查询
  getBankTplContent: {
    url: '/compensation/basic/bankTemplates/{bankTemplateId}/getBankTmpContent',
    method: 'get'
  },
  // 银行报盘模板列表查询
  getBankTplList: {
    url: '/compensation/basic/bankTemplates',
    method: 'get'
  },
  // 银行报盘模板修改
  editBankTpl: {
    url: '/compensation/basic/bankTemplates/{bankTemplateId}',
    method: 'put'
  },
  // 银行报盘模板id查询
  getBankTplById: {
    url: '/compensation/basic/bankTemplates/{bankTemplateId}',
    method: 'get'
  },
  // 银行报盘模板新增
  createBankTpl: {
    url: '/compensation/basic/bankTemplates',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
