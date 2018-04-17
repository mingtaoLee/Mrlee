// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '../init'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import './permission.js'

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
