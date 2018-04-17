<template>
  <i-layout headerKey="cpsFirmProfitGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="年份">
          <el-date-picker
            v-model="searchParam.checkYear"
            type="year"
            @change="handleCheckYearChange"
            :picker-options="checkYearOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商行">
          <i-select v-model="searchParam.firmName" parameter="FIRM_ID"></i-select>
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
              :formatter="tableScope.formatter"
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
        :title="title"
        width="800px"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :idKey="idKey" :id="id"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/firm-operating-costs'
  import DetailEdit from './detail-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import moment from 'moment'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin],
    components: {
      DetailEdit
    },
    data () {
      return {
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'getFirmOperatingCostsList', deleteName: 'delFirmOperatingCosts' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        checkYearOptions: {
          // disabledDate: (time) => {
          //   return time.getTime() > Date.parse(this.searchParam.checkYear) - 3600 * 1000 * 24
          // }
        },
        // currentRowData: {},
        title: '商行运营成本',
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
          columns: [
            { prop: 'checkYear', label: '年份', width: '130', align: 'left' },
            { prop: 'firmName', label: '商行名称', width: '160', align: 'left', display: {dict: 'FIRM_ID'} },
            { prop: 'checkMonthOne', label: '1月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthTwo', label: '2月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthThree', label: '3月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthFour', label: '4月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthFive', label: '5月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthSix', label: '6月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthSeven', label: '7月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthEight', label: '8月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthNine', label: '9月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthTen', label: '10月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthEleven', label: '11月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'checkMonthTwelve', label: '12月', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '商行运营成本'
              },
              key: 'cpsFirmProfitExport',
              req: config.getFirmOperatingCostsList
            },
            import: {
              key: 'cpsFirmProfitImportPost',
              business: 'cps-FirmProfit',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'cpsFirmProfitPut',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'cpsFirmProfitDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '确认无误',
              key: 'cpsFirmProfitConfirm',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        },
        // 查询参数
        searchParam: {
          firmName: '',
          checkYear: null
        }
      }
    },
    methods: {
      // modifyRow (scope) {
      //   this.currentRowData = scope.row
      //   this.title = '商行运营修改'
      //   this.openDetailDialog()
      // },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleCheckYearChange (value) {
        this.searchParam.checkYear = value ? moment(value).format('YYYY') : ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
