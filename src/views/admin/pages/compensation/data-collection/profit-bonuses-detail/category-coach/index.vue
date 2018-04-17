<template>
  <div headerKey="cpsProfitBonusClassCoachDetailsGet">
    <i-layout :borderWidth="0" :padding="0" :margin="0">
      <template slot="header">
        <i-form @search="search" @reset="reset" ref="iForm">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeId"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.employeeName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="职务">
            <el-input v-model="searchParam.posTitleId"></el-input>
          </el-form-item> -->
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
          <el-form-item label="组织代码">
            <el-input v-model="searchParam.orgUnitCode"></el-input>
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
          ref="iTable"
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
    <i-dialog
      v-model="isShowDialog"
      :title="currentTitle"
      size="small"
      :toolbar="commonToolbar"
      destroyedWhenClose
    >
      <component ref="currentComponent" :is="currentComponent" :selected="currentSelected"></component>
    </i-dialog>
  </div>
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/profit-bonuses-detail'
  import RemoteSelect from 'components/compensation/remote-select'
  import {showMessage} from 'utils/index'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'
  import moment from 'moment'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin, isolateMixin],
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
        dataConfirmConfig: { req: req, name: 'categoryCoachConfirmData', params: {} },
        isolateConfig: { req: req, name: 'getNewProfitsBonusTwo' },
        reqConfig: { req: req, getName: 'getCategoryCoachList', deleteListName: '' },
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
        // 当前除调入弹窗外内嵌组件
        currentComponent: null,
        // 当前公用弹窗头部信息
        currentTitle: '',
        // 当前选中的行数据
        currentSelected: [],
        // 待调入
        isTransfer: false,
        transferToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              done()
            }
          },
          {
            text: '调入',
            func: done => {
              this.handleTransferConfirm(done)
            }
          }
        ],
        /* 公用toolbar */
        commonToolbar: [
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
              this.handleConfirm(done)
            }
          }
        ],
        isShowDialog: false,
        /* table */
        table: {
          columns: [
            {prop: 'employeeCode', label: '工号', width: '120', align: 'left', fixed: 'left'},
            {prop: 'employeeName', label: '姓名', width: '120', align: 'left', fixed: 'left'},
            {prop: 'areaName', label: '区域', align: 'left', width: '120'},
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '100' },
            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
            {prop: 'orgUnitCode', label: '组织代码', align: 'left', width: '120'},
            {prop: 'orgUnitName', label: '组织名称', align: 'left', width: '120'},
            {prop: 'posTitleName', label: '职务', width: '120', align: 'left'},
            {prop: 'checkMonth', label: '核算月份', align: 'left', width: '120'},
            {prop: 'areaProfit', label: '区域利润', width: '120', align: 'right'},
            {prop: 'areaBonusRate', label: '区域分红比例', width: '120', align: 'right'},
            {prop: 'discountCoef', label: '区域发放标准', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'areaOldProfitBonus', label: '区域老店/次新店利润分红', width: '180', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'areaNewProfitBonus', label: '区域新店利润分红', width: '160', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'storeCount', label: '门店数（含新店）', width: '160', align: 'right'},
            {prop: 'storeProfit', label: '兼店门店利润', width: '140', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'storeBonusRate', label: '兼店门店分红比例', width: '140', align: 'right'},
            {prop: 'storeCoef', label: '兼店门店发放系数', width: '140', align: 'right'},
            {prop: 'storeProfitBonus', label: '兼店门店利润分红', width: '140', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'shouldProfitBonus', label: '应发利润分红', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '品类教练'
              },
              req: config.getCategoryCoachList,
              key: 'cpsProfitBonusClassCoachDetailsExport'
            },
            import: {
              key: 'cpsProfitBonusClassCoachDetailsImport',
              business: 'cps-profitBonusClassCoach',
              show: () => ({ empty: false })
            },
            operator: [
//              {
//                text: '查看明细',
//                key: '',
//                func: this.checkDetail
//              }
            ],
            toolbar: [{
              text: '抽数',
              key: 'cpsFirstProfitBonusSync',
              func: this.isolatePolicy
            }, {
              text: '确认无误',
              key: 'cpsProfitBonusClassCoachDetailsPut',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
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
          orgUnitCode: '',
          orgUnitId: '',
          employeeId: '',
          employeeName: '',
          posTitleId: '',
          areaId: '',
          groupId: '',
          personnelGroupCode: '',
          checkMonthStart: '',
          checkMonthEnd: ''
        }
      }
    },
    created () {
      this.$eventBus.$on('initLayout1', this.initLayout)
    },
    beforeDestroy () {
      this.$eventBus.$off('initLayout1', this.initLayout)
    },
    methods: {
      initLayout () {
        this.$refs.iForm && this.$refs.iForm.initLayout()
      },
      afterFetch (res) {
        res.data.map(item => {
          if (item.checkMonth) {
            item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
          }
        })
        return Promise.resolve(true)
      },
      openCommonDialog () {
        this.isShowDialog = true
      },
      handleConfirm (done) {
        this.$refs.currentComponent.save().then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
          }
        })
      },

      /** 打开分配薪资组弹窗 */
      distribute ({row}) {
        // 如果是行内分配薪资组，则重置已选人员为当前行
        if (row) this.currentSelected = [row]
//        this.handleToggleComponent(row, '分配薪资组', () => import('../group-employee/distribute'))
      },

      /** 判断是否已有选择 */
      isSelected () {
        this.currentSelected = this.$refs.iTable.getMultipleSelection()
        return !!this.currentSelected.length
      },

      /** 处理弹窗组件切换 */
      handleToggleComponent (row, title, component, message = '请选择一项！') {
        if (row || this.isSelected()) {
          this.currentTitle = title
          this.currentComponent = component
          this.openCommonDialog()
        } else {
          showMessage('info', message)
        }
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
