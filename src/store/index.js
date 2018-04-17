import Vue from 'vue'
import Vuex from 'vuex'
import Promise from 'promise-polyfill'
import base from './modules/base'
import user from './modules/user'
import occupation from './modules/occupation'
import org from './modules/organization'
import employee from './modules/employee'
import performance from './modules/performance'
import recruit from './modules/recruit'
import flow from './modules/flow'
import iaf from './modules/iaf'
import access from './modules/access'
import self from './modules/self'

// 兼容IE
if (!window.Promise) {
  window.Promise = Promise
}

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    occupation,
    employee,
    performance,
    recruit,
    org,
    base,
    flow,
    iaf,
    access,
    self
  }
})
