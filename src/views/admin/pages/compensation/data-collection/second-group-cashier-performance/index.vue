<template>
  <i-layout headerKey="cpsCashPerfSecondClusterPageSelectPost">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
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
          <!-- <remote-select
            v-model="searchParam.groupId"
            dataKey="salaryGroup"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['groupCode', 'groupName']"
            :props="groupProps"
          ></remote-select> -->
          <remote-select v-model="searchParam.groupId" dataKey="salaryGroup" :props="groupProps"></remote-select>
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
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                ></i-table-cell>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        title="收银绩效设置"
        size="large"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :id="id"></detail-edit>
      </i-dialog>
      <i-dialog
        v-model="isShowDetailDialog"
        title="收银奖惩项目明细"
        destroyedWhenClose
      >
        <detail ref="detail" :row="currentRow"></detail>
      </i-dialog>
      <i-dialog
        v-model="isShowIsolate"
        title="抽数"
        size="mini"
        :toolbar="isolateEditToolbar"
        destroyedWhenClose
      >
        <isolate-edit ref="isolateEdit" :isolateId="isolateId"></isolate-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/cashier-performance'
  import DetailEdit from './detail-edit'
  import Detail from './detail'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin, isolateMixin],
    components: {
      DetailEdit,
      IsolateEdit,
      Detail,
      RemoteSelect
    },
    data () {
      return {
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        dataConfirmConfig: { req: req, name: 'confirmData', params: {clusterType: '2', orgClusterType: '2'} },
        isolateConfig: { req: req, name: 'getSyncSecondData' },
        reqConfig: { req: req, getName: 'getCashierPerformanceList', deleteName: 'deleteCashierPerformance', deleteListName: 'deleteCashierPerformanceList' },
        // 额外支付
        extraOption: () => {
          return {clusterType: '2', orgClusterType: '2'}
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
        // 当前点击行数据
        currentRow: [],
        // 详情编辑弹窗控制条
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,
        isShowDetailDialog: false,
        isolateId: String,
        // i-table表格数据
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', width: '120', align: 'left', fixed: 'left' },
            { prop: 'areaName', label: '区域', width: '120', align: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
            // { prop: 'groupCode', label: '薪资组代码', width: '120', align: 'left' },
            { prop: 'groupName', label: '薪资组名称', width: '120', align: 'left' },
            { prop: 'jobName', label: '职位', width: '120', align: 'left' },
            { prop: 'checkMonth', label: '核算月份', width: '120', align: 'left' },
            { prop: 'hireDate', label: '入职时间（仅做收银员）', align: 'left', width: '170', display: {date: ''} },
            { prop: 'efficency', label: '个人收银效率', align: 'right', width: '120' },
            { prop: 'manHourRate', label: '工时利用率', align: 'right', width: '120' },
            { prop: 'cashServiceNum', label: '月服务顾客数', align: 'right', width: '130' },
            { prop: 'cashTranNum', label: '门店客单数', align: 'right', width: '120' },
            { prop: 'clusterEfficiency', label: '集群平均效率', align: 'right', width: '120' },
            { prop: 'rewardRatio', label: '奖励系数', align: 'right', width: '120' },
            { prop: 'cashBonus', label: '收银奖励', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashTotal', label: '奖惩合计', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashPerf', label: '收银绩效', align: 'right', width: '120' },
            { prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '二集群收银绩效'
              },
              req: config.getCashierPerformanceList,
              key: 'cpsCashPerfSecondClusterExportGet'
            },
            import: [
              {
                key: 'cpsTwoClusterCashPerfImport',
                business: 'cps-secondClusterCashPerf',
                show: () => ({ empty: false })
              },
              {
                text: '导入明细',
                key: 'cpsTwoClusterCashPerfDetailImport',
                business: 'cps-twoCashPerfDetail',
                show: () => ({ empty: false })
              }
            ],
            editor: {
              cashTotal: {
                type: 'button',
                func: (row, col) => {
                  this.openDetail(row)
                }
              }
            },
            operator: [
//              {
//                text: '查看',
//                key: '',
//                func: this.openDetail
//              }
            ],
            toolbar: [{
              text: '抽数',
              key: 'cpsTwoCashPerSync',
              func: this.isolatePolicy
            }, {
              text: '确认无误',
              key: 'cashPerfSecondDateConfirm',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }, {
              text: '取消确认',
              key: 'cashPerfSecondDateConcelPut',
              func: (vm) => {
                return this.confirmAction(vm, 'N')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }]
//              {
//                text: '新增',
//                func: this.addPolicy
//              }, {
//                text: '删除',
//                type: 'danger',
//                func: this.delete
//              }, {
//                text: '导入',
//                func: this.import
//              }
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          groupId: '',
          employeeCode: '',
          employeeName: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          clusterType: '2',
          orgClusterType: '2'
        }
      }
    },
    methods: {
      init () {
        this.table.search = { clusterType: '2', orgClusterType: '2' }
      },
      afterFetch (res) {
        res.data.map(item => {
          if (item.checkMonth) {
            item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
          }
        })
        return Promise.resolve(true)
      },
      /** 打开详情页 */
      openDetailPage (scope) {
      },
      openDetail (row) {
        this.currentRow = row
        this.isShowDetailDialog = true
      },
      addPolicy () {
        this.id = ''
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.id = scope.row.id
        this.openDetailDialog()
      },
      openDetailDialog () {
        this.isShowDialog = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
