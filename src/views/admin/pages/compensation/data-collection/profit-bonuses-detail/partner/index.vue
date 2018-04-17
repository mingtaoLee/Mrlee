<template>
  <div headerKey="cpsProfitBonusPartnerDetailsGet">
    <i-layout :borderWidth="0" :padding="0" :margin="0">
      <template slot="header">
        <i-form @search="search" @reset="reset" ref="iForm">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeId"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.employeeName"></el-input>
          </el-form-item>
          <el-form-item label="区域">
            <i-select-area
            v-model="searchParam.areaId"
            type="yonghui"
            search
          ></i-select-area>
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
              lazy
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
          <el-form-item label="核算月份起">
            <el-date-picker
              v-model="searchParam.effectiveDateStart"
              type="month"
              :picker-options="effectStartOptions"
              @change="handleEffectiveDateStartChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="核算月份止">
            <el-date-picker
              v-model="searchParam.effectiveDateEnd"
              type="month"
              :picker-options="effectEndOptions"
              @change="handleEffectiveDateEndChange"
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
        dataConfirmConfig: { req: req, name: 'partnerConfirmData', params: {confirmStatus: 'Y'}, cancelParams: {confirmStatus: 'N'} },
        isolateConfig: { req: req, name: 'getNewProfitsBonusFour' },
        reqConfig: { req: req, getName: 'getPartnerList', deleteListName: '' },
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
            {prop: 'provinceAreaName', label: '省/区', align: 'left', width: '120'},
            {prop: 'areaName', label: '区域', align: 'left', width: '120'},
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围', align: 'left', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '100' },
            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
            // {prop: 'orgCode', label: '组织代码', align: 'left', width: '120'},
            {prop: 'orgUnitName', label: '组织名称', align: 'left', width: '120'},
            {prop: 'posTitleName', label: '职务', align: 'left', width: '120'},
            {prop: 'jobName', label: '职位', align: 'left', width: '120'},
            {prop: 'hireDate', label: '入职日期', align: 'left', width: '120', display: { date: 'default' }},
            {prop: 'employeeStatus', label: '员工状态', align: 'left', width: '120', display: { dict: 'EMPLOYEE_STATUS' }},
            {prop: 'checkMonth', label: '核算月份', align: 'left', width: '120'},
            {prop: 'varyWithHourstd', label: '是否随时效变动', align: 'left', width: '120', display: { dict: 'WHETHER_TYPE' }},
            {prop: 'level', label: '保底分红档级', align: 'left', width: '120', display: { dict: 'BONUS_LOWEST_LEVEL' }},
            {prop: 'levelNorm', label: '保底分红档级-标准', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'shouldBonus', label: '保底分红档级-应发', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'storeCode', label: '上月店编', align: 'left', width: '120'},
            {prop: 'storeName', label: '上月门店名称', align: 'left', width: '120'},
            {prop: 'beginRunDate', label: '开业日期', align: 'left', width: '120', display: { date: 'default' }},
            {prop: 'shopName', label: '上月小店名称', align: 'left', width: '120'},
            {prop: 'storeProfit', label: '门店利润/小店利润', align: 'right', width: '160', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'defualtProfitBonus', label: '标准档-人均奖金', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'oneProfitBonus', label: '一级保护档-人均奖金', align: 'right', width: '160', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'towProfitBonus', label: '二级保护档-人均奖金', align: 'right', width: '160', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'profitBonus', label: '人均奖金-取值', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'reward', label: '赛马奖励', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'storeCoef', label: '门店发放系数', align: 'right', width: '120'},
            {prop: 'preWageStandard', label: '原工资标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'isCompare', label: '是否与原工资标准对比', align: 'left', width: '160', display: { dict: 'WHETHER_TYPE' }},
            {prop: 'shouldProfitBonus', label: '利润分红-应发', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'realProfitBonus', label: '利润分红-实发', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'workAmonth', label: '个人实际工时', align: 'right', width: '120'},
            {prop: 'planWork', label: '个人排班工时', align: 'right', width: '120'},
            {prop: 'isLssue', label: '是否发分红奖金', align: 'left', width: '140', display: { dict: 'WHETHER_TYPE' }},
            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '合伙人'
              },
              req: config.getPartnerList,
              key: 'cpsProfitBonusPartnerDetailsExport'
            },
            import: {
              key: 'cpsProfitBonusPartnerDetailsImport',
              business: 'cps-profitBonusPartner',
              show: () => ({ empty: false })
            },
            operator: [
//              {
//                text: '查看明细',
//                key: '',
//                func: this.checkDetail
//              }
            ],
            toolbar: [
              {
                text: '抽数',
                key: 'cpsFirstProfitBonusSync',
                func: this.isolatePolicy
              }, {
                text: '确认无误',
                key: 'cpsProfitBonusPartnerDetailsPut',
                func: (vm) => {
                  return this.confirmAction(vm, 'Y')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }, {
                text: '取消确认',
                key: 'profitBonusConfirmCancelPut',
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
          jobId: '',
          personnelGroupCode: '',
          effectiveDateStart: '',
          effectiveDateEnd: ''
        }
      }
    },
    created () {
      this.$eventBus.$on('initLayout3', this.initLayout)
    },
    beforeDestroy () {
      this.$eventBus.$off('initLayout3', this.initLayout)
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
