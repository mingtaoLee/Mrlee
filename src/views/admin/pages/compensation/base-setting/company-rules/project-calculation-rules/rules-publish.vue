<template>
  <div>
    <p class="publish-ins">以下人员有多个计算规则可适配，请确定唯一的计算规则</p>
    <i-table
      class="table"
      :table="table"
      ref="table"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange"
    >
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="tableScope.clone"
          border
          @selection-change="selectionChangeHandler(tableScope, $event)">
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
    <p class="publish-ins">其他人员将新的计算规则进行更新</p>
  </div>
</template>
<script>
  //  import { showMessage, confirmPopover } from 'utils/index'
  import ITable from 'components/common/i-table'

  export default {
    components: {
      ITable
    },
    data () {
      return {
        table: {
          columns: [
            { prop: 'componentType', label: '适用类型', width: 'auto', align: 'left' },
            { prop: 'employeeRangeList', label: '适用范围', width: 'auto', align: 'left' },
            { prop: 'calculateRuleInfoDto', label: '计算规则', width: 'auto', align: 'right' },
            { prop: 'ruleRemark', label: '规则描述', width: 'auto', align: 'left' }
          ],
          setting: {
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: false
        }
      }
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    created () {
      this.initData()
    },
    methods: {
      initData () {
      },
      handleSizeChange (options) {
        console.log(options)
        this.getBankTplList(options)
      },
      handleCurrentChange (options) {
        console.log(options)
        this.getBankTplList(options)
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      // 添加行数据
      addList () {
        Object.assign(this.form, {
          bankTemplateId: null,
          bankTemplateName: '',
          bankName: '',
          areaCode: '',
          effectiveDate: 114413213231,
          uneffectiveDate: 114413213231,
          remark: ''
        })
        this.isShowDialog = true
      },
      // 修改行数据
      modifyRow (scope) {
        Object.assign(this.form, {
          bankTemplateId: scope.row.bankTemplateId,
          bankTemplateName: scope.row.bankTemplateName,
          bankName: scope.row.bankName,
          areaCode: scope.row.areaCode,
          effectiveDate: scope.row.effectiveDate,
          uneffectiveDate: scope.row.uneffectiveDate,
          remark: scope.row.remark
        })
        this.isShowDialog = true
      },
      import () {},
      export () {}
    }
  }
</script>

<style lang="scss" scoped>
  .publish-ins{
    padding: 15px 0;
  }
</style>
