/**
 * Created by Younh on 2018/2/27.
 */
import moment from 'moment'
// import { showMessage } from '../../utils'
// moment.locale('zh-cn')
export default {
  data () {
    return {
      // 判断当前表格是否处于初始化规则，以便更改动态规则
      isInitTableRules: false,
      isDateDisabled: false,
      isDateDisabledTax: false,
      effectOptions: {
        disabledDate: (time) => {
          return time.getTime() < moment().startOf('month').valueOf() || time.getTime() > Date.parse(this.form.uneffectiveDate)
        }
      },
      uneffectOptions: {
        disabledDate: (time) => {
          return time.getTime() <= Date.parse(this.form.effectiveDate) || time.getTime() < moment().startOf('month').valueOf()
        }
      }
    }
  },
  created () {
    this.setDateDisabled()
  },
  computed: {
  },
  watch: {
    // 'form.iitTemplateId' () {
      // this.setDateDisabled()
    // }
  },
  methods: {
    // 改变动态规则, 需要传入tableCell refs的name
    changeTableCellRules (...vmNameArr) {
      this.$nextTick(() => {
        this.isInitTableRules = true
        vmNameArr.forEach(v => {
          this.$refs[v].forEach(item => {
            if (item.col === 'itemType') {
              item.change()
            }
          })
        })
        this.isInitTableRules = false
      })
    },
    /** 将时效日期转为当前月份最后一天 */
    setUneffectiveDate (submitData) {
      const date = submitData.uneffectiveDate
      if (date) {
        submitData.uneffectiveDate = moment(date).endOf('month').valueOf() - 1000
      }
    },
    setDateDisabled () {
      if (this.form.effectiveDate) {
        this.isDateDisabled = this.form.effectiveDate.getTime() < moment().startOf('month').valueOf()
        this.isDateDisabledTax = this.form.effectiveDate.getTime() < moment().startOf('month').valueOf()
      }
      // this.isDateDisabled = !!this.form.bankTemplateId
      // this.isDateDisabledTax = !!this.form.iitTemplateId
    }
  }
}
