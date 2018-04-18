import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/index'
import Home from '@/view/home'
// import Admin from '@/components/admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children:[
        {
          path: '/',
          name: 'Home',
          component: Home,
        }
      ]
    },
    {
      path: '/admin',
      name: '用户',
      component: require('@/components/admin')
    }
  ]
})
