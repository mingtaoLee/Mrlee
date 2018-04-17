<template>
  <i-layout headerKey="cpsPayGroupGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="薪资组">
          <remote-select
            v-model="searchParam.groupId"
            dataKey="salaryGroup"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['groupCode', 'groupName']"
            :props="groupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="人事范围">
          <remote-select
            v-model="searchParam.personnelGroupCode"
            dataKey="personnelGroup"
            placeholder="请输入代码或名称搜索"
            :extraParam="{ hasPower: 'Y' }"
            :displayKeys="['personnelGroupCode', 'personnelGroupName']"
            :props="personnelGroupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="省/区/范围">
          <i-select-area v-model="searchParam.areaId" type="yonghui" search></i-select-area>
        </el-form-item>
        <el-form-item label="发薪主体">
          <el-input v-model="searchParam.companyName"></el-input>
        </el-form-item>
        <el-form-item label="派遣人员薪资组">
          <i-select v-model="searchParam.isDispatch" parameter="WHETHER_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="支付账户">
          <el-input v-model="searchParam.payAccount"></el-input>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDate"
            type="date"
            @change="handleEffectiveDateChange"
            :picker-options="effectOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.uneffectiveDate"
            type="date"
            @change="handleUneffectDateChange"
            :picker-options="uneffectOptions">
          </el-date-picker>
        </el-form-item>
      </i-form>
    </template>
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
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone"
            :span-method="rowCombineMethod"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)"
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
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
              :sort-method="col.sortPayDate"
            >
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :idKey="idKey" :editorStatus="editorStatus" :groupId="groupId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import DetailEdit from './detail-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      DetailEdit,
      RemoteSelect
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getSalaryGroups', deleteName: 'deleteSalaryGroup' },
        title: '薪资组',
        idKey: 'groupId',
        // 人事范围选择器配置
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        disabledInfo: {
          effectiveDateDisable: false
        },
        /* detail-edit */
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            throttle: true,
            text: '确认',
            func: done => {
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'personnelGroupCode', label: '人事范围代码', sortable: true, width: '200', align: 'left' },
            { prop: 'personnelGroupName', label: '人事范围名称', sortable: true, width: '200', align: 'left' },
            { prop: 'areaName', label: '省/区/范围', sortable: true, width: '160', align: 'left' },
            { prop: 'groupCode', label: '薪资组代码', sortable: true, align: 'left', width: '120', fixed: 'left' },
            { prop: 'groupName', label: '薪资组名称', sortable: true, width: '120', align: 'left', fixed: 'left' },
            { prop: 'payDate', label: '发薪日', width: '120', sortable: true, align: 'right', sortPayDate: this.sortPayDate },
            { prop: 'companyName', label: '发薪主体', sortable: true, width: '160', align: 'left' },
            { prop: 'isDispatch', label: '派遣人员薪资组', sortable: true, width: '160', align: 'left', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'basicAccount', label: '基本户', sortable: true, width: '160', align: 'left' },
            { prop: 'paymentCompanyName', label: '支付主体', sortable: true, width: '160', align: 'left' },
            { prop: 'payAccount', label: '支付账户', sortable: true, width: '160', align: 'left' },
            { prop: 'payBankType', label: '支付银行类别', sortable: true, width: '160', align: 'left', display: { dict: 'BANK_TYPE' } },
            { prop: 'effectiveDate', label: '生效日期', width: '120', sortable: true, align: 'left', display: { date: 'default' } },
            { prop: 'uneffectiveDate', label: '失效日期', width: '120', sortable: true, align: 'left', display: { date: '' } }
          ],
          setting: {
            export: {
              key: 'cpsPayGroupExport',
              config: {
                fileName: '薪资组'
              },
              req: config.getSalaryGroups
            },
            operator: [
              {
                key: 'cpsPayGroupUpdate',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsPayGroupDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsPayGroupCreate',
              text: '新增',
              func: this.addPage
            }, {
              key: 'cpsPayComponentGroupListSet',
              text: '工资套设置',
              func: this.setSalaryItem
            }]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        },
        searchParam: {
          personnelGroupCode: '',
          groupId: '',
          areaId: '',
          companyName: '',
          isDispatch: '',
          payAccount: '',
          effectiveDate: null,
          uneffectiveDate: null
        }
      }
    },
    methods: {
      afterFetch (res) {
        res.data = this.transformToRowsCombineData(res.data)
        return Promise.resolve(true)
      },
      transformToRowsCombineData (data) {
        let arr = []

        data.forEach((item, index) => {
          arr = arr.concat(item.payAccount.split(',').map((payAccount, index) => {
            const newItem = {}
            if (index === 0) {
              newItem.isCombine = true
              newItem.combineNum = item.payAccount.split(',').length
            }
            newItem.payAccount = payAccount
            newItem.payBankType = item.payBankType.split(',')[index]

            return Object.assign({}, item, newItem)
          }))
        })

        return arr
      },
      /** 打开设置工资套页面 */
      setSalaryItem () {
        this.$router.push({ path: '/compensation/base-setting/company-rules/salary-items' })
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      // 发薪日排序
      sortPayDate (oldRow, newRow) {
        return oldRow.payDate - newRow.payDate
      },
      /** 行合并方法 */
      rowCombineMethod ({row, column, rowIndex, columnIndex}) {
        if (!(column.property === 'payAccount' || column.property === 'payBankType')) {
          if (row.isCombine) {
            return {
              rowspan: row.combineNum,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
