/**
 * Created by Administrator on 2017-11-4.
 */
import request from '../index'

export const config = {
  getTaxRate: {
    url: '/iaf/basic/iitaxrates',
    method: 'get'
  },
  getBaseTaxRate: {
    url: '/iaf/basic/iitaxrates/{iitaxrateId}',
    method: 'get'
  },
  deleteBaseTaxRate: {
    url: '/iaf/basic/iitaxrates/{iitaxrateId}',
    method: 'delete'
  },
  postBaseTaxRate: {
    url: '/iaf/basic/iitaxrates',
    method: 'post'
  },
  putBaseTaxRate: {
    url: '/iaf/basic/iitaxrates/{iitaxrateId}',
    method: 'put'
  },
  getSecurityPolicyList: {
    url: '/iaf/basic/insareas',
    method: 'get'
  },
  getSecurityPolicy: {
    url: '/iaf/basic/insareas/{id}',
    method: 'get'
  },
  putSecurityPolicy: {
    url: '/iaf/basic/insareas/{id}',
    method: 'put'
  },
  postSecurityPolicy: {
    url: '/iaf/basic/insareas',
    method: 'post'
  },
  deleteSecurityPolicy: {
    url: '/iaf/basic/insareas/{id}',
    method: 'delete'
  },
  getSecurityPolicyDetailList: {
    url: '/iaf/basic/insareas/{id}/detail',
    method: 'get'
  },
  postSecurityPolicyDetail: {
    url: '/iaf/basic/insareas/{id}/detail',
    method: 'post'
  },
  getSecurityPolicyDetail: {
    url: '/iaf/basic/insareas/{id}/detail/{areaInfoId}',
    method: 'get'
  },
  putSecurityPolicyDetail: {
    url: '/iaf/basic/insareas/{id}/detail/{areaInfoId}',
    method: 'put'
  },
  deleteSecurityPolicyDetail: {
    url: '/iaf/basic/insareas/{id}/detail/{areaInfoId}',
    method: 'delete'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
