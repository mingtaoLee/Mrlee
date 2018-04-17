/**
 * Created by Administrator on 2017-11-4.
 */
import request from '../../index'

export const config = {
  getTaxRate: {
    url: '/compensation/basic/iitaxrates',
    method: 'get'
  },
  getBaseTaxRate: {
    url: '/compensation/basic/iitaxrates/{iitaxrateId}',
    method: 'get'
  },
  deleteBaseTaxRate: {
    url: '/compensation/basic/iitaxrates/{iitaxrateId}',
    method: 'delete'
  },
  postBaseTaxRate: {
    url: '/compensation/basic/iitaxrates',
    method: 'post'
  },
  putBaseTaxRate: {
    url: '/compensation/basic/iitaxrates/{iitaxrateId}',
    method: 'put'
  },
  getSecurityPolicyList: {
    url: '/compensation/basic/insareas',
    method: 'get'
  },
  getSecurityPolicy: {
    url: '/compensation/basic/insareas/{id}',
    method: 'get'
  },
  putSecurityPolicy: {
    url: '/compensation/basic/insareas/{id}',
    method: 'put'
  },
  postSecurityPolicy: {
    url: '/compensation/basic/insareas',
    method: 'post'
  },
  deleteSecurityPolicy: {
    url: '/compensation/basic/insareas/{id}',
    method: 'delete'
  },
  getSecurityPolicyDetailList: {
    url: '/compensation/basic/insareas/{id}/detail',
    method: 'get'
  },
  postSecurityPolicyDetail: {
    url: '/compensation/basic/insareas/{id}/detail',
    method: 'post'
  },
  getSecurityPolicyDetail: {
    url: '/compensation/basic/insareas/{id}/detail/{areaInfoId}',
    method: 'get'
  },
  putSecurityPolicyDetail: {
    url: '/compensation/basic/insareas/{id}/detail/{areaInfoId}',
    method: 'put'
  },
  deleteSecurityPolicyDetail: {
    url: '/compensation/basic/insareas/{id}/detail/{areaInfoId}',
    method: 'delete'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
