import req from 'api/performance/history'
import { unitDict, planEmployeeStatusHistoryDict, planCheckStatus, planEvaluationStatus, periodDict } from '@/config/dict'
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
    }
  },

  props: {
    // 请求后台链接
    reqUrl: {
      required: true,
      type: String
    }
  },

  data () {
    return {
      planEmployeeStatusHistoryDict: planEmployeeStatusHistoryDict,
      planCheckStatus: planCheckStatus,
      planEvaluationStatus: planEvaluationStatus,
      periodDict: periodDict,
      table: {
        data: null,
        total: 0,
        info: null,
        showPagebar: true,
        search: null,
        columns: [
          { prop: 'period', display: { dict: 'PERIOD' } },
          { prop: 'planEmployeeStatus', display: {dict: 'PLAN_EMPLOYEE_STATUS'} },
          { prop: 'planCheckStatus', display: {dict: 'PLAN_CHECK_STATUS'} },
          { prop: 'planEvaluationStatus', display: {dict: 'PLAN_EVALUATION_STATUS'} }
        ],
        setting: {
          export: {
            elTable: null
          }
        }
      },
      params: {
        employeeName: '',
        year: '',
        period: '',
        planEmployeeStatus: '',
        planCheckStatus: '',
        planEvaluationStatus: ''
      }
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

    handleCurrentChange (opts) {
      this.getData(opts)
    },

    getData (opts) {
      req(this.reqUrl, {
        ...opts,
        year: this.params.year ? this.params.year.getFullYear() : ''
      }).then((res) => {
        for (let i of res.data) {
          i.totalScore = Math.floor(Number(i.managerValue) / Number(i.target) * 100)
        }
        Object.assign(this.table, res)
      })
    },

    search (val) {
      this.table.search = {...this.params}
    },

    reset () {
      // 在这里写重置逻辑
      this.params = {
        employeeName: '',
        year: '',
        period: '',
        planEmployeeStatus: '',
        planCheckStatus: '',
        planEvaluationStatus: ''
      }
    }
  }
}
