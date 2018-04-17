/**
 * 日期选择器的操作
 * 绑定的值必须在 [searchBox] 对象里面
 */
export default {
  data () {
    return {
      // 未格式化之前的结束日期
      endDate: null,
      // 时间的限制
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() <= Date.parse(this.searchBox.startEffectiveDate) - 8.64e7
        }
      }
    }
  },
  methods: {
    // 处理结束日期，当选择结束日期，默认是当天的最后时刻
    addDate (val) {
      if (!val) {
        return
      }
      val = new Date(val)
      val.setHours(23, 59, 59)
      this.searchBox.endEffectiveDate = val
    },
    // 校检起始时间必须小于结束时间
    monitor (val) {
      this.endDate = null
      this.searchBox.endEffectiveDate = null
    },
    // 搜索框的重置功能
    reset () {
      Object.keys(this.searchBox).map(key => {
        if (key === 'endEffectiveDate' || key === 'startEffectiveDate') {
          this.searchBox[key] = null
        } else {
          this.searchBox[key] = ''
        }
      })
      // 修复重置字段问题
      this.$refs.startEffectiveDate.$children[0].currentValue = ''
      this.$refs.endEffectiveDate.$children[0].currentValue = ''
    }
  }
}
