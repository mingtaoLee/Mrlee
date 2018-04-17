/**
 *格式化timStamp
 *将timeStamp格式转换为 yyyy-MM-dd HH-mm-ss 格式
 * @return dateString 字符串
 */
export const formatDate = function (timeStamp) {
  if (timeStamp) {
    let date = new Date(timeStamp)
    let dateString = ''
    let yyyy = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = formatTen(MM)
    let dd = date.getDate()
    dd = formatTen(dd)
    let HH = date.getHours()
    HH = formatTen(HH)
    let mm = date.getMinutes()
    mm = formatTen(mm)
    let ss = date.getSeconds()
    ss = formatTen(ss)
    dateString = yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss
    return dateString
  } else {
    return '- -'
  }

  function formatTen (num) {
    if (num < 10) {
      num = '0' + num
    }
    return num
  }
}
