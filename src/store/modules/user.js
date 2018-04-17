import {getToken, setToken, removeToken} from '@/utils/auth'
import {jsonTree} from 'utils'
import { EDIT_PASSWORD_LINK } from 'config/api'
import req from 'api/common/user'
import fetch from 'utils/fetch'

export default {
  state: {
    token: getToken(),
    info: {},
    loginId: '',
    menus: null,
    accessRoutes: [],
    hasLogin: true,
    EDIT_PASSWORD_LINK
  },
  getters: {
    userId: (state) => {
      return state.info.empEmployeeId
    },
    MENUS_TREE: (state) => {
      return Array.isArray(state.menus)
      ? jsonTree(state.menus, {
        id: 'menuId',
        pid: 'parentMenuId',
        children: 'children'
      })
      : []
    },
    MENUS_MAP: (state) => {
      let map = {}
      if (Array.isArray(state.menus)) {
        state.menus.forEach(menu => {
          map[menu.menuAddress] = menu.menuId
        })
      }
      return map
    }
  },
  mutations: {
    SET_TOKEN: (state, value) => {
      state.token = value
      setToken(value)
    },
    SET_USERINFO: (state, value) => {
      state.info = value
    },
    SET_MENUS: (state, payload) => {
      state.menus = payload
    },
    SET_ACCESSROUTES: (state, payload) => {
      state.accessRoutes = payload
    },
    SET_HASLOGIN: (state, payload) => {
      state.hasLogin = payload
    },
    SET_EDITPASSWORDLINK: (state, payload) => {
      state.EDIT_PASSWORD_LINK = payload
    }
  },
  actions: {
    login: ({ commit }, { username = '', password = '', sid = '' }) => {
      return fetch({
        url: '/security/login',
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'ihrAdminAuthorization': sid
        },
        data: {
          username,
          password
        }
      }).then(data => {
        commit('SET_TOKEN', data)
        commit('SET_HASLOGIN', true)
      })
    },
    logout: ({commit}) => {
      return req('logout', {}, false).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        commit('SET_MENUS', null)
        commit('SET_ACCESSROUTES', [])
        commit('self/SET_MENUS', null)
        commit('self/SET_ACCESSROUTES', [])
        removeToken()
      })
    },
    getUserInfo: ({commit, state, getters}) => {
      return new Promise((resolve, reject) => {
        if (getters.userId) {
          resolve()
        } else {
          req('userInfo').then(data => {
            commit('SET_USERINFO', data)
            resolve()
          }, () => {
            reject()
          })
        }
      })
    },
    GET_MENUS: ({commit, dispatch}) => {
      return req('menus').then((data) => {
        commit('SET_MENUS', data)
      })
    },
    /**
     * 跟据菜单ID获取每个菜单路由的功能权限
     */
    GET_URLCODES: ({commit, dispatch, state, getters}, menu) => {
      if (menu.meta.subPage) {
        dispatch('FORMAT_ACCESS_MAP', sessionStorage.getItem('URLCODES') ? sessionStorage.getItem('URLCODES').split(',') : [])
        return Promise.resolve()
      }

      if (menu.matched && menu.matched.length) {
        let menuId = getters.MENUS_MAP[menu.matched[menu.matched.length - 1].path]
        if (menuId) {
          return req('urlCodes', {
            menuId
          })
          .then(data => {
            sessionStorage.setItem('URLCODES', data)
            dispatch('FORMAT_ACCESS_MAP', data)
          })
          .catch(() => {})
        } else {
          return Promise.resolve()
        }
      } else {
        return Promise.resolve()
      }
    },
    GET_EDITPASSWORDLINK: ({commit, state}) => {
      req('resetPwdUrl', {}, false).then(data => {
        commit('SET_EDITPASSWORDLINK', data)
      }).catch((err) => {
        console.warn('获取重设密码地址失败，将默认使用生产环境地址')
        throw new Error(err)
      })
    }
  }
}
