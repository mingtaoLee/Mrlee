<template>
  <i-layout headerKey="cpsTeamExpandPageSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="核算时间段">
          <div class="block checkYear">
            <el-date-picker
              v-model="searchParam.checkYear"
              type="year">
            </el-date-picker>
          </div>
          <div class="block checkMonth">
            <i-select v-model="searchParam.checkMonth" parameter="HALF_YEAR"></i-select>
          </div>
        </el-form-item>
        <el-form-item label="门店名称">
          <!-- <el-input v-model="searchParam.orgUnitName" parameter="COMPONENT_TYPE"></el-input> -->
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="searchParam.orgUnitId"
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="门店编号">
          <el-input v-model="searchParam.orgUnitCode"></el-input>
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
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :fixed="col.fixed"
            >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                />
              </template>
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="dialogTitle"
        width="800px"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :componentId="id"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/team-development-bonuses'
  import DetailEdit from './detail-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import moment from 'moment'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, ConfirmDataMixin],
    components: {
      DetailEdit
    },
    data () {
      return {
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        reqConfig: { req: req, getName: 'getTeamDevBonusesList' },
        dialogTitle: '',
        /* detail-edit */
        detailEditToolbar: [
          {
            text: '取消',
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

        /* table */
        table: {
          columns: [
            { prop: 'parentUnitName', label: '组织名称', width: '140', fixed: 'left', align: 'left' },
            { prop: 'period', label: '核算时间段', width: '120', fixed: 'left', align: 'left' },
            { prop: 'orgUnitName', label: '门店名称', width: '160', fixed: 'left', align: 'left' },
            { prop: 'orgUnitCode', label: '店编', width: '120', fixed: 'left', align: 'left' },
            { prop: 'beginRunDate', label: '开业日期', width: '120', align: 'left', display: {date: ''}, fixed: 'left' },
            { prop: 'monthNodeOne', label: '月份节点一', width: '130', align: 'left' },
            { prop: 'nodeProfitOne', label: '节点一利润', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'monthNodeTwo', label: '月份节点二', width: '130', align: 'left', display: {date: ''} },
            { prop: 'nodeProfitTwo', label: '节点二利润', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'monthNodeThree', label: '月份节点三', width: '130', align: 'left' },
            { prop: 'nodeProfitThree', label: '节点三利润', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'bonus', label: '收入/奖惩金额', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'totalSpend', label: '核算时间段内费用', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'totalProfit', label: '利润', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } }
//            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            import: {
              key: 'cpsTeamExpandImportGet',
              business: 'cps-teamExpandProfit',
              show: () => ({ empty: false })
            },
            export: {
              config: {
                fileName: '拓展团队分红'
              },
              req: config.getTeamDevBonusesList,
              key: 'cpsTeamExpandExportGet'
            },
            operator: [
//              {
//                text: '修改',
//                key: '',
//                func: this.modifyRow
//              },
//              {
//                text: '删除',
//                key: '',
//                func: this.deleteRow
//              }
            ],
            toolbar: [
//            {
//              text: '确认无误',
//              func: this.confirmDataAction,
//              key: '',
//              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
//            }
            ]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        },
        // 查询参数
        searchParam: {
          period: '',
          checkYear: '',
          checkMonth: '',
          orgUnitName: '',
          orgUnitId: '',
          orgUnitCode: ''
        }
      }
    },
    methods: {
      search () {
        this.allParam.pageIndex = 1
        if (this.judgeHasSearchParam()) this.isSearch = true
        this.table.search = Object.assign({}, this.searchParam)
        this.table.search.checkYear = this.searchParam.checkYear ? moment(this.searchParam.checkYear).format('YYYY') : ''
      },
//      addPolicy () {
//        this.id = ''
//        this.dialogTitle = '筹建团队新增'
//        this.openDetailDialog()
//      },
      modifyRow (scope) {
        this.id = scope.row.id
        this.dialogTitle = '修改拓展团队分红'
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('delClothingList', {id: scope.row.id}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn { margin-top: 10px; }
  .checkYear { width: 53%; float: left; }
  .checkMonth { width: 45%; float: right; }
</style>
