import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/index'
// import Admin from '@/components/admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/admin',
      name: '用户',
      component: require('@/components/admin')
    }
  ]
})
