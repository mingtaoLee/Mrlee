<template>
  <main>

    <i-layout headerKey="grpEvaluationsMonitorGet">

      <i-form slot="header" @reset="reset" @search="search">
        <el-form-item label="名称">
          <el-input v-model.trim="params.name" clearable ></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
          v-model="params.evaluateDate"
          type="date"
          clearable
          :default-value="currentDay"
          @change="handleDateChange"
          ></el-date-picker>
        </el-form-item>
      </i-form>

      <i-table
        :table="table"
        slot="section"
        v-loading="tableLoading"
        :element-loading-text="$loadingText"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot-scope="tableScope" slot="table">
          <el-table
            :data="tableScope.clone"
            :cell-class-name="checkCellClass"
            @cell-click="handleCellClick"
          >

            <el-table-column
              v-for="(col, index) in table.columns"
              :key="index"
              :label="col.label"
              :prop="col.prop"
              :formatter="tableScope.formatter"
            ></el-table-column>

            <i-table-operator :table="tableScope"></i-table-operator>

          </el-table>
        </template>
      </i-table>

    </i-layout>

    <i-dialog
      v-model="showDialog"
      destroyedWhenClose
      :toolbar="toolbar"
      title="查看详情"
    >
      <monitor-dialog
        :schemeId="currentRow.schemeId"
        :evaluateDate="currentDate"
        :status="detailStatus"></monitor-dialog
      >
    </i-dialog>

    <scheme-operator
      :status="0"
      :showOperator.sync="showSchemeOperator"
      v-if="showSchemeOperator"
      :schemeData="schemeData"
    ></scheme-operator>
  </main>
</template>
<script>
import tableMixin from '../../table-mixin'
import req, {config} from 'api/grape/monitor'
import monitorDialog from './monitor-dialog'
import schemeOperator from '../grape-scheme/schemeOperator'

export default {
  name: 'grape-eva-monitor',

  mixins: [tableMixin],

  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },

      showSchemeOperator: false,

      schemeData: null,

      currentDate: null, // 当前选择的日期

      currentRow: {},

      detailStatus: 0, // 详情对话框数据 0:所有，1: 已评，2: 未评

      params: {
        name: null,
        evaluateDate: null
      },

      table: {
        data: [],
        search: null,
        info: null,
        total: 0,
        showPagebar: true,
        columns: [
          {prop: 'name', label: '名称'},
          {prop: 'status', label: '状态', display: {dict: 'GRAPE_EVALUATE_STATUS'}},
          {prop: 'orgName', label: '适用范围'},
          {prop: 'evaluateDate', label: '评估时间', display: {date: 'default'}},
          {prop: 'staffNum', label: '评分人数'},
          {prop: 'doneNum', label: '已评'},
          {prop: 'unDoNum', label: '未评'},
          {prop: 'percent', label: '完成率'}
        ],
        setting: {
          export: {
            text: '导出',
            key: 'grpMonitorExportPost',             // 不合规范，以自身业务为准【可选】
            config: {                      // 【可选】
              fileName: '绩效计划数据'            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
            },
            req: config.getMonitorList
          },
          operator: [
            {
              text: '查看详情',
              key: 'grpEvaluationMonitorGet',
              func: (row) => {
                this.currentRow = row
                this.currentDate = this.params.evaluateDate
                this.showDialog = true
              }
            }
          ]
        }
      },

      toolbar: [
        {
          text: '确定',
          type: 'primary',
          func: done => {
            done()
          }
        },
        {
          text: '取消',
          type: 'text',
          func: done => {
            done()
          }
        }
      ],

      showDialog: false,
      tableLoading: false

    }
  },

  computed: {
    currentDay () {
      let result = new Date().toLocaleDateString()
      result.split('/').join('-')
      return result
    }
  },

  methods: {

    reset () {
      this.params.name = ''
      this.params.evaluateDate = new Date().toLocaleDateString().split('/').join('-')
    },

    checkCellClass ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) return 'gengtp-grape-montior-firstCell'
    },

    getTableData (opts) {
      req('getMonitorList', opts).then(res => {
        for (let i of res.data) {
          i.percent += '%'
        }
        Object.assign(this.table, res)
        this.tableLoading = false
      })
    },

    getSchemeDetail (schemeId) {
      return req('getSchemeDetail', {schemeId: schemeId})
    },

    handleCellClick (row, col, cell, e) {
      this.currentDate = this.params.evaluateDate
      this.currentRow = row
      if (col.property === 'doneNum') {
        this.detailStatus = 1
        this.showDialog = true
      } else if (col.property === 'unDoNum') {
        this.detailStatus = 2
        this.showDialog = true
      } else if (col.property === 'name') {
        this.getSchemeDetail(row.schemeId).then(res => {
          this.schemeData = res
          this.showSchemeOperator = true
        })
      }
    },

    handleSizeChange (opts) {
      this.getTableData(opts)
    },

    handleDateChange (val) {
      this.params.evaluateDate = val.toLocaleDateString().split('/').join('-')
    },

    search () {
      this.table.search = {...this.params}
    },

    handleCurrentChange (opts) {
      this.getTableData(opts)
    }

  },

  created () {
    this.tableLoading = true
    this.params.evaluateDate = new Date().toLocaleDateString().split('/').join('-')
  },

  mounted () {
    this.search()
  },

  components: {
    monitorDialog,
    schemeOperator
  }

}
</script>
<style lang="scss">
.gengtp-grape-montior-firstCell {
  cursor: pointer;
}
</style>
