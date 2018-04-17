import NProgress from 'nprogress'
import router, { asyncRoutes } from './router'
import store from '@/store'
import { getToken, filterRoutes, resetRedirect } from 'utils/auth'
import { clone } from 'utils/index'

import Layout from 'components/common/layout/layout'
import Blank from 'components/common/layout/blank'
const FormReport = () => import('./pages/form-center/report')

/**
 * 动态添加报表中心菜单
 * @param {Array} accessRoutes
 */
function handleFormCenter (accessRoutes) {
  let menusTree = store.getters.MENUS_TREE
  if (Array.isArray(menusTree)) {
    let formCenter = menusTree.find(menu => {
      return menu.menuAddress === '/form_center'
    })
    if (formCenter) {
      accessRoutes.push(setFormCenterRoute(formCenter))
    }
  }
}

/**
 * 动态生成报表中心下的路由
 * @param {Object} route
 * @param {number} level 菜单层级
 * @param {string} parentPath 父级菜单路径
 */
function setFormCenterRoute (route, level = 1, parentPath = '') {
  let children = []
  let component = level === 1 ? Layout : FormReport
  let path = level === 1 ? '/form_center' : parentPath + '/' + encodeURIComponent(encodeURIComponent(route.menuAddress))
  if (route.children && route.children.length) {
    if (level > 1) {
      component = Blank
    }
    children = route.children.map(child => {
      return setFormCenterRoute(child, level + 1, path)
    })
  } else {
    // 叶子菜单路由特殊处理
    if (level > 2) path = encodeURIComponent(encodeURIComponent(route.menuAddress))
  }
  let result = {
    path,
    name: route.menuName,
    component
  }
  if (children.length) result.children = children
  return result
}

function loadRoutes () {
  return store.dispatch('GET_MENUS')
  .then(() => {
    let accessMenus = clone(asyncRoutes)[0]
    let accessRoutes = filterRoutes(store.state.user.menus, accessMenus.children)
    handleFormCenter(accessRoutes)
    resetRedirect(accessRoutes)
    accessMenus.children = accessRoutes

    store.commit('SET_ACCESSROUTES', accessRoutes)
    router.addRoutes([accessMenus])
  })
}

router.beforeEach((to, from, next) => {
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
      // let urlCodesPath = to.meta.subPage ? from : to
      let urlCodesPath = to
      store.dispatch('GET_URLCODES', urlCodesPath).then(() => {
        if (!store.state.user.menus) {
          loadRoutes()
          .then(() => {
            store.dispatch('GET_URLCODES', urlCodesPath)
            .then(() => {
              next({...to, replace: true})
            })
            .catch(() => {
              next({...to, replace: true})
            })
          }, (err) => {
            console.error(err)
            // Message({
            //   type: 'error',
            //   message: '该用户还没进行角色赋权'
            // })else {
            next({path: '/login'})
          })
          .catch(() => {
            next({path: '/login'})
          })
        } else {
          next()
        }
      })
    } else {
      next({path: `/login?url=${to.path}`})
    }
  } else {
    next()
  }
})
