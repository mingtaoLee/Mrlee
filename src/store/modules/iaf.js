import req from 'api/iaf/iaf-flow'
export default {
  state: {
    currentNodeDetail: {}
  },
  mutations: {
    SET_CURRENTNODE (state, val) {
      state.currentNodeDetail = val
    }
  },
  actions: {
    // 个人信息
    GET_IAFBASEPERSONALINFO ({commit}, employeeCode) {
      return req('iafEmployeeBase', {employeeCode})
    },
    // 参保基数
    GET_IAFBENCHMARKS (context, params) {
      return req('iafPayBase', params)
    },
    // 减员参保基数
    GET_IAFPAYBASEFORDECREASING (context, params) {
      return req('iafPayBaseForDecreasing', params)
    },
    // 是否显示户口级别
    DOMICILE_LEVE (context, employeeCode) {
      return req('domicileLeve', {employeeCode})
    },
    // 账号有效性
    VALIDATE_EMPCODE (context, employeeCode) {
      return req('validEmployeeCode', {employeeCode})
      .then(valid => {
        if (valid) {
          return Promise.resolve()
        } else {
          return Promise.reject('员工工号不存在')
        }
      })
    }
  }
}
