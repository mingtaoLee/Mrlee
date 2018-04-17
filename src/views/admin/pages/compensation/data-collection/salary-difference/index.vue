<template>
  <i-layout headerKey="cpsPayDiffPageSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.employeeName"></el-input>
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
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="职务">
           <i-select v-model="searchParam.posTitleId" dataKey="posTitles" :props="posTitleProps"></i-select>
        </el-form-item>
        <el-form-item label="职位">
          <remote-select
            v-model="searchParam.jobId"
            dataKey="jobName"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['code', 'name']"
            :props="jobProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="员工状态">
          <i-select v-model="searchParam.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="核算月份起">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="month"
            @change="handleEffectiveDateStartChange"
            :picker-options="effectStartOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份止">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="month"
            @change="handleEffectiveDateEndChange"
            :picker-options="effectEndOptions"
          >
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
            :data="tableScope.clone" :cell-class-name="cellClassName"
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
              :formatter="tableScope.formatter"
              :fixed="col.fixed"
            >
            </el-table-column>
            <i-table-operator scope :table="tableScope" width="120"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        size="large"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :type="type" :id="id"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/salary-difference'
  import RemoteSelect from 'components/compensation/remote-select'
  import DetailEdit from './detail-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin],
    components: {
      DetailEdit,
      RemoteSelect
    },
    data () {
      return {
        // id键值标识
        idKey: 'id',
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
        // 职务选择器配置
        posTitleProps: {
          value: 'posTitleId',
          label: 'name'
        },
        // 职位选择器配置
        jobProps: {
          value: 'posPositionId',
          label: 'name'
        },
        reqConfig: { req: req, getName: 'getSalaryDiffList', deleteListName: 'putSalaryDiffLists' },
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        // 弹窗标题
        title: '工资差异信息详情',
        // 弹窗类型
        type: 'detail',
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
            hide: false,
            func: done => {
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '120' },
            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '组织名称', width: '160', align: 'left' },
            { prop: 'posTitleName', label: '职务', align: 'left', width: '120' },
            { prop: 'jobName', label: '职位', align: 'left', width: '120' },
            { prop: 'employeeStatus', label: '员工状态', align: 'left', width: '120', display: { dict: 'EMPLOYEE_STATUS' } },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'amount', label: '总金额', align: 'right', width: '100', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' } },
            { prop: 'lastUpdateBy', label: '操作者工号', width: '120', align: 'left' },
            { prop: 'lastUpdateDate', label: '操作时间', align: 'left', width: '140', display: { date: 'long' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '工资差异'
              },
              req: config.getSalaryDiffList,
              key: 'cpsPayDiffExportGet'
            },
            import: {
              key: 'cpsPayDiffImportPost',
              business: 'cps-payDiff',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '查看',
                key: 'cpsPayDiffInfoSelectGet',
                func: this.openDetail
              },
              {
                text: '修改',
                key: 'cpsPayDiffUpdatePut',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'payDiffServiceDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '删除',
              key: 'payDiffServicePut',
              type: 'danger',
              func: this.delete
            }, {
              text: '确认无误',
              key: 'cpsPayDiffInfoConfirm',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }, {
              text: '取消确认',
              key: 'cpsPayDiffInfoCancelConfirm',
              func: (vm) => {
                return this.confirmAction(vm, 'N')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          groupId: '',
          personnelGroupCode: '',
          employeeCode: '',
          employeeName: '',
          orgUnitId: '',
          posTitleId: '',
          jobId: '',
          effectiveDateStart: '',
          effectiveDateEnd: ''
        }
      }
    },
    methods: {
      afterFetch (res) {
        res.data.map(item => {
          if (item.checkMonth) {
            item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
          }
        })
        return Promise.resolve(true)
      },
      openDetail (scope) {
        this.detailEditToolbar[1].hide = true
        this.setDialogInfo('工资差异信息详情', 'detail', scope.row.id)
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.detailEditToolbar[1].hide = false
        this.setDialogInfo('工资差异信息修改', 'modify', scope.row.id)
        this.openDetailDialog()
      },
      setDialogInfo (title, type, id) {
        this.title = title
        this.type = type
        this.id = id
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      /** 多选删除 */
      deleteRow (scope) {
        const rowId = scope.row.id
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          this.reqConfig.req('putSalaryDiffLists', [rowId]).then(res => {
            if (res) {
              this.fetch(this.allParam)
              showMessage('success', '恭喜你！删除成功！')
            }
          })
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
