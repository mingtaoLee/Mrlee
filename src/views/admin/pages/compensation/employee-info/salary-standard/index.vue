<template>
  <i-layout>
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="薪资组">
          <remote-select
            v-model="searchParam.groupId"
            dataKey="salaryGroup"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['groupCode', 'groupName']"
            :props="groupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="组织名称">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="searchParam.orgUnitId"
            lazy
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="searchParam.name"></el-input>
        </el-form-item>
        <el-form-item label="随时效浮动">
          <i-select v-model="searchParam.varyWithHourstd" parameter="WHETHER_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="与原工资对比">
          <i-select v-model="searchParam.isCompare" parameter="WHETHER_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="调薪类型">
          <i-select v-model="searchParam.adjustType" parameter="PAY_ADJUST_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            :picker-options="effectStartOptions"
            @change="handleEffectiveDateStartChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            :picker-options="effectEndOptions"
            @change="handleEffectiveDateEndChange"
          >
          </el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
        ref="table"
        class="table"
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone"
            border
          >
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :fixed="col.fixed"
              :formatter="tableScope.formatter"
              :sortable="col.sortable"
            >
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
          v-model="isShowDetailDialog"
          :title="title"
          :toolbar="detailEditToolbar"
          destroyedWhenClose
        >
        <detail ref="detail" :empfullsalaryId="empfullsalaryId"></detail>
      </i-dialog>
      <i-dialog
        v-model="isShowDialog"
        title="员工调薪历史记录"
        size="large"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :empEmployeeId="empEmployeeId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import ILayout from 'components/common/i-layout'
  import req, { config } from 'api/compensation/employee-info/salary-standard'
  import DetailEdit from './detail-edit'
  import Detail from './detail'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    components: {
      Detail,
      DetailEdit,
      ILayout,
      RemoteSelect
    },
    mixins: [PaginationMixin, SearchDateMixin, Access],
    data () {
      return {
        isShowDialog: false,
        isShowDetailDialog: false,
        empfullsalaryId: String,
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },

        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', sortable: true, align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', width: '120', align: 'left', fixed: 'left' },
            { prop: 'groupName', label: '薪资组', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '组织名称', width: '120', align: 'left' },
            { prop: 'name', label: '职位', width: '140', align: 'left' },
            { prop: 'monthStandard', label: '月薪标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'hourStandard', label: '时薪标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'hourWorkStandard', label: '小时工资标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'preWageStandard', label: '原工资标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'isCompare', label: '与原工资对比', align: 'left', width: '130', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'varyWithHourstd', label: '随时效浮动', align: 'left', width: '120', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'adjustType', label: '调薪类型', align: 'left', width: '120', display: { dict: 'PAY_ADJUST_TYPE' } },
            { prop: 'adjustReason', label: '调薪原因', align: 'left', width: '120' },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '120', display: { date: 'default' } },
            { prop: 'endTime', label: '失效日期', align: 'left', width: '120', display: { date: 'default' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '员工工资标准'
              },
              key: 'cpsEmpPayStandardExport',
              req: config.getSalaryList
            },
            import: {
              key: 'cpsEmpPayStandardImport',
              business: 'cps-employeeFullsalary',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '调薪历史',
                key: 'cpsEmpPayStandardGet',
                func: this.openSingleSalaryHistoryPage
              }
              // , {
              //   text: '修改',
              //   key: 'cpsEmpPayStandardPut',
              //   func: this.modifyRow
              // }
            ],
            toolbar: [{
              text: '调薪历史查询',
              key: 'cpsEmpPayStandardHistoryGet',
              func: this.openSalaryHistoryPage
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          employeeName: '',
          employeeCode: '',
          groupName: '',
          groupId: '',
          orgUnitId: '',
          adjustType: '',
          varyWithHourstd: '',
          effectiveDateEnd: '',
          effectiveDateStart: ''
        }
      }
    },
    methods: {
      /** 获取薪资标准数据 */
      fetch (options = {}) {
        this.load()
        req('getSalaryList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },

      /** 打开调薪历史页面 */
      openSalaryHistoryPage () {
        this.$router.push({ path: '/compensation/employee-info/salary-history' })
      },

      /** 打开某员工调薪历史窗口 */
      openSingleSalaryHistoryPage (scope) {
        this.empEmployeeId = scope.row.empEmployeeId
        this.isShowDialog = true
      },
      /** 员工工资标准修改 */
      modifyRow (scope) {
        this.empfullsalaryId = scope.row.empfullsalaryId
        this.title = '员工工资标准信息修改'
        this.openDetailDialog()
      },
      openDetailDialog () {
        this.isShowDetailDialog = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
