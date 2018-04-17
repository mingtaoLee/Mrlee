<template>
  <div class="salary-history">
    <i-table
      v-loading="loading"
      :element-loading-text="$loadingText"
      ref="table"
      class="table"
      :table="table"
    >
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="tableScope.clone"
          border
        >
          <el-table-column
            v-for="(col, idx) of table.columns"
            :key="idx"
            :prop="col.prop"
            :label="col.label"
            :minWidth="col.width"
            :align="col.align"
            :formatter="tableScope.formatter"
          >
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>
<script>
  import ILayout from 'components/common/i-layout'
  import req from 'api/compensation/employee-info/salary-standard'
  export default {
    components: {
      ILayout
    },
    props: {
      empEmployeeId: String
    },
    data: function () {
      return {
        loading: true,
        instance: null,
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', sortable: true, align: 'center', width: '120' },
            { prop: 'employeeName', label: '姓名', width: '120', align: 'left' },
            { prop: 'groupName', label: '薪资组', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '组织名称', width: '120', align: 'left' },
            { prop: 'name', label: '职位', width: '140', align: 'left' },
            { prop: 'monthStandard', label: '月薪标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'hourStandard', label: '时薪标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'hourWorkStandard', label: '小时工资标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'preWageStandard', label: '原工资标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'isCompare', label: '与原工资对比', align: 'center', width: '130', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'varyWithHourstd', label: '随时效浮动', align: 'center', width: '120', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'adjustType', label: '调薪类型', align: 'center', width: '120', display: { dict: 'PAY_ADJUST_TYPE' } },
            { prop: 'adjustReason', label: '调薪原因', align: 'center', width: '120', display: { dict: '' } },
            { prop: 'effectiveDate', label: '生效日期', align: 'center', width: '120', display: { date: 'default' } },
            { prop: 'endTime', label: '失效日期', align: 'center', width: '120', display: { date: 'default' } }
          ],
          data: []
        }
      }
    },
    watch: {
      empEmployeeId (value) {
        if (value) {
          this.loading = true
          this.init()
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      /** 初始化 */
      init () {
        this.fetch({ id: this.empEmployeeId })
      },
      handleSizeChange (options) {
        this.fetch(options)
      },
      handleCurrentChange (options) {
        this.fetch(options)
      },
      fetch (options = {}) {
        this.loading = true
        req('getEmpSalaryHistory', options).then(res => {
          if (res) {
            this.table.data = res
            this.loading = false
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .salary-history {
    min-height: 300px;
  }
</style>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
