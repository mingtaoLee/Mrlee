import ajax from 'utils/fetch.js'
import axios from 'axios'
import moment from 'moment'
import { MessageBox, Message } from 'element-ui'
import { BASE_URL } from '@/config/api'
import { createTokenInput } from 'utils/auth'
/**
 * 对象数组的深度拷贝.
 * obj是原数组
 */
export const clone = function (obj) {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj.constructor === Date) return new Date(obj)
  if (obj.constructor === RegExp) return new RegExp(obj)
  // eslint-disable-next-line
  let constructor = obj.constructor()
  var newObj = new obj.constructor()  // 保持继承链
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {   // 不遍历其原型链上的属性
      var val = obj[key]
      newObj[key] = typeof val === 'object' ? clone(val) : val
    }
  }
  return newObj
}

/**
 * 把扁平化的数据转为成结构化的数据
 * @param {*} data []
 * @param {*} config{id: 数据里的string类型,pid: 数据里的父id string类型,children: 生成结果中子节点的字段名 string类型}
 */
export const jsonTree = function (data, config) {
  let id = config.id || 'id'
  let pid = config.pid || 'pid'
  let children = config.children || 'children'

  let idMap = []
  let jsonTree = []
  let newData = JSON.parse(JSON.stringify(data))

  newData.forEach(v => {
    idMap[v[id]] = v
  })

  newData.forEach(v => {
    let parent = idMap[v[pid]]
    if (parent) {
      !parent[children] && (parent[children] = [])
      parent[children].push(v)
    } else {
      jsonTree.push(v)
    }
  })
  return jsonTree
}

/**
 * transformToQueryUrl: 将url转换成查询参数类型的url
 * @param url {string}
 * @param params {object}
 * @returns {string}
 */
export function transformToQueryUrl (url, params) {
  let query = ''
  if (params && Object.keys(params).length > 0) {
    query = '?'
    let count = 1
    for (let ele in params) {
      if (count < Object.keys(params).length) {
        query += (ele + '=' + params[ele] + '&')
        count++
      } else {
        query += (ele + '=' + params[ele])
      }
    }
  }
  return url + query
}

/**
 * 根据传入url及传递参数，跳转到对应的网页
 * @param {string} url 路径
 * @param {*} params 参数
 */
export function windowOpen (url, params, target) {
  var el = document.createElement('a')
  document.body.appendChild(el)
  el.href = transformToQueryUrl(url, params)
  el.target = target ? '_self' : '_blank'
  var e = document.createEvent('MouseEvents')
  e.initEvent('click', true, true)
  el.dispatchEvent(e)
  document.body.removeChild(el)
  // window.open(url + query)
}

/**
 * getSelectData(): 获取下拉列表数据，如果已经从后台拉取过则从本地获取
 * @param {String} url: 接口地址
 * @return {Promise} promise: 回调的第一个参数为列表数据
 */
export function getSelectData (url, isCache) {
  let data = sessionStorage.getItem(url)
  if (data) return Promise.resolve(JSON.parse(data))
  return new Promise((resolve, reject) => {
    ajax.get(url).then((res) => {
      if (res) {
        data = res
        isCache && sessionStorage.setItem(url, JSON.stringify(data))
        resolve(data)
      }
    }).catch(err => reject(err))
  })
}

/**
 * getDict(): 获取字典数据，如果已经从后台拉取过则从本地获取
 * @param {String} dictCode: 字典地址参数
 * @return {Promise} promise: 回调的第一个参数为字典数据
 */
export function getDict (dictCode) {
  return getSelectData(`/public-access/dicts/${dictCode}/items`, true)
}

/**
 * dictFormat(): 将后端返回的数据通过字典转换
 * @param {String,Array} dictCode: 字典名称,或者实际字典
 * @param {Sting, Number} value: 需要改动的值
 * @return {String} 匹配到字典里的对应数据
 */
export function dictFormat (dictCode, value) {
  if (typeof dictCode === 'string') {
    return new Promise(resolve => {
      getDict(dictCode).then(data => {
        resolve(findDictLabel(data, value))
      })
    })
  } else if (dictCode instanceof Array) {
    if (value) {
      return Promise.resolve(findDictLabel(dictCode, value))
    } else {
      let promises = dictCode.map(dict => {
        return new Promise(resolve => {
          dictFormat(dict.dictCode, dict.value).then(data => {
            resolve(data)
          })
        })
      })
      return new Promise(resolve => {
        Promise.all(promises).then(values => {
          resolve(values)
        })
      })
    }
  }
}

export function findDictLabel (dict, value) {
  if (dict) {
    for (let i of dict) {
      if (i.value === value) {
        return i.label
      }
    }
  }
}

/**
 * once(): 一次性执行函数封装方法
 * @param fn{Function}
 * @returns {Function}
 */
export function once (fn) {
  let called = false
  return function () {
    if (!called) {
      fn.apply(this, arguments)
      called = true
    }
  }
}

/**
 * confirmPopover(): 确认提醒模态弹窗
 * @param type{String} 提示类型
 * @param contentText{String} 提示字段
 * @param successFn{Function} 成功回调
 * @param failFn{Function} 失败回调
 */
export function confirmPopover (type, contentText, successFn, failFn) {
  MessageBox.confirm(contentText, '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: type
  }).then(() => {
    successFn && successFn()
  }).catch(() => {
    failFn && failFn()
  })
}

/**
 * showMessage()：消息提示
 * @param type{String} 提示类型
 * @param contentText{String} 提示字段
 */
