import request from '../index.js'

export const config = {
  getPlanManageData: {
    url: '/performance/schemes',
    method: 'get'
  },
  getSchemeDetail: {
    url: '/performance/scheme/{schemeId}',
    method: 'get'
  },
  getPlanList: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plans',
    method: 'get'
  },
  getSchemeInfo: {
    url: '/performance/schemes/{schemeId}/schemeDetail',
    method: 'get'
  },
  getSchemeStatics: {
    url: '/performance/schemes/{schemeId}/periods/{period}/statistics',
    method: 'get'
  },
  getRankAdjust: {
    url: '/performance/plans/{planId}/levelAdjust',
    method: 'get'
  },
  getRankAdjustRecords: {
    url: '/performance/plans/{planId}/levelAdjusts',
    method: 'get'
  },
  adjustRank: {
    url: '/performance/plans/{planId}/levelAdjust',
    method: 'post'
  },
  getAssessment: {
    url: '/performance/plans/{planId}/checkRalation',
    method: 'get'
  },
  setAssessment: {
    url: '/performance/plans/{planId}/checkRalation',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  modifyTargets: {
    url: '/performance/schemes/{schemeId}/periods/{period}/staffs',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  getAllAssessment: {
    url: '/performance/plans/checkRalation',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  assessmentAdjust: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plans/checkRalation',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  beginPlan: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plans/enabled',
    method: 'post'
  },
  createPlan: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plan/generate',
    method: 'post'
  },
  startEvaluation: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plans/startEvaluation',
    method: 'post'
  },
  endEvaluation: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plan/endEvaluation',
    method: 'post'
  },
  calculateResult: {
    url: '/performance/schemes/{schemeId}/periods/{period}/calculateResult',
    method: 'post'
  },
  publishResult: {
    url: '/performance/schemes/{schemeId}/periods/{period}/publishResult',
    method: 'post'
  },
  createDocument: {
    url: '/performance/schemes/{schemeId}/periods/{period}/generateDocument',
    method: 'post'
  },
  deletePlan: {
    url: '/performance/plans',
    method: 'post'
  },
  getPlanDetail: {
    url: '/performance/plans/{planId}/detail',
    method: 'get'
  },
  getPlanCheckRecord: {
    url: '/performance/plans/{planId}/checkRecord',
    method: 'get'
  },
  postPerformancePlanSubmit: {
    url: '/performance/plans/{planId}/submit',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  postPerformancePlanSave: {
    url: '/performance/plans/{planId}/save',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  getPerformanceLastPlan: {
    url: '/performance/plans/{planId}/lastPlan',
    method: 'get'
  },
  postPerformanceAuditPass: {
    url: '/performance/plans/{planId}/check/pass',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  postPerformanceAuditReject: {
    url: '/performance/plans/{planId}/check/reject',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  submitReEvaluate: {
    url: '/performance/plans/{planId}/leaderEvaluation',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  savePlan: {
    url: '/performance/plans/{planId}/save',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  planGradeComplaint: {
    url: '/performance/plans/{planId}/gradeComplaint',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  planRepresentation: {
    url: '/performance/plans/{planId}/dealGradeComplaint',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  submitSelfEvaluate: {
    url: '/performance/plans/{planId}/selfEvaluation',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  rejectPlan: {
    url: '/performance/plans/{planId}/check/reject',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  planConfirm: {
    url: '/performance/plans/{planId}/gradeConfirm',
    method: 'post'
  },
  getPeriodPlanDetail: {
    url: '/performance/employees/{employeeId}/schemes/{schemeId}/periods/{period}/planDetail',
    method: 'get'
  },
  getQuoteList: {
    url: '/performance/indicators',
    method: 'get'
  },
  searchPerson: {
    url: '/public-access/employees',
    method: 'get'
  },
  getGradeComplaint: {
    url: '/performance/plans/gradeComplaint',
    method: 'get'
  },
  getDocuments: {
    url: '/performance/documents',
    method: 'get'
  },
  postExportDocuments: {
    url: '/performance/documents/export',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },
  getNotActiveNumber: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plans/notEffectCount',
    method: 'get'
  },
  getNotEvaluateNumber: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plans/notEvaluationCount',
    method: 'get'
  },
  getRankLevels: {
    url: '/performance/plans/{planId}/levels',
    method: 'get'
  },
  getDocumentLevels: {
    url: '/performance/documents/levels',
    method: 'get'
  },
  postMessages: {
    url: '/performance/schemes/{schemeId}/periods/{period}/plans/notification',
    method: 'post'
  },
  getDocumentDetail: {
    url: '/performance/documents/{documentId}/detail',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
