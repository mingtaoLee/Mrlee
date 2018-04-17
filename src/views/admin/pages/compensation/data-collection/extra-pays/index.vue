<template>
  <i-layout headerKey="cpsExtraPayGet">
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
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份止">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="month"
            @change="handleEffectiveDateEndChange"
            :picker-options="effectEndOptions"
          ></el-date-picker>
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
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :fixed="col.fixed"
              :minWidth="col.width"
              :align="col.align"
              :sortable="col.sortable"
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
        <detail-edit ref="detailEdit" :editorStatus="editorStatus" :idKey="idKey" :id="id"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/extra-pays'
  import DetailEdit from './detail-edit'
  import { dateFormat } from 'utils/index'
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
        reqConfig: { req: req, getName: 'getExtraPaysPerformanceList', deleteName: 'deleteExtraPaysPerformance', deleteListName: 'deleteExtraPaysPerformanceList' },
        title: '额外支付数据',
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
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
        dataConfirmConfig: { req: req, name: 'confirmData', params: {confirmStatus: 'Y'}, cancelParams: {confirmStatus: 'N'} },
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
          columns: [],
          columnsExt: {
            employeeCode: { align: 'left', width: '120', sortable: true },
            employeeName: { align: 'left', width: '120', sortable: true },
            checkMonth: { align: 'left', width: '120', sortable: true },
            confirmStatus: { align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }, sortable: true },
            employeeStatus: { align: 'left', width: '100', display: { dict: 'EMPLOYEE_STATUS' } },
            groupCode: { align: 'left', width: '120', sortable: true },
            groupName: { align: 'left', width: '120', sortable: true },
            hireDate: { align: 'left', width: '120', sortable: true, display: { date: 'default' } },
            unHireDate: { align: 'left', width: '120', sortable: true, display: { date: 'default' } },
            jobName: { align: 'left', width: '120' },
            posTitleName: { align: 'left', width: '120' },
            personnelGroupCode: { align: 'left', width: '120', sortable: true },
            personnelGroupName: { align: 'left', width: '120', sortable: true },
            orgUnitCode: { align: 'left', width: '140', sortable: true },
            orgUnitName: { align: 'left', width: '160', sortable: true },
            lastUpdateBy: { align: 'left', width: '140', sortable: true },
            lastUpdateDate: { align: 'left', width: '140', display: { date: 'long' }, sortable: true }
          },
          setting: {
            export: {
              config: {
                fileName: '额外支付'
              },
              key: 'cpsExtraPayExport',
              req: config.getExtraPaysPerformanceList
            },
            import: {
              key: 'cpsExtraPayImportPost',
              business: 'cps-extraPay',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'cpsExtraPayPut',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'cpsExtraPayDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [
              {
                text: '新增',
                key: 'cpsExtraPayPost',
                func: this.addPage
              }, {
                text: '删除',
                key: 'cpsExtraPayListPut',
                type: 'danger',
                func: this.delete
              }, {
                text: '确认无误',
                key: 'cpsExtraConfirm',
                func: (vm) => {
                  return this.confirmAction(vm, 'Y')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }, {
                text: '取消确认',
                key: 'extraPaysConfirmCancelPut',
                func: (vm) => {
                  return this.confirmAction(vm, 'N')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }
            ]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true,
          renderColumns: true
        },
        searchParam: {
          employeeCode: '',
          employeeName: '',
          orgUnitId: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          groupId: '',
          personnelGroupCode: ''
        }
      }
    },
    methods: {
      /** 获取表头信息 */
      getColumns () {
        return new Promise(resolve => {
          req('getExtraPaysPerformanceListTitle').then(res => {
            this.table.columns = this.transformColumns(res)
            console.log(this.table.columns)
            resolve(res)
          })
        })
      },
      transformColumns (columns) {
        columns.map(column => {
          if ((/^itemKey[0-9]+/).test(column.prop)) {
            column.width = this.getColumnWidth(this.getStrLength(column.label))
            column.align = 'right'
            column.display = { mixin: (row, col) => this.currencyFormat(row[col]) }
          }
        })
        return columns
      },
      getColumnWidth (length) {
        if (length < 5) {
          return 100
        } else if (length < 7) {
          return 120
        } else if (length < 10) {
          return 140
        } else {
          return 180
        }
      },
      getStrLength (str) {
        return str.length
      },
      fetch (options = {}) {
        this.load()
        return Promise.all([this.getColumns(), this.getData(options)]).then(() => {
          this.loaded()
        })
      },
      /** 获取列表数据 */
      getData (options = {}) {
        return new Promise(resolve => {
          return req('getExtraPaysPerformanceList', options).then(res => {
            res.data.map(item => {
              if (item.checkMonth) {
                item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
              }
            })
            Object.keys(res).map(key => {
              this.table[key] = res[key]
            })
            resolve(res)
          })
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        const date = this.$refs.detailEdit
        date.checkMonth = dateFormat(date.checkMonth, 'YYYYMM')
        return date.save().then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
          }
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
