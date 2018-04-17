/**
 * Created by ZHANZF on 2017-12-2.
 * 基本编辑mixin
 */
import moment from 'moment'
export default {
  props: {
    idKey: String,
    // 页面编辑状态，1为新增；2为带出新增；3为修改
    editorStatus: String
  },
  data () {
    return {
      loading: false,
      isDateDisabled: false,
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
  computed: {
    isDisabled (value) {
      return this.editorStatus === '3'
    }
  },
  created () {
    this.init()
  },
  methods: {
    /** 初始化 */
    init () {
      this.initInstance()
      this.initData()
    },
    /** 初始化数据 */
    initData () {
      this.instance.initData(this[this.idKey])
    },
    handleAreaChange (id) {
      this.form.areaId = id
    },
    /** 数据保存 */
    save () {
      return new Promise((resolve, reject) => {
        this.validate().then(res => {
          if (res) {
            this.instance.save().then(res => {
              resolve(res)
            }).catch((err) => {
              reject(err)
            })
          } else {
            resolve(false)
          }
        })
      })
    },

    /** 数据校验 */
    validate () {
      return new Promise(resolve => {
        this.$refs.form.validate(res => {
          if (res) {
            resolve(this.form)
          } else {
            resolve(false)
          }
        })
      })
    },

    /** 设置生效时效日期是否禁用 */
    setIsDateDisabled () {
      if (this.form.effectiveDate) {
        this.isDateDisabled = this.form.effectiveDate.getTime() <= moment().startOf('month').valueOf()
      }
    },

    /** 将时效日期转为当前月份最后一天 */
    setUneffectiveDate (submitData) {
      const date = submitData.uneffectiveDate
      if (date) {
        submitData.uneffectiveDate = moment(date).endOf('month').valueOf() - 1000
      }
    },
    load () {
      this.loading = true
    },
    loaded () {
      this.loading = false
    }
  }
}
