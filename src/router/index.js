import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/page/index'
import Home from '@/view/page/home'
// import addPage from '@/view/add'
// import deletePage from '@/view/delete'
// import changePage from '@/view/change'
// import updatePage from '@/view/update'
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
          // children:[
          //   {
          //     path: '/',
          //     name: 'Add',
          //     component: addPage,
          //   },
          //   {
          //     path: 'deletePage',
          //     name: 'Delete',
          //     component: deletePage,
          //   },
          //   {
          //     path: 'changePage',
          //     name: 'Achange',
          //     component: changePage,
          //   },
          //   {
          //     path: 'updatePage',
          //     name: 'Update',
          //     component: updatePage,
          //   }
          // ]
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
