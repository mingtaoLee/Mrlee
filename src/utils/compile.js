import moment from 'moment'
import {clone} from './index'
/**
 * 高级搜索功能的过滤参数方法, 目前仅过滤空值和时间格式
 * @param {Object} oldParams 搜索的参数
 * @param {Object} otherParams 需要拼接的参数
 * @param {Object} options 特定类型的格式配置 类似需要格式话属性名称为year为'yyyy'
 */
export function filter (oldParams, otherParams, options) {
  const isObj = item => Object.prototype.toString.call(item) === '[object Object]'
  const isVoid = item => {
    if (!item) {
      return false
    } else if (Array.isArray(item)) {
      return item.length !== 0
    } else if (isObj(item)) {
      return Object.hasOwnProperty(item)
    } else {
      return true
    }
  }
  var newParams = null
  var params = clone(oldParams)
  // 过滤参数
  if (params && isObj(params)) {
    newParams = {}
    Object.keys(params).map(key => {
      // 过滤非空
      if (isVoid(params[key])) {
        // 过滤时间格式
        if (params[key] instanceof Date) {
          if (options && options[key]) {
            params[key] = moment(new Date(params[key])).format(options[key])
          } else {
            params[key] = moment(params[key]).format('YYYY-MM-DD HH:mm:ss')
          }
        }
        // 过滤数组，把数组转成字符串
        if (params[key] instanceof Array) {
          params[key] = params[key].join(',')
        }
        // 递归过滤
        if (Object.prototype.toString.call(params[key]) === '[object Object]') {
          params[key] = filter(params[key])
        }
        newParams[key] = params[key]
      }
    })
  }
  // 拼接参数
  if (otherParams && params instanceof Object) {
    Object.keys(otherParams).map(key => {
      if (otherParams[key]) {
        // 递归过滤
        if (otherParams[key] instanceof Object) {
          otherParams[key] = filter(otherParams[key])
        }
        newParams[key] = otherParams[key]
      }
    })
  }
  return newParams
}

/**
 * 编制模块弹框过滤方法
 * @param {Object} obj 需要过滤的参数
 * @param {Object} options 需要替换的参数
 * orgs: '123,123,345' ===> orgs: [{newName: 123}, {newName: 123}]
 * orgs: [123,123,345] ===> orgs: [{newName: 123}, {newName: 123}]
 */
export const objReplaceAttr = (obj, options) => {
  const isString = data => typeof data === 'string'
  const isArray = data => Array.isArray(data)
  const format = (data, key) => {
    return data.map(item => {
      return {[key]: item}
    })
  }
  var newObj = clone(obj)
  Object.keys(options)
  // 过滤无效字段
  .filter(arrKey => newObj[arrKey] && (isString(newObj[arrKey]) || isArray(newObj[arrKey])))
  // 替换对象里面对应字段的值
  .map(arrKey => {
    newObj[arrKey] = isString(newObj[arrKey]) ? format(newObj[arrKey].split(','), options[arrKey]) : format(newObj[arrKey], options[arrKey])
  })
  return newObj
}

export {clone}
