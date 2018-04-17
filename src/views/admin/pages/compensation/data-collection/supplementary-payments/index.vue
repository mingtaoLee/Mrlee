<template>
  <i-layout headerKey="">
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table v-loading="loading" :element-loading-text="$loadingText">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/compensation/employee-info/hours-salary'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    components: {
      ITable,
      ITableCell,
      ILayout
    },
    data () {
      return {
        // 职种选项配置
        jobFamilysProps: {
          children: 'children',
          label: 'name'
        },
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', func: this.openDetailPage, align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', func: this.openDetailPage, width: '120', fixed: 'left', align: 'left' },
            { prop: 'orgCode', label: '人事范围', align: 'left', width: '120', fixed: 'left' },
            { prop: 'orgName', label: '组织代码', width: '120', fixed: 'left', align: 'left' },
            { prop: 'personnelGroupName', label: '组织名称', width: '160', fixed: 'left' },
            { prop: 'jobName', label: '核算月份', width: '120', fixed: 'left', align: 'left' },
            { prop: 'jobCategory', label: '餐费扣款', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashMonth', label: '现金短款', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'hireDate', label: '服装扣款', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashTotal', label: '反扒奖励', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'reward', label: '支援补贴', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashNum', label: '一次性安家费', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashRatio', label: '食品安全排查奖', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashPerf', label: '离职补偿金', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'efficency', label: '等等', align: 'left', width: '120' },
            { prop: 'cashServiceNum', label: '等等', align: 'left', width: '130' },
            { prop: 'cashTranNum', label: '操作', align: 'left', width: '120' }
          ],
          setting: {
            import: {
              business: '',
              key: '',
              show: () => ({ empty: false })
            },
            export: {
              req: config.getHoursSalaryList,
              key: ''
            },
            toolbar: [{
              text: '新增',
              key: '',
              func: this.addPolicy
            }, {
              text: '删除',
              key: '',
              func: this.delete
            }]
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        searchParam: {
          orgCode: '',
          employeeCode: '',
          employeeName: '',
          orgName: '',
          effectiveDateStart: '',
          effectiveDateEnd: ''
        },
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      fetch (options = {}) {
        req('getHoursSalaryList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },
      openHoursSalaryHistoryPage () {
        this.$router.push({ path: '/compensation/employee-info/hours-salary-history' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
