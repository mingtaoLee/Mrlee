import NProgress from 'nprogress'
import router, { asyncRoutes } from './router'
import store from '@/store'
import { getToken, filterRoutes, resetRedirect } from 'utils/auth'
import { clone } from 'utils/index'

function loadRoutes () {
  return store.dispatch('self/GET_MENUS')
  .then(() => {
    let accessMenus = clone(asyncRoutes)[0]
    let accessRoutes = filterRoutes(store.state.self.menus, accessMenus.children)
    resetRedirect(accessRoutes)
    accessMenus.children = accessRoutes

    store.commit('self/SET_ACCESSROUTES', accessRoutes)
    router.addRoutes([accessMenus])
  })
}

router.beforeEach((to, from, next) => {
  if (to.name) document.title = to.name
  if (to.path !== '/login') {
    NProgress.start()
    if (getToken()) {
      if (!store.state.self.menus) {
        loadRoutes()
        .then(() => {
          next({...to, replace: true})
        })
        .catch(() => {
          next({path: '/login'})
        })
      } else {
        next()
      }
    } else {
      next({path: `/login?url=${to.path}`})
    }
  } else {
    next()
  }
})
// router.addRoutes([asyncMenus])
