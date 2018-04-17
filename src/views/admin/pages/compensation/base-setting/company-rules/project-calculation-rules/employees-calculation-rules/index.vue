<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="cpsPayCalculateRulesEmployee">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="工号">
        <el-input v-model="searchParam.empEmployeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchParam.fullName"></el-input>
      </el-form-item>
      <el-form-item label="组织">
        <!-- <el-input v-model="searchParam.orgUnitId"></el-input> -->
        <i-select-tree
          :multiple="false"
          dataKey="org"
          nodeKey="orgUnitId"
          v-model="searchParam.orgUnitId"
          size="small"
        ></i-select-tree>
      </el-form-item>
      <el-form-item label="职务">
        <el-input v-model="searchParam.posTitleName"></el-input>
      </el-form-item>
      <!--<el-form-item label="薪资项目名称">-->
        <!--<el-input v-model="searchParam.componentName"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="月薪标准">-->
        <!--<el-input v-model="searchParam.monthStandardSalary"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="超时工资">-->
        <!--<el-input v-model="searchParam.outTimeSalary"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="通讯补贴">-->
        <!--<el-input v-model="searchParam.phoneSubsidy"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="XX补贴">-->
        <!--<el-input v-model="searchParam.XXSubsidy"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="赛马奖金">-->
        <!--<el-input v-model="searchParam.HorseRacingBonus"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="利润分红">-->
        <!--<el-input v-model="searchParam.profitSharing"></el-input>-->
      <!--</el-form-item>-->
    </i-form>
    <template slot="section">
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
            :stripe="$$.table.stripe"
            :border="$$.table.border"
          >
            <el-table-column
              v-for="col of tableScope.columns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :formatter="tableScope.formatter">
              <el-table-column
                v-for="son of col.children"
                :key="son.prop"
                :prop="son.prop"
                :label="son.label"
                :width="son.width"
                :align="son.align"
                :formatter="tableScope.formatter">
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
</template>

<script>
  import req from 'api/compensation/base-setting/company-rules'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
//  import RulesSetting from './rules-setting'
  //  import BankTplFormatModify from './bank-tpl-format-modify'
  import { showMessage, confirmPopover } from 'utils/index'

  export default {
    mixins: [PaginationMixin],
    data () {
      return {
        searchParam: {
          empEmployeeCode: null,
          fullName: null,
          orgUnitId: null,
          posTitleName: null
        },
        loading: false,
        // 表格
        table: {
//          columns: {
//            normal: [
//              { prop: 'emplyeeId', label: '工号', align: 'center', width: '100', display: {date: 'yyyy-MM-dd'} },
//              { prop: 'emplyeeName', label: '姓名', align: 'center', width: '100', display: {date: 'yyyy-MM-dd'} },
//              { prop: 'employeeOrganization', label: '组织', width: '120', align: 'center' },
//              { prop: 'employeePosition', label: '职务', width: '120', align: 'center' }
//            ],
//            items: [
//              { prop: 'monthStandardSalary', label: '月薪标准', width: '160', align: 'center' },
//              { prop: 'outTimeSalary', label: '超时工资', width: '160', align: 'center' },
//              { prop: 'phoneSubsidy', label: '通讯补贴', width: '160', align: 'center' },
//              { prop: 'XXSubsidy', label: '其他补贴', width: '160', align: 'center' }
//            ],
//            performance: [
//              { prop: 'HorseRacingBonus', label: '赛马奖金', width: '160', align: 'center' },
//              { prop: 'profitSharing', label: '利润分红', width: '160', align: 'center' },
//              { prop: 'employeeRange', label: '保底分红', width: '160', align: 'center' },
//              { prop: 'ruleRemark', label: '计件计量', width: '160', align: 'center' },
//              { prop: 'employeeRange', label: '服装绩效', width: '160', align: 'center' },
//              { prop: 'ruleRemark', label: '收银绩效', width: '160', align: 'center' }
//            ]
//          },
          columns: null,
          columnsExt: {
            age: {
              align: 'center'
            },
            entry: {
              display: { date: 'LONG' },
              align: 'center'
            },
            status: {
              display: { dict: 'EMPLOYEE_STATUS' }
            }
          },
          multiple: true,
          renderColumns: true,
          setting: {
            toolbar: [{
              text: '返回',
              type: 'default',
              func: this.backToStep
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        }
      }
    },
    methods: {
      backToStep () {
        this.$router.push({
          path: '/compensation/base-setting/company-rules/project-calculation-rules'
        })
      },
      // 获取模板表单信息
      fetch (params) {
        req('getEmployeesRule', params).then(res => {
          if (res) {
            this.table.columns = res.columns
            this.table = Object.assign(this.table, res.pageResult)
            this.renderColumns = false
            this.loaded()
          }
        })
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
        this.selectedList = selection
      },
      // 修改行数据
      modifyRow (scope) {
        this.currentRowData = scope.row
        this.isShowDialog = true
      },
      // 删除行数据
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteProjRules', scope.row).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      checkEmployeeRules () {
        this.$router.push({
          path: '/compensation/base-setting/company-rules/employees-calculation-rules'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
