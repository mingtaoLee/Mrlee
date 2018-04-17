/**
 *获取id数组
 * @export
 * @param {array} arr 对象数组
 * @returns {array} id数组
 */

export const selectMutiId = function (arr, id) {
  let idArray = arr.map(function (value, index) {
    return value[id]
  })
  return idArray
}
/**
 *过滤id数组
 * @export
 * @param {array} idArray id数组
 * @param {array} List 渲染列表数组
 * @param {string} type - 操作的类型
 */
export const filterId = function (idArray, List, id, type) {
  for (let i = 0; i < List.length; i++) {
    if (idArray.indexOf(List[i][id]) !== -1) {
      if (type === 'delete') {
        List.splice(i, 1)
        i--
      } else if (type === 'disable') {
        List[i].status = 0
      } else if (type === 'enable') {
        List[i].status = 1
      }
    }
  }
}
/**
 *日期自动选择
 * @export
 * @param {Date} startDate 开始日期
 * @param {number} skip 跳转范围
 * @return {Date} 获取的时间
 */
export const dateAutoSelect = function (startDate, skip) {
  let date = new Date(startDate.getTime())
  let month = date.getMonth() + skip + 1
  let year = date.getFullYear()
  let day = date.getDate()
  if (month > 12) {
    year = parseInt(year) + parseInt((parseInt(month) / 12 === 0 ? 1 : parseInt(month) / 12))
    month = parseInt(month) % 12
  }
  let date2 = new Date(year, month, 0)
  date2 = date2.getDate()
  if (day > date2) {
    day = date2
  }
  let cacheDate = new Date()
  cacheDate.setDate(day)
  cacheDate.setMonth(month - 1)
  cacheDate.setYear(year)
  return cacheDate
}

/**
 *校验全部空格
 * @export
 * @param eleme自定义参数 rule, value, callback
 */

export const spaceValidate = (rule, value, callback) => {
  let reg = /^\s+$/
  reg.test(value) ? callback(new Error('全部为空格')) : callback()
}

/**
 *对象数组校验是否有重复对象
 * @export
 * @param arr 需要比较的数组
 * @param target 目标对象
 * @param key 根据此属性判断是否重复
 */

export const compare = (arr, target, key) => {
  if (typeof target === 'object') {
    var {key: value = null} = {target}
  } else {
    value = target
  }
  let result = false
  for (let i of arr) {
    if (value !== null && value === i[key]) {
      result = true
      break
    }
  }
  return result
}

