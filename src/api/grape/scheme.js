import request from '../index.js'

var config = {

  getSchemeList: {
    url: '/grape/schemes',
    method: 'get'
  },

  getSchemeStaffs: {
    url: '/grape/schemes/{schemeId}/staffs',
    method: 'get'
  },

  activeSchemes: {
    url: '/grape/schemes/enabled',
    method: 'post'
  },

  diableSchemes: {
    url: '/grape/schemes/disabled',
    method: 'post'
  },

  deleteSchemes: {
    url: '/grape/schemes/delete',
    method: 'post'
  },

  getSchemeDetail: {
    url: '/grape/scheme/{schemeId}',
    method: 'get'
  },

  deleteStaffs: {
    url: '/grape/schemes/{schemeId}/staffs/delete',
    method: 'post'
  },

  editGrapeScheme: {
    url: '/grape/scheme/{schemeId}',
    method: 'put',
    headers: {'Content-Type': 'application/json'}
  },

  addGrapeScheme: {
    url: '/grape/scheme',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },

  getEvaluateStandard: {
    url: '/grape/standards/enabled',
    method: 'get'
  },

  getOrgObj: {
    url: '/org/orgs/{id}/detail/echo',
    method: 'get'
  },

  addGrapeSchemeTarget: {
    url: '/grape/schemes/{schemeId}/staffs',
    method: 'post'
  },

  setLeaderOne: {
    url: '/grape/staffs/{staffId}/checkRalation',
    method: 'post'
  },

  setLeaderMany: {
    url: '/grape/staffs/relation',
    method: 'post'
  },

  leaderAdjustRecords: {
    url: '/grape/employees/{employeeId}/updateRecords',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
