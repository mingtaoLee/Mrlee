/**
 * Created by ZHANZF on 2017-12-2.
 * 基本搜索日期mixin
 */
import moment from 'moment'
// moment.locale('zh-cn')
export default {
  data () {
    return {
      effectStartOptions: {
        disabledDate: (time) => {
          if (!this.searchParam.effectiveDateEnd) return false
          return time.getTime() > Date.parse(this.searchParam.effectiveDateEnd) - 3600 * 1000 * 24
        }
      },
      effectEndOptions: {
        disabledDate: (time) => {
          if (!this.searchParam.effectiveDateStart) return false
          return time.getTime() < Date.parse(this.searchParam.effectiveDateStart) - 3600 * 1000 * 24
        }
      },
      effectOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.parse(this.searchParam.uneffectiveDate) - 3600 * 1000 * 24
        }
      },
      uneffectOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.parse(this.searchParam.effectiveDate)
        }
      }
    }
  },
  methods: {
    handleEffectiveDateChange (value) {
      this.searchParam.effectiveDate = value ? moment(value).format('YYYY-MM-DD') : ''
    },
    handleUneffectDateChange (value) {
      this.searchParam.uneffectiveDate = value ? moment(value).format('YYYY-MM-DD') : ''
    },
    handleEffectiveDateStartChange (value) {
      this.searchParam.effectiveDateStart = value ? moment(value).format('YYYY-MM-DD') : ''
    },
    handleEffectiveDateEndChange (value) {
      this.searchParam.effectiveDateEnd = value ? moment(value).format('YYYY-MM-DD') : ''
    }
  }
}
