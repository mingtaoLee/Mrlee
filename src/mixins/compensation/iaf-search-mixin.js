/**
 *
 * 基本搜索日期mixin
 */
import moment from 'moment'
export default {
  data () {
    let getDisableDateStart = (searchParam, searchDateName) => {
      return {
        disabledDate: (time) => {
          if (!this[searchParam][searchDateName]) return false
          return time.getTime() > Date.parse(this[searchParam][searchDateName])
        }
      }
    }
    let getDisableDateEnd = (searchParam, searchDateName) => {
      return {
        disabledDate: (time) => {
          if (!this[searchParam][searchDateName]) return false
          return time.getTime() < Date.parse(this[searchParam][searchDateName]) - 3600 * 1000 * 24
        }
      }
    }
    return {
      multipleColumns: {},
      payMonth: getDisableDateStart('dialogForm', 'payEndMonth'),
      payEndMonth: getDisableDateEnd('dialogForm', 'payMonth'),
      startMonthOptions: getDisableDateStart('searchData', 'endMonth'),
      endMonthOptions: getDisableDateEnd('searchData', 'startMonth'),
      startMonthTwoOptions: getDisableDateStart('addFormData', 'endMonth'),
      endMonthTwoOptions: getDisableDateEnd('addFormData', 'startMonth'),
      effectStartOptions: getDisableDateStart('searchParam', 'effectiveDateEnd'),
      effectEndOptions: getDisableDateEnd('searchParam', 'effectiveDateStart'),
      uneffectStartOptions: getDisableDateStart('searchParam', 'uneffectiveDateEnd'),
      uneffectEndOptions: getDisableDateEnd('searchParam', 'uneffectiveDateStart'),
      executeStartOptions: getDisableDateStart('searchParam', 'executeDateEnd'),
      executeEndOptions: getDisableDateEnd('searchParam', 'executeDateStart'),
      hireStartDateOptions: getDisableDateStart('params', 'hireEndDate'),
      hireEndDateOptions: getDisableDateEnd('params', 'hireStartDate'),
      hireStartDateTwoOptions: getDisableDateStart('searchData', 'hireEndDate'),
      hireEndDateTwoOptions: getDisableDateEnd('searchData', 'hireStartDate'),
      startEffectOptions: getDisableDateStart('searchParam', 'endEffectiveDate'),
      endEffectOptions: getDisableDateEnd('searchParam', 'startEffectiveDate'),
      effectiveStartDateOptions: getDisableDateStart('searchData', 'effectiveEndDate'),
      effectiveEndDateOptions: getDisableDateEnd('searchData', 'effectiveStartDate'),
      uneffectiveStartDateOptions: getDisableDateStart('searchData', 'uneffectiveEndDate'),
      uneffectiveEndDateOptions: getDisableDateEnd('searchData', 'uneffectiveStartDate'),
      dimissionDateStartOptions: getDisableDateStart('searchData', 'dimissionDateEnd'),
      dimissionDateEndOptions: getDisableDateEnd('searchData', 'dimissionDateStart'),
      dimissionStartTimeOptions: getDisableDateStart('searchData', 'dimissionEndTime'),
      dimissionEndTimeOptions: getDisableDateEnd('searchData', 'dimissionStartTime'),
      payStartDateOptions: getDisableDateStart('searchData', 'payEndDate'),
      payEndDateOptions: getDisableDateEnd('searchData', 'payStartDate'),
      payStartMonthOptions: getDisableDateStart('searchData', 'payEndMonth'),
      payEndMonthOptions: getDisableDateEnd('searchData', 'payStartMonth'),
      attritionStartDateOptions: getDisableDateStart('searchData', 'attritionEndDate'),
      attritionEndDateOptions: getDisableDateEnd('searchData', 'attritionStartDate'),
      increaseDateStartOptions: getDisableDateStart('searchData', 'increaseDateEnd'),
      increaseDateEndOptions: getDisableDateEnd('searchData', 'increaseDateStart'),
      startUneffectOptions: getDisableDateStart('searchParam', 'endUneffectiveDate'),
      endUneffectOptions: getDisableDateEnd('searchParam', 'startUneffectiveDate'),
      openingDateStartOptions: getDisableDateStart('searchParam', 'openingDateEnd'),
      openingDateEndOptions: getDisableDateEnd('searchParam', 'openingDateStart'),
      increaseStartDateOptions: getDisableDateStart('searchData', 'increaseEndDate'),
      increaseEndDateOptions: getDisableDateEnd('searchData', 'increaseStratDate'),
      increaseStartDayOptions: getDisableDateStart('searchData', 'insuredEndDate'),
      increaseEndDayOptions: getDisableDateEnd('searchData', 'insuredStratDate'),
      checkStartDayOptions: getDisableDateStart('searchData', 'effectiveEndDate'),
      checkEndDayOptions: getDisableDateEnd('searchData', 'effectiveStartDate'),
      checkOverStartDayOptions: getDisableDateStart('searchData', 'uneffectiveEndDate'),
      checkOverEndtDayOptions: getDisableDateEnd('searchData', 'uneffectiveStartDate'),
      applyStartDayOptions: getDisableDateStart('searchData', 'decreasEndDate'),
      applyEndDayOptions: getDisableDateEnd('searchData', 'decreasStratDate'),
      retireStartDayOptions: getDisableDateStart('searchData', 'medicalTransactDateEndTime'),
      retireEndDayOptions: getDisableDateEnd('searchData', 'medicalTransactDateStartTime'),
      payStartDayOptions: getDisableDateStart('searchData', 'payDateEndTime'),
      payEndDayOptions: getDisableDateEnd('searchData', 'payDateStartTime')
    }
  },
  methods: {
    /**
     * 将日期选择器的时间转化为东八区时间
     * @param {*} value 要改变的值
     * @param {String} searchParam 对象名
     * @param {String} searchDateName 属性名
     * @param {String} type 设置返回值的类型 可选参数String/Date  默认为Date格式
     * @return {Date} 东八区时间
     */
    handleDateChange (value, searchParam, searchDateName, type = 'date', format = 'YYYY-MM-DD') {
      if (type.toLowerCase() === 'string') return (this[searchParam][searchDateName] = value ? moment(value).format(format) : '')
      if (type.toLowerCase() === 'date') return (this[searchParam][searchDateName] = value ? new Date(moment(value).format(format)) : '')
    },
    getMultipleData (data) {
      data.map(item => {
        Object.keys(this.multipleColumns).forEach(key => {
          item[key] = {}
        })
        Object.keys(item).forEach(key => {
          for (let col of Object.keys(this.multipleColumns)) {
            if (this.multipleColumns[col].includes(key)) {
              item[col][key] = item[key]
              break
            }
          }
        })
        return item
      })
    },
    getMultipleColumns () {
      this.table.columns.forEach(item => {
        item.children && (this.multipleColumns[item.prop] = item.children.map(val => {
          return val.prop
        }))
      })
    }
  }
}
