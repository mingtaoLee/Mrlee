/**
 * Created by Huangzp on 2017-1-17.
 */
import { formatDate } from 'utils/organization'
export default {
  data () {
    return {
      searchMonth: '',
      thisMonth: ''
    }
  },
  methods: {
        // 设置默认查询月份为上一个月
    getInitMonth () {
          // 获取当前月份
      let mon = new Date().getMonth()
          // 获取当前月份的7个字符串格式再转换为数组
      let initMonth = formatDate(new Date()).slice(0, 7).split('')
      if (mon === 0) {
            // 当月份为1月时
        let lastYear = (new Date().getFullYear() - 1).toString()
        initMonth.splice(0, 4, lastYear)
        initMonth.splice(2, 2, '12')
      } else if (mon === 9) {
            // 当月份为10月时
        initMonth.splice(5, 2, '09')
      } else if (mon > 0 && mon < 9) {
            // 当月份为2到9月时
        let lastMonth = (new Date().getMonth()).toString()
        initMonth.splice(6, 1, lastMonth)
      } else {
            // 当月份为11,12月时
        let lastMonth = (new Date().getMonth()).toString()
        initMonth.splice(5, 2, lastMonth)
      }
      this.searchMonth = initMonth.join('')
    },
    // 获取当前年月
    getThisMonth () {
      // this.thisMonth = new Date().toString()
      let yyyy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let MM = mm < 10 ? '0' + mm : mm
      this.thisMonth = yyyy + '-' + MM
    }
  }
}
