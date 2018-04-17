<template>
  <div>
    <i-layout headerKey="cpsThreeClustersOkrAssessmentBonusPackGet">
      <template slot="header">
        <i-form @search="search" @reset="reset">
          <el-form-item label="类别">
            <i-select
              v-model="searchParam.businessTypeId"
              :options="businessTypeList"
              :props="businessProps"
              :async="false"
            >
            </i-select>
            <el-input v-model="searchParam.businessTypeId"></el-input>
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
          <el-form-item label="核算时间段起">
            <el-date-picker
              v-model="searchParam.checkMonthStart"
              type="month"
              :picker-options="effectStartOptions"
              @change="handleChekMonthStartChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="核算时间段止">
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
              >
              </el-table-column>
            </el-table>
          </template>
        </i-table>
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
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/okr-assessment-bonus-package'
  import {showMessage, windowOpen} from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import moment from 'moment'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin],
    components: {
      RemoteSelect
    },
    data () {
      return {
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'getOkrAssessmentBonusPackage' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        extraOption: () => {
          return { checkCycleType: '1' }
        },
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
        // 当前除调入弹窗外内嵌组件
        currentComponent: null,
        // 当前公用弹窗头部信息
        currentTitle: '',
        // 当前选中的行数据
        currentSelected: [],
        businessTypeList: [],
        businessProps: {
          value: 'businessCode',
          label: 'businessName'
        },
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
            {prop: 'businessType', label: '类别', align: 'left', width: '120', display: {dict: 'ORG_BUSINESS_TYPE'}},
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
            {prop: 'checkMonth', label: '核算时间段', align: 'left', width: '120'},
            {prop: 'partnerCount', label: '合伙人编制', align: 'right', width: '120'},
            {prop: 'foundationPreSum', label: '合伙人保底分红求和', width: '150', align: 'right'},
            {prop: 'decreaseEffect', label: '同比降控成效', width: '120', align: 'right'},
            {prop: 'decreaseEffectRatio', label: '同比降控成效分红系数', width: '160', align: 'right'},
            {prop: 'qualityEvalScore', label: '质效考评得分', width: '120', align: 'right'},
            {prop: 'qualityEvalRank', label: '质效考评结果等级', width: '130', align: 'left'},
            {prop: 'qualityEvalRatio', label: '质效考评分红系数', width: '130', align: 'right'},
            {prop: 'teamShouldBonus', label: '应发团队分红额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'perCapitaBonus', label: '人均奖励分红额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '三集群OKR考核分红包'
              },
              key: 'cpsThreeClustersOkrAssessmentBonusPackExport',
              req: config.getOkrAssessmentBonusPackage
            },
            import: {
              key: 'cpsThreeClustersOkrAssessmentBonusPackImport',
              business: 'cps-okr-assessmentPack',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '发起审批',
              key: 'cpsOkrApplyProcess',
              func: this.approval
            }, {
              text: '确认无误',
              key: 'cpsThreeClustersOkrAssessmentBonusPackPut',
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
          businessTypeId: '',
          orgUnitName: '',
          orgUnitCode: ''
          // checkMonthStart: '',
          // checkMonthEnd: ''
        }
      }
    },
    created () {
      this.getBusinessTypeList()
    },
    methods: {
      approval () {
        if (this.isSelected()) {
          const ID_DATA = this.currentSelected.map(v => v.id)
          windowOpen('/flow.html#/flow/okrAssessmentPackage', {processType: 'okrAssessmentPackage', id: ID_DATA.toString()})
        } else {
          showMessage('info', '请选择一项')
        }
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
        return this.currentSelected.length === 1
        // return !!this.currentSelected.length
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
      },
      // 获取类别选择框
      getBusinessTypeList () {
        req('getBusinessTypeId')
        .then(res => {
          this.businessTypeList = res
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