export function showMessage (type, contentText) {
  Message({
    showClose: false,
    message: contentText,
    type: type,
    duration: 3000
  })
}

/**
 * proxy()：参数重定向方法
 * @param opts{Object}
 */
export function proxy (opts) {
  for (let [key, value] of Object.entries(opts)) {
    this[key] = value
  }
}

/**
 * getRule(): 获取校验方法
 * @param message{String} 提示字段
 * @param trigger{String} 发事件
 * @param type{String} 校验字段类型
 * @returns {{required: boolean, type: string, message: *, trigger: string}}
 */
export function getRule (message, trigger = 'blur', type = 'string') {
  return { required: true, type: type, message: message, trigger: trigger }
}

/**
 * currencyFormat: 价钱格式转换方法
 * @param value{String|Number} 价格数据
 * @param symbol{String} 货币标志
 * @returns {string}
 */
export function currencyFormat (value, symbol = '￥') {
  value = parseFloat(value)
  return value ? symbol + value.toFixed(2) : '￥0.00'
}

/**
 * createRescissibleReq: 创建可取消重复多次请求的请求方法
 * @param req {Function}：api中import的当前页面数据请求方法
 * @returns {Function}
 */

export function createRescissibleReq (req) {
  if (!req || !(req instanceof Function)) {
    throw new Error('传入请求函数错误，请检查！')
  }

  const CancelToken = axios.CancelToken
  let name = ''
  let cancel = null

  return function () {
    let args = Array.from(arguments)
    const key = args.shift()

    if (name === key) {
      cancel('取消请求')
    }

    name = key

    const options = args.pop()
    return req(name, {...options, cancelToken: new CancelToken((c) => { cancel = c })})
  }
}

export function dateFormat (value, format = 'YYYY-MM-DD') {
  return value ? moment(value).format(format) : ''
}

/**
 * 导出表格函数
 * @param {*} url url地址
 * @param {*} params 参数
 */
export function exportTable (url, params) {
  const form = document.createElement('form')
  const formConfig = {
    action: BASE_URL + url,
    method: 'get',
    type: 'hidden'
  }

  for (let config in formConfig) {
    form.setAttribute(config, formConfig[config])
  }
  for (let param in params) {
    const input = document.createElement('input')
    input.setAttribute('name', param)
    input.setAttribute('value', params[param])
    form.appendChild(input)
  }
  // 永辉生产环境上可能会过滤cookie, 所以需要用这种方式传递Token
  form.appendChild(createTokenInput())

  document.body.appendChild(form)
  form.submit()
  form.remove()
}

/**
 * checkNum(): 表单数字的一般校验
 * @param  str{String} 未输入的提示文本
 * @param  length{Number} 限制的长度
 * @param  max{Number} 限制最大值
 * @param  isPositive{Boolean} 是否只为正数
 */

export function checkNum (str, length = 5, max, isPositive = true) {
  return (rule, value, callback) => {
    if (str && !value) {
      return callback(new Error(str))
    } else if (max && value > max) {
      return callback(new Error(`输入的数不能大于${max}`))
    } else {
      if (isPositive && value < 0) {
        return callback(new Error('输入不能为负数'))
      } else if (value && String(value).length > length) {
        return callback(new Error('输入数字过长'))
      } else {
        callback()
      }
    }
  }
}

/**
 * 计算表格的data数据，添加combinePropsRowspan和combineProps属性，用于表格的行合并操作
 * @param arr 传入的表格data数据，注意：会改变data的结构，添加combinePropsRowspan和combineProps属性
 * @param prop 要合并的列prop，如[{name:1,age:2},{name:1,age:2}]中，要合并name的话，prop就传name
 * @example calIntervalArr([{name:1,age:2},{name:1,age:2}],'name') 结果[{name:1,age:2,combineProps:'name',combinePropsRowspan:2},{name:1,age:2}]
 */
export function calIntervalArr (arr = [], prop = '') {
  let len = arr.length

  if (len > 1) {
    let lastIndex = null
    arr.forEach((v, i) => {
      v.hasOwnProperty('combineProps') && (delete v.combineProps)
      v.hasOwnProperty('combinePropsRowspan') && (delete v.combinePropsRowspan)
      if (i === 0) {
        v.combineProps = prop
        v.combinePropsRowspan = 1
        lastIndex = 0
      } else {
        if (v[prop] !== arr[i - 1][prop]) {
          v.combineProps = prop
          v.combinePropsRowspan = 1
          arr[lastIndex].combinePropsRowspan = i - lastIndex
          lastIndex = i
        }
        if (v[prop] === arr[i - 1][prop] && i === len - 1) {
          arr[lastIndex].combinePropsRowspan = i - lastIndex + 1
        }
      }
    })
  }
}

/**
 * 根据combinePropsRowspan和combineProps属性判断返回rowspan和colspan值，用于表格
 * 的span-method中，要配合calIntervalArr使用
 * @param row span-method中的row
 * @param column span-method中的column
 * @param rowIndex span-method中的rowIndex
 * @param columnIndex span-method中的columnIndex
 * @returns {rowspan,colspan}
 */
export function handleCombinePropsCondition ({ row, column, rowIndex, columnIndex }) {
  if (row.combineProps && row.combinePropsRowspan > 1) {
    return {
      rowspan: row.combinePropsRowspan,
      colspan: 1
    }
  } else if (row.combineProps && row.combinePropsRowspan < 2) {
    return {
      rowspan: 1,
      colspan: 1
    }
  } else {
    return {
      rowspan: 0,
      colspan: 0
    }
  }
}
