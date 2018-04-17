/**
 * Created by Younh on 2017/12/9.
 */
import request from 'api/index'

export const config = {
  validateRules: {
    url: '/compensation/basic/rules/validate',
    method: 'post'
  },
  //
  getReference: {
    url: '/compensation/formula/reference',
    method: 'get'
  },
  //
  getFunctions: {
    url: '/compensation/formula/functions',
    method: 'get'
  },
  getFunctionsAll: {
    url: '/compensation/formula/functions/all',
    method: 'get'
  },
  getCompensations: {
    url: '/compensation/formula/compensations',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = false) {
  return request(config, funcName, data, isToken, isCancel)
}
