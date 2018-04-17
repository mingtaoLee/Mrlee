import request from '../index.js'
// 招聘管理的api
export const config = {
  // 标签库的列表
  labelList: {
    url: '/recruit/labels',
    method: 'get'
  },
  // 新建标签
  addLabel: {
    url: '/recruit/label',
    method: 'post'
  },
  // 修改标签-已启用的不能修改和删除
  updateLabel: {
    url: '/recruit/labels/{labelId}',
    method: 'put'
  },
  // 查询所有启用标签
  searchAllLabelStarted: {
    url: '/recruit/labels/enabled',
    method: 'get'
  },
  // 查看标签详情
  seeLabel: {
    url: '/recruit/labels/{labelId}',
    method: 'get'
  },
  // 删除标签
  deleteLabel: {
    url: '/recruit/labels/delete',
    method: 'put'
  },
  // 启用标签
  startLabel: {
    url: '/recruit/labels/enabled',
    method: 'post'
  },
  // 禁用标签
  forbidLabel: {
    url: '/recruit/labels/disabled',
    method: 'post'
  },
  // 评估项管理列表
  evaluateList: {
    url: '/recruit/evaluationOptions',
    method: 'get'
  },
  // 新建评估项
  addEvaluate: {
    url: 'recruit/evaluationOption',
    method: 'post'
  },
  // 查看一条评估项
  seeEvaluate: {
    url: 'recruit/evaluationOptions/{evaluationOptionId}',
    method: 'get'
  },
  // 修改一条评估项
  updateEvaluate: {
    url: 'recruit/evaluationOptions/{evaluationOptionId}',
    method: 'put'
  },
  // 删除评估项
  deleteEvaluate: {
    url: 'recruit/evaluationOptions/delete',
    method: 'put'
  },
   // 禁用评估项
  forbidEvaluate: {
    url: 'recruit/evaluationOptions/disabled',
    method: 'post'
  },
   // 启用评估项
  startEvaluate: {
    url: 'recruit/evaluationOptions/enabled',
    method: 'post'
  },
  // 渠道招聘列表
  channelList: {
    url: '/recruit/resources',
    method: 'get'
  },
  // 招聘需求列表
  requirementList: {
    url: '/recruit/requirements',
    method: 'get'
  },
  // 招聘需求发布
  releaseRequirementList: {
    url: 'recruit/requirements/release',
    method: 'post'
  },
  // 招聘需求关闭
  cancelRequirementList: {
    url: 'recruit/requirements/cancel',
    method: 'post'
  },
  // 招聘需求详情
  requirementDetail: {
    url: '/recruit/requirements/{requirementId}',
    method: 'get'
  },
  // 评估表模板管理列表
  evaluationTemplates: {
    url: '/recruit/evaluationTemplates',
    method: 'get'
  },
  // 自助端数据统计
  statisticsData: {
    url: '/self/recruit/statistics/self',
    method: 'get'
  },
  // 自助端招聘需求列表
  autoRequirementList: {
    url: '/self/recruit/requirements/self',
    method: 'get'
  },
  // 自助端待面试列表
  getAgencyInterviews: {
    url: '/self/recruit/interviews/onHand',
    method: 'get'
  },
  // 自助端面试评估列表
  geInterviewEvaluate: {
    url: '/self/recruit/interviews/{interviewId}/evaluation',
    method: 'get'
  },
  // 查询所有启用的评估项
  getEvaluationOptionsEnabled: {
    url: '/self/recruit/evaluationOptions/enabled',
    method: 'get'
  },

  // 自助端面试反馈
  postInterviewEvaluate: {
    url: '/self/recruit/self/interviews/{interviewId}/result',
    method: 'post'
  },

  // 查询所有启用的通知模板
  getInformsEnabled: {
    url: '/recruit/informs/enabled',
    method: 'get'
  },

  // 查询所有启用的评估表模板
  getEvaluationTemplatesEnabled: {
    url: '/recruit/evaluationTemplates/enabled',
    method: 'get'
  },

  // 发送通知
  postNotification: {
    url: '/recruit/resumes/{resumeId}/notification',
    method: 'post'
  },

  // 简历列表
  getResumeList: {
    url: '/recruit/resumes',
    method: 'post'
  },

  // 收藏简历
  collectResume: {
    url: '/recruit/resumes/{resumeId}/collect',
    method: 'post'
  },

  // 取消收藏简历
  cancelCollectResume: {
    url: '/recruit/resumes/{resumeId}/collection/cancel',
    method: 'post'
  },

  // 修改简历状态
  changeResumeStatus: {
    url: '/recruit/resumes/{resumeId}/status',
    method: 'put'
  },

  // 导入简历
  importResume: {
    url: '/recruit/resumes/import',
    method: 'post'
  },

  // 下载简历模版
  downloadResumeTemplate: {
    url: '/templates/recruitTemplate/download',
    method: 'get'
  },

  // 查看简历
  resumeDetail: {
    url: '/recruit/resumes/{resumeId}',
    method: 'get'
  },

  // 修改简历信息
  modifyResumeDetail: {
    url: '/recruit/resumes/{resumeId}',
    method: 'put'
  },

  // 查询简历对应的发布中的需求
  getRequirementsReleased: {
    url: '/recruit/resumes/{resumeId}/requirements/released',
    method: 'get'
  },

  // 查询所有启用的标签
  getLabelsEnabled: {
    url: '/recruit/labels/enabled',
    method: 'get'
  },

  // 新增评估表模板
  postCreatedEvaluationTemplate: {
    url: '/recruit/evaluationTemplate',
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  },

  // 我是面试官下载功能
  postDownloadform: {
    url: '/recruit/interviews/{interviewId}/download',
    method: 'get'
  },

  // 修改评估表模板
  putModifiedEvaluationTemplate: {
    url: '/recruit/evaluationTemplates/{evaluationTemplateId}',
    method: 'put',
    headers: {'Content-Type': 'application/json'}
  },

  // 查询评估表模板
  getEvaluationTemplates: {
    url: '/recruit/evaluationTemplates/{evaluationTemplateId}',
    method: 'get'
  },

  // 获取发送录用通知书的人员选择需要的电话和邮箱
  getPeople: {
    url: '/public-access/employees/base/message',
    method: 'get'
  },
  // 根据组织ID获取该组织下的职位
  getPosList: {
    url: '/org/pos/positions/emp/{orgUnitId}/posList',
    method: 'get'
  },
  // 根据组织ID获取人事范围，组织名字，公司名字
  getArea: {
    url: '/org/orgs/{id}/personnel/area',
    method: 'get'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
