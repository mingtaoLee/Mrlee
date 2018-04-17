<template>
  <div>
    <i-layout headerKey="cpsProfitBonusTwoClustersDetailsGet">
      <template slot="header">
        <i-form @search="search" @reset="reset">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeId"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.employeeName"></el-input>
          </el-form-item>
          <el-form-item label="区域">
            <i-select-area v-model="searchParam.areaId" type="yonghui" search></i-select-area>
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
          <el-form-item label="核算月份起">
            <el-date-picker
              v-model="searchParam.checkMonthStart"
              type="month"
              :picker-options="effectStartOptions"
              @change="handleChekMonthStartChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="核算月份止">
            <el-date-picker
              v-model="searchParam.checkMonthEnd"
              type="month"
              :picker-options="effectEndOptions"
              @change="handleCheckMonthEndChange"
            >
            </el-date-picker>
          </el-form-item>
        </i-form>
      </template>
      <template slot="section">
      <i-table
        class="table"
        :table="table"
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
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
              :fixed="col.fixed"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowIsolate"
        title="抽数"
        size="mini"
        :toolbar="isolateEditToolbar"
        destroyedWhenClose
      >
        <isolate-edit ref="isolateEdit" :id="id"></isolate-edit>
      </i-dialog>
    </template>
    </i-layout>
  </div>
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/two-clusters'
  import RemoteSelect from 'components/compensation/remote-select'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'
  import moment from 'moment'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, ConfirmDataMixin, isolateMixin],
    components: {
      IsolateEdit,
      RemoteSelect
    },
    data () {
      return {
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        isolateConfig: { req: req, name: 'getTwoClustersSyncData' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {orgClusterType: '2'} },
        reqConfig: { req: req, getName: 'postTwoClusters' },
        effectStartOptions: {
          disabledDate: (time) => {
            if (!this.searchParam.checkMonthEnd) return false
            return time.getTime() > Date.parse(this.searchParam.checkMonthEnd) - 3600 * 1000 * 24
          }
        },
        effectEndOptions: {
          disabledDate: (time) => {
            if (!this.searchParam.checkMonthStart) return false
            return time.getTime() < Date.parse(this.searchParam.checkMonthStart) - 3600 * 1000 * 24
          }
        },
        extraOption: () => {
          return {orgClusterType: '2'}
        },
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        // 人事范围选择器配置
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        /* table */
        table: {
          columns: [
            {prop: 'employeeCode', label: '工号', width: '120', align: 'left', fixed: 'left'},
            {prop: 'employeeName', label: '姓名', width: '120', align: 'left', fixed: 'left'},
            {prop: 'areaName', label: '区域', align: 'left', width: '120'},
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', width: '120', align: 'left' },
            { prop: 'groupName', label: '薪资组名称', width: '120', align: 'left' },
            {prop: 'posTitleName', label: '职务', width: '120', align: 'left'},
            {prop: 'checkMonth', label: '核算月份', width: '120', align: 'left'},
            {prop: 'profitAll', label: '利润', align: 'right', width: '120'},
            {prop: 'profitSharing', label: '利润分红', width: '120', align: 'right'},
            {prop: 'guarantees', label: '保底分红', width: '120', align: 'right'},
            {prop: 'gamesPrizes', label: '赛马分红', width: '120', align: 'right'},
            {prop: 'endProfit', label: '最终发放分红', width: '120', align: 'right'},
            { prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' } },
            { prop: 'createBy', label: '操作者', align: 'left', width: '120' },
            { prop: 'createDate', label: '操作时间', align: 'left', width: '160', display: { date: 'long' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '二集群利润分红明细'
              },
              req: config.postTwoClusters,
              key: 'cpsProfitBonusTwoClustersDetailsExport'
            },
            import: {
              business: 'cps-profit-twoClusters',
              key: 'cpsProfitBonusTwoClustersDetailsImport',
              show: () => ({ empty: false })
            },
            toolbar: [
              {
                text: '抽数',
                key: 'cpsTwoProfitBonusSync',
                func: this.isolatePolicy
              }, {
                text: '确认无误',
                key: 'cpsProfitBonusTwoClustersDetailsPut',
                func: (vm) => {
                  return this.confirmAction(vm, 'Y')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }, {
                text: '取消确认',
                key: 'cpsProfitBonusTwoClustersUnconfirmPut',
                func: (vm) => {
                  return this.confirmAction(vm, 'N')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }
            ]
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        searchParam: {
          employeeId: '',
          employeeName: '',
          posTitleId: '',
          areaId: '',
          groupId: '',
          checkMonthStart: '',
          checkMonthEnd: '',
          orgClusterType: '2'
        }
      }
    },
    methods: {
      init () {
        this.table.search = { orgClusterType: '2' }
      },
      reset () {
        this.isSearch = false
        Object.keys(this.searchParam).map(key => {
          if (key !== 'orgClusterType') {
            this.searchParam[key] = ''
          }
        })
      },
      afterFetch (res) {
        res.data.map(item => {
          if (item.checkMonth) {
            item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
          }
        })
        return Promise.resolve(true)
      },
      handleChekMonthStartChange (value) {
        this.searchParam.checkMonthStart = value ? moment(value).format('YYYY-MM-DD') : ''
      },
      handleCheckMonthEndChange (value) {
        this.searchParam.checkMonthEnd = value ? moment(value).format('YYYY-MM-DD') : ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
