/**
 * Created by Administrator on 2017-10-18.
 */
import axios from 'utils/fetch'
export class Util {

  static fetNodeData (url) {
    let data = []
    // let data = sessionStorage.getItem(url)
    // if (data) return Promise.resolve(JSON.parse(data))
    return new Promise(resolve => {
      axios.get(url).then((res) => {
        if (res) {
          data = res
          sessionStorage.setItem(url, JSON.stringify(data))
          resolve(data)
        }
      })
    })
  }
  static proxyOpts (opts) {
    for (let [key, value] of Object.entries(opts)) {
      this[key] = value
    }
  }

  // 分时加载函数
  static batchLoad (arr, fn, num = 15, interval = 200, instance) {
    let time = 0
    let newArr = []
    let timer = null
    const start = function () {
      newArr = arr.splice(0, num)
      fn(newArr)
    }
    return function () {
      timer = setInterval(function () {
        time = interval
        if (arr.length === 0) {
          fn([])
          return clearInterval(timer)
        }
        instance.$nextTick(function () {
          start()
        })
      }, time)
    }
  }

  // 缓存函数
  static toCache (fn) {
    let cache = {}
    return function () {
      const key = Array.from(arguments).toString()
      if (key in cache) return cache[key]
      cache[key] = fn.apply(this, arguments)
      return cache[key]
    }
  }
}
