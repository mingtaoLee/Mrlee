<template>
  <i-layout headerKey="cpsAllowancePageSelectGet">
    <i-form @reset="reset" @search="search" slot="header">
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
        <!-- <el-input v-model="searchParam.orgName"></el-input> -->
        <i-select-tree
          :multiple="false"
          dataKey="org"
          nodeKey="orgUnitId"
          v-model="searchParam.orgUnitId"
          size="small"
      ></i-select-tree>
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
            :cell-class-name="cellClassName"
            border
          >
            <el-table-column type="selection" fixed></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :fixed="col.fixed"
              :formatter="tableScope.formatter"
            ></el-table-column>
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
        <ModifyWelfare
          :id="id"
          :idKey="idKey"
          ref="ModifyWelfare"
          :editorStatus="editorStatus"
        ></ModifyWelfare>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/welfare-subsidy'
  import ModifyWelfare from './detail-edit'
//  import { dateFormat } from 'utils/index'
  import Access from 'mixins/access'
  // import { formatDate } from 'utils/organization'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'

  export default {
    mixins: [Access, PaginationMixin, SearchDateMixin, ConfirmDataMixin],
    components: {
      ModifyWelfare,
      RemoteSelect
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getAllowancesList', deleteListName: 'delAllowances' },
        title: '福利补贴',
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
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
        loading: true,
        searchParam: {
          ittTemplateName: '',
          areaCode: '',
          effectiveDate: '',
          uneffectiveDate: '',
          orgUnitId: '',
          groupId: '',
          personnelGroupCode: ''
        },
        /* detail-edit */
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => this.handleCancel(done)
          },
          {
            throttle: true,
            text: '确认',
            func: done => this.handleSave(done)
          }
        ],
        isShowDialog: false,
        currentRowId: '',
        startColumns: [
          { prop: 'employeeCode', label: '工号', align: 'left', width: '120' },
          { prop: 'employeeName', label: '姓名', align: 'left', width: '120' },
          { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '140' },
          { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '140' },
          { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '120' },
          { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
          { prop: 'orgUnitCode', label: '组织代码', align: 'left', width: '120' },
          { prop: 'orgUnitName', label: '组织名称', width: '120', align: 'left' },
          { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' }
        ],
        endColumns: [
          { prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' } }
        ],
        /* table */
        table: {
          columns: [],
          setting: {
            operator: [
              {
                text: '修改',
                key: 'cpsAllowanceUpdatePut',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'cpsAllowanceDeleteDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              key: 'cpsAllowanceCreatePost',
              func: this.addPage
            }, {
              text: '删除',
              type: 'danger',
              key: 'cpsAllowanceBatchDelete',
              func: this.delete
            }, {
              text: '确认无误',
              key: 'cpsAllowanceConfirm',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }],
            import: {
              key: 'cpsAllowanceImportPost',
              business: 'cps-allowance',
              show: () => ({ empty: false })
            },
            export: {
              config: {
                fileName: '福利补贴'
              },
              req: config.getAllowancesList,
              key: 'cpsAllowanceExportGet',
              elTable: null
            }
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true,
          renderColumns: true
        }
      }
    },
    methods: {
      getColumns () {
        return req('getAllowancesListTitle').then(res => {
          this.table.columns = [...this.startColumns, ...this.transformColumns(res), ...this.endColumns]
        })
      },
      transformColumns (columns) {
        columns.map(column => {
          if ((/^itemKey[0-9]+/).test(column.prop)) {
            column.width = this.getColumnWidth(this.getStrLength(column.label))
            column.align = 'right'
            column.display = { mixin: (row, col) => { return this.currencyFormat(row[col]) } }
          }
        })
        return columns
      },
      getColumnWidth (length) {
        if (length < 5) {
          return 100
        } else if (length < 7) {
          return 120
        } else {
          return 140
        }
      },
      getStrLength (str) {
        return str.length
      },
      getData (options) {
        return req('getAllowancesList', options).then(res => {
          if (res) {
            res.data.map(item => {
              if (item.checkMonth !== null) {
                item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
              } else {
                return ''
              }
            })
            Object.keys(res).map(key => {
              this.table[key] = res[key]
            })
          }
        })
      },
      fetch (options = {}) {
        this.load()
        Promise.all([this.getColumns(), this.getData(options)]).then(() => {
          this.loaded()
        })
      },
//      addList () {
//        this.currentRowId = ''
//        this.openDetailDialog()
//      },
//      modifyRow (scope) {
//        this.currentRowId = scope.row.id
//        this.openDetailDialog()
//      },
//      deleteRow (scope) {
//        confirmPopover('warning', '确认删除该项吗？', () => {
//          this.resetAllParam(1)
//          this.delAllowances([scope.row.id])
//        })
//      },
//      delAllowances (idArr = []) {
//        return req('delAllowances', idArr).then(res => {
//          if (res) {
//            showMessage('success', '删除成功！')
//            this.fetch(this.allParam)
//            // this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
//          } else {
//            showMessage('danger', '删除失败！')
//          }
//        })
//      },
//      modifyAllowances (params = {}) {
//        // data.checkMonth = formatDate(data.checkMonth).slice(0, 7).split('-').join('')
//        return req('modifyAllowances', params).then(res => {
//          if (res) {
//            showMessage('success', '修改成功！')
//            this.fetch(this.allParam)
//            // this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
//          } else {
//            showMessage('danger', '修改失败！')
//          }
//        })
//      },
//      addAllowances (params = {}) {
//        // data.checkMonth = formatDate(data.checkMonth).slice(0, 7).split('-').join('')
//        return req('addAllowances', params).then(res => {
//          if (res) {
//            showMessage('success', '添加成功！')
//            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
//          } else {
//            showMessage('danger', '添加失败！')
//          }
//        })
//      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        let editVM = this.$refs['ModifyWelfare']
        let tableCellVM = editVM.$refs['tableCell']
        if (tableCellVM.filter(el => !el.validate()).length > 0) {
          return this.$message({
            type: 'error',
            message: '福利补贴项校验不通过'
          })
        }
        return new Promise((resolve, reject) => {
          editVM.save().then(res => {
            if (res) {
              this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
              resolve(true)
              done()
            } else {
              reject(false)
            }
          }).catch(() => {
            reject(false)
          })
        })
      }
//      delete (vm) {
//        const selected = vm.getMultipleSelection().map(item => {
//          return item.id
//        })
//        if (!selected.length) return showMessage('info', '请选择至少一项！')
//        confirmPopover('warning', '确认删除已选选项吗？', () => {
//          this.resetAllParam(selected.length)
//          this.delAllowances(selected)
//        })
//      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
