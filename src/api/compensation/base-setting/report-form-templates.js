import request from 'api/index'

export const config = {
  // 个税申请模板详情查询
  getTaxTplContent: {
    url: '/compensation/basic/iit-templates/{iitTemplateId}/contents',
    method: 'get'
  },
  // 模板详情创建，编辑，修改
  modifyTaxTplContent: {
    url: '/compensation/basic/iit-templates/{iitTemplateId}/contents',
    method: 'post'
  },
  // 模板删除
  delTaxTpl: {
    url: '/compensation/basic/iit-templates/{iitTemplateId}',
    method: 'delete'
  },
  // 模板id查询
  getTaxTplById: {
    url: '/compensation/basic/iit-templates/{iitTemplateId}',
    method: 'get'
  },
  // 分页查询模板列表
  getTaxTplList: {
    url: '/compensation/basic/iit-templates',
    method: 'get'
  },
  // 模板修改
  editTaxTpl: {
    url: '/compensation/basic/iit-templates/{iitTemplateId}',
    method: 'put'
  },
  // 模板创建
  createTaxTpl: {
    url: '/compensation/basic/iit-templates',
    method: 'post'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
