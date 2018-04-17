import moment from 'moment'
import Vue from 'vue'
export const dateFormat = (value, format = 'YYYY-MM-DD') => {
  if (value) {
    return moment(value).format(format)
  } else {
    return ''
  }
}
Vue.filter('dateFilter', function (value, format = 'YYYY-MM-DD') {
  return value ? moment(value).format(format) : ''
})
