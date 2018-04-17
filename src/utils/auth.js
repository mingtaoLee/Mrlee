import Cookies from 'js-cookie'
import { AUTHORIZATION_KEY } from 'config/api'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false, ease: 'ease', speed: 500 })// 关闭进度环,调整进度条速度
import 'nprogress/nprogress.css'// Progress 进度条样式
import store from '@/store'
const Token = 'Token'

export function getToken () {
  return Cookies.get(Token)
}

export function setToken (token) {
  return Cookies.set(Token, token)
}

export function removeToken () {
  return Cookies.remove(Token)
}

/**
 * 生成一个传递Token的input
 */
export function createTokenInput () {
  // 永辉生产环境上可能会过滤cookie, 所以需要用这种方式传递Token
  const input = document.createElement('input')
  input.setAttribute('type', 'hidden')
  input.setAttribute('name', AUTHORIZATION_KEY)
  input.setAttribute('value', getToken())
  return input
}
/**
 * 递归路由表过滤出有权限的路由
 * @param {Array} roleMenus 远程返回的菜单
 * @param {Array} asyncMenus 代码中配置的路由表
 */
export function filterRoutes (roleMenus, asyncMenus, parent = {}) {
  let result = asyncMenus.filter(menu => {
    // 隐藏菜单不过滤
    if (menu.hide) return true

    if (roleMenus.findIndex(roleMenu => {
      if (menu.children && menu.children.length) {
        return roleMenu.menuAddress === menu.path
      } else {
        return menu.path[0] === '/' ? roleMenu.menuAddress === menu.path : roleMenu.menuAddress === `${parent.path}/${menu.path}`
      }
    }) > -1) {
      if (menu.children && menu.children.length) {
        menu.children = filterRoutes(roleMenus, menu.children, menu)
      }
      return true
    } else {
      return false
    }
  })
  return result
}

/**
 * 根据权限过滤出的菜单递归设置父级菜单的redirect
 * @param {Array} routes
 */
export function resetRedirect (routes) {
  /**
   * 是否有有效子菜单
   * @param {object} menu
   */
  let hasValidChildren = (menu) => {
    if (Array.isArray(menu.children)) {
      return menu.children.some((element) => {
        return !element.hide
      })
    }
    return false
  }

  routes.forEach(route => {
    if (hasValidChildren(route)) {
      let path = route.children.find(menu => {
        return menu.meta ? !menu.meta.subPage : true
      }).path
      route.redirect = path[0] === '/' ? path : `${route.path}/${path}`
      resetRedirect(route.children)
    }
  })
}

export function checkAuth (to, from, next) {
  if (to.name) document.title = to.name
  if (to.path !== '/login') {
    let progress = document.getElementById('n-progress-control')
    if (progress) {
      NProgress.configure({ parent: '#n-progress-control' })// 挂载位置调整
    } else {
      NProgress.configure({ parent: 'body' })// 挂载位置调整
    }
    NProgress.start()
    if (getToken()) {
      next()
    } else {
      next({path: `/login?url=${to.path}`})
    }
  } else {
    next()
  }
}

export function getInfo (to, from, next, checkAdminAuth = false) {
  if (from && from.path !== '/login' && from.path !== '/') {
    store.commit('SET_PARENTROUTE', from)
  }

  if (to.path !== '/login') {
    store.dispatch('getUserInfo').then(() => {
      if (checkAdminAuth && store.state.user.info.empSelfAuth) {
        window.location.href = '/self.html'
      }
    }, () => {
      console.log('获取个人信息失败')
    })
  }
  NProgress.done()
}
