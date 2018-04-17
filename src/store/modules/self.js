import req from 'api/self/user'
import {jsonTree} from 'utils'

export default {
  namespaced: true,
  state: {
    menus: null,
    accessRoutes: [],
    status: 0
  },
  getters: {
    MENUS_MAP: (state) => {
      let map = {}

      if (Array.isArray(state.menus)) {
        state.menus.forEach(menu => {
          map[menu.menuAddress] = menu.menuId
        })
      }

      return map
    },
    MENUS_TREE: (state) => {
      if (Array.isArray(state.menus)) {
        return jsonTree(state.menus, {
          id: 'menuId',
          pid: 'parentMenuId',
          children: 'children'
        })
      }

      return []
    }
  },
  mutations: {
    SET_MENUS: (state, payload) => {
      state.menus = payload
    },
    SET_ACCESSROUTES: (state, payload) => {
      state.accessRoutes = payload
    },
    SET_STATUS: (state, payload) => {
      state.status += payload
    }
  },
  actions: {
    GET_MENUS: ({commit}, payload) => {
      return req('getDefaultMenus').then(data => {
        commit('SET_MENUS', data)
      })
    },
    GET_STATUS: (store, val) => {
      store.commit('SET_STATUS', val)
    }
  }
}
