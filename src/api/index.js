import fetch from '../utils/fetch'
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
const CancelToken = axios.CancelToken

export default (function request () {
  let name = ''
  let cancel = null

  return function () {
    let args = Array.from(arguments)

    const config = args[0]
    const funcName = args[1]
    const data = args[2]
    const isToken = args[3]
    const isCancel = args[4]

    if (isCancel && (name === funcName)) {
      cancel(`请求${name}被阻断，请检查是否重复发送同一请求，如需取消重复请求阻断，请配置api中isCancel为false`)
    }

    name = funcName

    if (typeof config[funcName] !== 'object') {
      throw new Error('调用api函数函数错误，请检查函数名称是否错误')
    }
    var newConfig = JSON.parse(JSON.stringify(config[funcName]))
    if (data) {
      if (config[funcName].method === 'get' || config[funcName].method === 'delete' || config[funcName].method === undefined) {
        newConfig.url = newConfig.url.replace(/\{([\d\w_]+)\}/g, (word, $1) => {
          var res = data[$1]
          // 删除data中的对应字段
          delete data[$1]
          return res
        })
        newConfig.params = data
      } else {
        newConfig.url = newConfig.url.replace(/\{([\d\w_]+)\}/g, (word, $1) => {
          var res = data[$1]
          // 删除data中的对应字段
          delete data[$1]
          return res
        })
        newConfig.data = data
      }
    }
    if (isToken) {
      const Token = getToken()
      newConfig.headers = Object.assign({'ihrAdminAuthorization': Token}, newConfig.headers)

      if (!Token) {
        store.commit('SET_HASLOGIN', false)
        return Promise.reject('获取不到Token')
      }
    }
    if (isCancel) {
      newConfig.cancelToken = new CancelToken((c) => { cancel = c })
    }
    return fetch(newConfig)
  }
})()
