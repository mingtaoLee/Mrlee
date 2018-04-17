import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import { BASE_URL, EOLINKER_URL, TIMEOUT_MILLISECONDS, ERROR_MESSAGE } from 'config/api'
import { getToken } from '@/utils/auth'
import proxy from '../../config'
import store from '@/store'

var baseURL = EOLINKER_URL
if (process.env.NODE_ENV === 'development') {
  for (let ele in proxy.dev.proxyTable) {
    baseURL = proxy.dev.proxyTable[ele].changeOrigin ? ele : baseURL
  }
} else {
  baseURL = BASE_URL
}
const instance = axios.create({
  baseURL,
  timeout: TIMEOUT_MILLISECONDS,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  const Token = getToken()
  config.headers = Object.assign({'ihrAdminAuthorization': Token}, config.headers)
  if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json' && config.headers['Content-Type'] !== 'multipart/form-data') {
    config.data = qs.stringify(config.data)
  }
  return config
})

instance.interceptors.response.use(response => response.data, err => {
  if (err.response) {
    const { status, data } = err.response
    if (data.message && status >= 500) {
      let msg = /[\u4e00-\u9fa5]+?.*[\u4e00-\u9fa5]+?/.exec(data.message)
      if (msg && msg[0]) {
        Message({
          type: 'error',
          message: data.message
        })
      } else {
        Message({
          type: 'error',
          message: ERROR_MESSAGE
        })
      }
    }

    if (status === 401) window.location.href = '/'

    if (status === 403) store.commit('SET_HASLOGIN', false)

    return Promise.reject(err.response.data)
  } else {
    if (err.message === `timeout of ${TIMEOUT_MILLISECONDS}ms exceeded`) {
      Message({
        type: 'error',
        message: ERROR_MESSAGE
      })
    }
    return Promise.reject(err)
  }
})

export default instance
