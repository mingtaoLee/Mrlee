<template>
  <i-layout headerKey="cpsTeamBuildPageSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="时间段">
          <!-- <i-select v-model="searchParam.period" parameter="HALF_YEAR"></i-select> -->
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
          <el-input v-model="searchParam.orgUnitCode" parameter="COMPONENT_TYPE"></el-input>
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
            >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                />
              </template>
            </el-table-column>
            <!--<el-table-column-->
              <!--label="操作"-->
              <!--fixed="right"-->
              <!--width="120"-->
              <!--align="center"-->
            <!--&gt;-->
              <!--<template slot-scope="scope">-->
                <!--<el-button-->
                  <!--v-for="(btn, idx) of tableScope.operator" size="mini"-->
                  <!--:key="idx"-->
                  <!--type="text"-->
                  <!--@click="btn.func(scope)">-->
                  <!--{{ btn.text }}-->
                <!--</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
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
  import req, { config } from 'api/compensation/data-collection/team-building-bonuses'
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
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        reqConfig: { req: req, getName: 'getTeamBuildingBonusesList' },
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
            { prop: 'parentUnitName', label: '组织名称', width: '140', align: 'left' },
            { prop: 'checkYear', label: '年份', width: '130', align: 'left' },
            { prop: 'dictItemName', label: '半年度', width: '130', align: 'left' },
            { prop: 'orgUnitName', label: '门店名称', width: '160', align: 'left' },
            { prop: 'orgUnitCode', label: '店编', width: '120', align: 'left' },
            { prop: 'beginRunDate', label: '开业日期', width: '140', align: 'left', display: {date: ''} },
            { prop: 'totalArea', label: '总建筑面积', width: '120', align: 'right' },
            { prop: 'unitIncome', label: '收入单价（元/平方米）', width: '160', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'totalIncome', label: '收入合计（万元）', width: '140', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'totalSpend', label: '时间段内费用（万元）', width: '160', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'profit', label: '利润（万元）', width: '130', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            import: {
              business: 'cps-teamBuildProfit',
              key: 'cpsTeamBuildImportGet',
              show: () => ({ empty: false })
            },
            export: {
              config: {
                fileName: '筹建团队分红'
              },
              req: config.getTeamBuildingBonusesList,
              key: 'cpsTeamBuildExportGet'
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
            toolbar: [{
              text: '确认无误',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
              },
              key: 'teamProfitConfirm',
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
          period: '',
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
      addPolicy () {
        this.id = ''
        this.dialogTitle = '筹建团队新增'
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.id = scope.row.id
        this.dialogTitle = '筹建团队修改'
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
