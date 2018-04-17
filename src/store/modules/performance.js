import req from 'api/performance/plan-manage'
export default {
  state: {
    tableAssessment: {},
    performancePeriodIndex: null,
    toggledPeriod: ''
  },
  mutations: {
    PER_SET_ASSESSMENT (state, val) {
      state.tableAssessment = val
    },
    PER_SET_PERIOD_INDEX (state, val) {
      state.performancePeriodIndex = val
    },
    PER_SET_TOGGLEDPERIOD (state, payload) {
      state.toggledPeriod = payload.period
    }
  },
  actions: {
    PER_EMPLOYEE_ASSESSMENT ({commit}, id) {
      req('getAssessment', {planId: id}).then(res => {
        commit('PER_SET_ASSESSMENT', res)
      })
    }
  }
}
