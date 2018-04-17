import request from '../index.js'

export const config = {
    // 新增问卷
  assessment: {
    url: '/employee/suretys/assessment/',
    method: 'post'
  },
  assessmentList: {
    url: '/employee/suretys/assessment',
    method: 'get'
  },
    // 获取问卷题目列表
  assessmentTitles: {
    url: '/employee/suretys/assessment/{assessmentId}',
    method: 'get'
  },
    // 更新问卷
  updateAssessment: {
    url: '/employee/suretys/assessment/',
    method: 'put'
  },
    // 撤销发布问卷
  deleteAssessment: {
    url: '/employee/suretys/assessment/{assessmentId}/unpublish',
    method: 'put'
  },
    // 联保人获取问卷明细
  assessmentContent: {
    url: '/employee/suretys/evaluation/{empSuretyEvaluationId}/detail',
    method: 'get'
  },
    // 获取联保人列表
  gaurantorList: {
    url: '/employee/suretys',
    method: 'get'
  },
    // 获取联保人互评结果
  assessmentResult: {
    url: '/employee/suretys/{employeeId}/assessment',
    method: 'get'
  },
    // 联保人提交问卷内容
  finishAss: {
    url: '/employee/suretys/evaluation/detail',
    method: 'post'
  },
    // 发布问卷
  publishAssessment: {
    url: '/employee/suretys/assessment/release',
    method: 'put'
  },
    // 获取问卷进度
  getAssessmentProgress: {
    url: '/employee/suretys/assessment/{assessmentId}',
    method: 'get'
  },
    // 请求问卷是否全部完成
  getOrEnd: {
    url: '/employee/suretys/assessment/{assessmentId}/finish',
    method: 'get'
  },
    // 查看结果
  getAssResult: {
    url: '/employee/suretys/assessment/result/{assessmentId}',
    method: 'get'
  },
    // 结束问卷
  finishAssessment: {
    url: '/employee/suretys/assessment/{assessmentId}/finish',
    method: 'put'
  },

    // 获取联保人结果
  getAssessmentResult: {
    url: '/employee/suretys/evaluation/{empEmployeeId}/byempid',
    method: 'get'
  },
    // 联保人获取问卷列表
  getEmpAssessmentList: {
    url: '/employee/suretys/evaluation',
    method: 'get'
  },
    // 查看问卷进度
  getAssessentProgress: {
    url: '/employee/suretys/assessment/status/{assessmentId}',
    method: 'get'
  },
    // 获取可用人事范围
  getPersonnelGroup: {
    url: '/common/personnelGroup/usable',
    method: 'get'
  },
    // 一键催评
  getRemindInfo: {
    url: '/employee/suretys/evaluation/key/{assessmentId}',
    method: 'get'
  },
    // 催评
  postRemindInfo: {
    url: '/employee/suretys/evaluation/surety',
    method: 'get'
  },
    // 通过被联保人获取联保人列表
  getCosurety: {
    url: '/employee/suretys/{employeeId}',
    method: 'get'
  },
  // 确认联保人次数
  getCosuretyCount: {
    url: '/employee/suretys/assessment/validate',
    method: 'get'
  },

    // 修改联保人
  changeCosurety: {
    url: '/employee/suretys',
    method: 'put'
  },
    // 根据被联保人部门或ID检查是否存在可选联保人
  getOptionalCosurety: {
    url: '/employee/suretys/surety/optional',
    method: 'get'
  },
  // 根据被联保人部门或ID检查是否存在必选联保人
  getEssentialCosurety: {
    url: '/employee/suretys/surety/essential',
    method: 'get'
  },
  // 根据工号查找该员工的id
  getEmployeeId: {
    url: '/iaf/public/insured/findEmployeeId',
    method: 'get'
  },
    // 查询员工基本信息
  getEmployeebaseInfo: {
    url: '/employee/employees/{empEmployeeId}/employeebaseInfo',
    method: 'get'
  }
}
export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
