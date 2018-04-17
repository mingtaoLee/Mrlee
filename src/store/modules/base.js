import req from 'api/common/base'

export default {
  state: {
    provinces: [],
    parentRoute: null
  },
  mutations: {
    SET_PROVINCES: (state, value) => {
      state.provinces = value
    },
    SET_PARENTROUTE: (state, value) => {
      state.parentRoute = value
      sessionStorage.setItem('PARENT_ROUTE', JSON.stringify({name: value.name, path: value.path}))
    }
  },
  actions: {
    getProvince: ({commit, state}) => {
      return new Promise((resolve, reject) => {
        if (state.provinces && state.provinces.length > 0) {
          resolve()
        } else {
          req('provinces').then(data => {
            data.forEach(item => {
              item.children = []
            })
            commit('SET_PROVINCES', data)
            resolve(data)
          }, err => {
            reject(err)
          })
        }
      })
    },
    getAreas: ({commit}, value) => {
      return req('areas', {codes: value + ''})
    }
  }
}
