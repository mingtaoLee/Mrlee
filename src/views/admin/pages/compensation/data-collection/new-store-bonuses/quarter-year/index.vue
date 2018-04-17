<template>
  <i-layout :borderWidth="0" :padding="0" :margin="0" headerKey="cpsNewProfitBonusGet">
    <template slot="header">
      <i-form @search="search" @reset="reset" ref="iForm">
        <el-form-item label="区域">
          <i-select-area v-model="searchParam.areaId" type="yonghui" search></i-select-area>
        </el-form-item>
        <!--<el-form-item label="门店名称">-->
          <!--&lt;!&ndash; <el-input v-model="searchParam.orgUnitName"></el-input> &ndash;&gt;-->
          <!--<i-select-tree-->
            <!--:multiple="false"-->
            <!--dataKey="org"-->
            <!--nodeKey="orgUnitId"-->
            <!--v-model="searchParam.orgUnitId"-->
            <!--size="small"-->
          <!--&gt;</i-select-tree>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="店编">-->
          <!--<el-input v-model="searchParam.orgUnitCode"></el-input>-->
        <!--</el-form-item>-->
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
        <el-form-item label="开店日期起">
          <el-date-picker
            v-model="searchParam.openDateStart"
            type="date"
            value-format="yyyy-MM-dd"
            @change="handleEffectiveDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开店日期止">
          <el-date-picker
            v-model="searchParam.uneffectiveDate"
            type="date"
            value-format="yyyy-MM-dd"
            @change="handleUneffectDateChange"
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
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/new-store-bonuses'
  import RemoteSelect from 'components/compensation/remote-select'
  import {showMessage, windowOpen} from 'utils/index'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin, isolateMixin],
    components: {
      IsolateEdit,
      RemoteSelect
    },
    data () {
      return {
        // 人事范围选择器配置
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'getNewStoreBonusesList' },
        isolateConfig: { req: req, name: 'getNewProfitsBonusOne' },
        extraOption: () => {
          return { checkCycleType: '1' }
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
            {prop: 'provinceAreaName', label: '省区', align: 'left', width: '120'},
            {prop: 'areaName', label: '区域', align: 'left', width: '120'},
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
//            {prop: 'orgUnitCode', label: '店编', align: 'left', width: '120'},
//            {prop: 'orgUnitName', label: '门店名称', align: 'left', width: '140'},
            {prop: 'beginRunDate', label: '开店日期', width: '120', align: 'left', display: {date: 'default'}},
            {prop: 'checkMonth', label: '核算月份', width: '120', align: 'left'},
            {prop: 'timeSlot', label: '核算时间段', width: '120', align: 'left'},
            {prop: 'targetSellAmount', label: '目标销售额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'sellAmount', label: '实际销售额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'finishRate', label: '销售完成率', width: '120', align: 'right'},
            {prop: 'profitAmount', label: '实际利润总额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'bonusProp', label: '分红比例', width: '120', align: 'right'},
            {prop: 'storeBonus', label: '门店奖金包', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'status', label: '审批状态', align: 'left', width: '140', display: {dict: 'APPROVAL_STATE'}}
//            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '新店利润分红包季度'
              },
              key: 'cpsNewProfitBonusExport',
              req: config.getNewStoreBonusesList
            },
            import: {
              key: 'cpsNewProfitBonusQuarterYear',
              business: 'cps-new-store-profit-bonus-quarter',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '抽数',
              key: 'cpsNewBonusSync',
              func: this.isolatePolicy
            }, {
              text: '发起审批',
              key: 'cpsNewProfitBonusPut',
              func: this.approval
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          personnelGroupCode: '',
          areaId: '',
          orgUnitName: '',
          orgUnitId: '',
          orgUnitCode: '',
          effectiveDate: '',
          uneffectiveDate: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          checkCycleType: 1
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
      init () {
        this.table.search = { checkCycleType: 1 }
      },
      approval () {
        if (this.isSelected()) {
          const ID_DATA = this.currentSelected.map(v => v.id)
          windowOpen('/flow.html#/flow/newStoreProfitBonusWorkflow', {processType: 'newStoreProfitBonusWorkflow', id: ID_DATA.toString()})
        } else {
          showMessage('info', '请至少选择一项')
        }
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
