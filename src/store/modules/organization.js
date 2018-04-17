import req from 'api/org/tabs'
import reqSetting from 'api/org/setting'
export default {
  state: {
    cruentEditNodeIndex: null,
    currentNodeDetail: {}
  },
  mutations: {
    SET_NODE_INDEX (state, val) {
      state.cruentEditNodeIndex = val
    },
    SET_CURRENTNODE (state, val) {
      state.currentNodeDetail = val
    }
  },
  actions: {
    SET_CRUENT_NODE_INDEX (context, index) {
      context.commit('SET_NODE_INDEX', index)
    },
    SELECT_NODE ({commit, dispatch}, {url = 'detail', params, reqArea = false}) {
      return req(url, params).then(data => {
        return data
      })
      .then(data => {
        if (!reqArea) return Promise.resolve(data)

        return dispatch('GET_BELONEMANAGEDAREAS', data)
      })
    },
    GET_BELONEMANAGEDAREAS ({dispatch}, data) {
      return Promise.all([dispatch('getAreas', data.belongArea), dispatch('getAreas', data.managedArea)])
      .then(areas => {
        let [belongArea, managedArea] = areas
        if (Array.isArray(belongArea) && belongArea.length) {
          data.belongAreaName = belongArea.join('/')
        } else {
          data.belongAreaName = data.belongArea
        }
        if (Array.isArray(managedArea) && managedArea.length) {
          data.managedAreaName = managedArea.join('/')
        } else {
          data.managedAreaName = data.managedArea
        }
        return data
      })
      .catch(() => {
        data.managedAreaName = data.managedArea
        data.belongAreaName = data.belongArea
        return data
      })
    },
    IS_SHOP (context, orgUnitId) {
      return reqSetting('isShop', {
        orgUnitId
      })
    },
    IS_AREA_COACH (context, orgUnitId) {
      return reqSetting('isAreaCoach', {
        orgUnitId
      })
    }
  }
}
