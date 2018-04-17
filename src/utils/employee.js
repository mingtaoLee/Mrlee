
/**
 * @param {*后端数据数组} tableArr
 * @param {*修改参数数组} dateArr
 * @param {*是否具体到秒标志} toMi
 */
export function formatTableDate (tableArr, dateArr, toMi = false) {
  tableArr.map(item => {
    dateArr.map(val => {
      if (item[val]) {
        let date = formatDateToMi(new Date(item[val]))
        item[val] = toMi ? date.mi : date.da
      }
      // (item[val]) && (item[val] = new Date(parseInt(item[val])).toLocaleString().substr(0, toMi).replace(/\//g, '-'))
    })
  })
}

export function formatDateToMi (date, to = false) {
  const year = ('0000' + date.getFullYear()).slice(-4)
  const month = ('00' + (date.getMonth() + 1)).slice(-2)
  const dat = ('00' + date.getDate()).slice(-2)
  const hour = ('00' + date.getHours()).slice(-2)
  const minute = ('00' + date.getMinutes()).slice(-2)
  const second = ('00' + date.getSeconds()).slice(-2)
  let da = `${year}-${month}-${dat}`
  let mi = `${year}-${month}-${dat} ${hour}:${minute}:${second}`
  let c = `${year}年${month}月${dat}日`
  return {da, mi, c}
}
