import { windowOpen } from 'utils'

export default {
  state: {
    processType: '',
    demandId: '-1',
    employeeId: '-1',
    taskId: undefined,
    taskKey: undefined,
    interviewId: '',
    isDamandEditable: 'N', // 招聘需求是否可编辑，默认不可编辑
    isEmployEditable: 'N',  // 录用审批是否可编辑，默认不可编辑

    labelFormParam: {
      name: '',
      status: ''
    },
    resumeSearchParam: {}
  },

  mutations: {
    // 打开招聘需求流程
    DEMON_WINDOW_OPEN (state) {
      var params = {
        processType: 'rctRequirementProcess4shop',
        taskId: state.taskId,
        taskKey: state.taskKey
      }
      windowOpen('/flow.html#/flow/rctRequirementProcess4shop', params)
    },
    // 打开录用审批流程
    EMPLOY_WINDOW_OPEN (state, obj) {
      console.log('ja', obj)
      var params = {
        processType: 'hireAuditProcess',
        taskId: state.taskId,
        taskKey: state.taskKey,
        interviewId: obj.interviewId,
        name: obj.name
      }
      windowOpen('/flow.html#/flow/hireAuditProcess', params)
    },
    // 修改标签表单
    MODIFY_LABELFORM (state, {name, status}) {
      state.labelFormParam = {
        name,
        status
      }
    },
    // 修改简历库表单
    MODIFY_RESUMEFORM (state, {name, education, mobile, resumeStatus, resumeSource, resumeLineType, requirementId, inBeginDate, inEndDate, minAge, maxAge, labels}) {
      state.resumeSearchParam = {
        name,
        education,
        mobile,
        resumeStatus,
        resumeSource,
        resumeLineType,
        requirementId,
        inBeginDate,
        inEndDate,
        minAge,
        maxAge,
        labels
      }
    },
    // 打开简历详情
    REMUSEDETAIL_WINDOW_OPEN (state, {source, resumeId}) {
      var params = {
        source: source,
        resumeId: resumeId
      }
      windowOpen('/index.html#/recruit/resume/resumeDetail', params)
    }
  },

  actions: {}
}
