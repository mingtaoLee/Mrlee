import req from 'api/performance/todo-list'
import { unitDict, indicatorCollectionStatusDict } from '@/config/dict'
import IForm from 'components/common/i-form/i-form.vue'
import ILayout from 'components/common/i-layout'
import ITable from 'components/common/i-table'

export default {
  components: {
    IForm,
    ILayout,
    ITable
  },

  filters: {
    unitFormat (val) {
      for (let i of unitDict) {
        if (i.value === val) {
          return i.label
        }
      }
      return ''
    },

    statusFormat (val) {
      for (let dict of indicatorCollectionStatusDict) {
        if (dict['value'] === val) {
          return dict['label']
        }
      }
      return ''
    }
  },

  data () {
    // 文本框校验
    const checkTextArea = (rule, val, cb) => {
      if (!val) {
        cb(new Error('不能为空'))
      } else if (val.length < 0 || val.length > 50) {
        cb(new Error('字符长度为 1 ~ 50'))
      } else if (/^\s+$/.test(val)) {
        cb(new Error('不能为纯空格'))
      } else {
        cb()
      }
    }

    // 数字值校验
    const checkNumber = (rule, val, cb) => {
      if (!val) {
        cb(new Error('不能留空'))
      } else if (val < 0 || !this.valValid) {
        cb(new Error('超出限制'))
      } else {
        cb()
      }
    }

    return {
      table: {
        data: null,
        search: null,
        total: 0,
        info: null,
        showPagebar: true,
        columns: [
          { prop: 'period', display: { dict: 'PERIOD' } }
        ],
        setting: {
          export: {
            elTable: null
          },
          operator: this.tableOperator
        }
      },
      keyword: '',
      valValid: false,
      textAreaRule: [{
        validator: checkTextArea,
        trigger: 'change'
      }, {
        validator: checkTextArea,
        trigger: 'blur'
      }],
      numberRule: [{
        validator: checkNumber,
        trigger: 'change'
      }, {
        validator: checkNumber,
        trigger: 'blur'
      }]
    }
  },

  // created () {
  //   this.getData()
  // },

  mounted () {
    // this.table.setting.export.elTable = this.$refs['elTable']
    this.search()
  },

  methods: {
    handleSizeChange (opts) {
      this.getData(opts)
    },

    search () {
      this.table.search = {keyword: this.keyword}
    },

    handleCurrentChange (opts) {
      this.getData(opts)
    },

    getData (opts) {
      req(this.selfApi, opts).then((res) => {
        Object.assign(this.table, res)
      })
    },

    validateVal (val, limit) {
      if (val > limit || !val) {
        this.valValid = false
      } else {
        this.valValid = true
      }
    },

    goPlanDetail (planId) {
      this.$router.push(`/performance/${planId}/plan_detail`)
    },

    reset () {
      this.keyword = ''
    }
  }
}
