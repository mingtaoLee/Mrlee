import { windowOpen } from 'utils'
import { jobProcessType } from 'config/dict'

export default {
  state: {
    departmentId: '',
    departmentName: '',
    applicantId: '',
    applicantName: '',
    applicationDate: '',
    node: {},
    orgNode: {},
    operationType: 0
  },
  mutations: {
    SET_ACTION: (state, value) => {
      state.operationType = value
    },
    SET_NODE: (state, value) => {
      state.node = value
    },
    SET_ORG_NODE: (state, value) => {
      state.orgNode = value
    },
    // 新建的时候没有id，则选择的是目标者的父级
    OC_WINDOW_OPEN: (state) => {
      var params = {
        parentId: Object.keys(state.node).length > 1 ? state.node.key : '-1',
        parentName: Object.keys(state.node).length > 1 ? state.node.label : '',
        jobFamilyType: Object.keys(state.node).length > 1 ? state.node.data.jobFamilyType : '-1',
        processType: jobProcessType[state.operationType]
      }
      Object.assign(params)
      // 这里带出的是父节点的生效时间，子节点新建的时候不能在这个时间之前
      var url = '/flow.html#/flow/' + params.processType
      windowOpen(url, params)
    },
    // 修改或撤销的时候带id，则选择的是目标者
    OC_WINDOW_OPEN_BY_ID: (state) => {
      var params = {
        parentId: state.node.parent.key || '-1',
        posJobFamilyId: state.node.key,
        posJobFamilyName: state.node.label,
        jobFamilyType: Object.keys(state.node).length > 1 ? state.node.data.jobFamilyType : '-1',
        processType: jobProcessType[state.operationType]
      }
      var url = '/flow.html#/flow/' + params.processType
      windowOpen(url, params)
    },
    // 职群职种批量新建
    NEW_BATCH_POSITION: (state) => {
      let params = {
        processType: jobProcessType[state.operationType]
      }
      let url = '/flow.html#/flow/' + jobProcessType[state.operationType]
      windowOpen(url, params)
    }
  },
  actions: {

  }
}
