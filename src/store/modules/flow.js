import { windowOpen } from 'utils'

export default {
  state: {
    // 保存显示的字段
    showMap: {},
    // 保存禁用的字段
    disabledMap: {},
    processType: '',
    taskId: '',
    taskKey: '',
    processInstanceId: '',
    isFlowCenter: '',
    employeeId: '',
    idNumber: ''
  },
  mutations: {
    SET_FLOW_SHOW_MAP: (state, value) => {
      state.showMap = value
    },
    SET_FLOW_DISABLED_MAP: (state, value) => {
      state.disabledMap = value
    },
    SET_FLOW_ACTION: (state, { processType, taskId, taskKey, processInstanceId, isFlowCenter, employeeId, idNumber }) => {
      state.processType = processType
      state.taskId = taskId
      state.taskKey = taskKey
      state.processInstanceId = processInstanceId
      state.isFlowCenter = isFlowCenter
      state.employeeId = employeeId
      state.idNumber = idNumber
    },

    FLOW_WINDOW_OPEN (state, url) {
      let params = {}

      Object.keys(state).map(key => {
        if (state[key] && key !== 'showMap' && key !== 'disabledMap') params[key] = state[key]
      })
      windowOpen(url, params)
    }
  }
}
