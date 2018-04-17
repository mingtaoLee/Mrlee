
export default {
  state: {
    accessList: []
  },
  mutations: {
    SET_ACCESS_MAP: (state, value) => {
      state.accessList = value
    }
  },
  actions: {
    FORMAT_ACCESS_MAP: ({ commit }, value) => {
      commit('SET_ACCESS_MAP', value)
    }
  }
}
