<template>
  <i-layout headerKey="cpsRacingAwardFirstQuery">
      <template slot="header">
        <i-form @search="search" @reset="reset">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.fullName"></el-input>
          </el-form-item>
          <el-form-item label="薪资组">
            <remote-select v-model="searchParam.groupId" dataKey="salaryGroup" :props="groupProps"></remote-select>
          </el-form-item>
          <el-form-item label="门店名称" >
            <el-input v-model="searchParam.orgName"></el-input>
          </el-form-item>
          <el-form-item label="小店名称">
            <el-input v-model="searchParam.orgUnitName" ></el-input>
          </el-form-item>
          <el-form-item label="是否合并小店">
            <i-select v-model="searchParam.isMerge" parameter="WHETHER_TYPE"></i-select>
          </el-form-item>
          <el-form-item label="小店赛马等级">
            <i-select v-model="searchParam.raceResults" parameter="AWARD_LEVEL">
            </i-select>
          </el-form-item>
          <el-form-item label="核算月份起">
            <el-date-picker
              v-model="searchParam.checkMonthStr"
              type="month"
              value-format="yyyy-MM"
              @change="handleEffectiveDateChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="核算月份止">
            <el-date-picker
              v-model="searchParam.checkMonthEnd"
              type="month"
              value-format="yyyy-MM"
              @change="handleEffectiveDateChange"
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
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/first-race-reward'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'

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
        reqConfig: { req: req, getName: 'getFirstRacingPageList' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {confirmStatus: 'Y'}, cancelParams: {confirmStatus: 'N'} },
        isolateConfig: { req: req, name: 'getFirstRacingData' },
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },

        /* table */
        table: {
          columns: [
            {prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left'},
            {prop: 'fullName', label: '姓名', align: 'left', width: '120', fixed: 'left'},
            {prop: 'groupName', label: '薪资组', align: 'left', width: '120'},
            {prop: 'checkMonth', label: '核算月份', align: 'left', width: '120'},
            {prop: 'orgName', label: '门店名称', align: 'left', width: '120'},
            {prop: 'orgUnitName', label: '小店名称', width: '120', align: 'left'},
            {prop: 'raceResults', label: '小店赛马结果等级', width: '120', align: 'left', display: { dict: 'AWARD_LEVEL' }},
            {prop: 'isMerge', label: '是否合并小店', width: '120', align: 'left', display: { dict: 'WHETHER_TYPE' }},
            {prop: 'mergeOrgName', label: '合并小店名称', align: 'left', width: '120'},
            {prop: 'raceResultsMerge', label: '合并小店赛马结果最高等级', align: 'left', width: '200', display: {dict: 'AWARD_LEVEL'}},
            {prop: 'standards', label: '发放标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'reward', label: '奖励金额', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'racingAward', label: '赛马奖励', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '一集群赛马奖励'
              },
              key: 'cpsRacingAwardFirstExport',
              req: config.getFirstRacingPageList
            },
            import: {
              key: 'cpsRacingAwardFirstImportPost',
              business: 'cps-racingAwardFirst',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '抽数',
              key: 'cpsRacingAwardFirstGet',
              func: this.isolatePolicy
            }, {
              text: '确认无误',
              key: 'cpsRacingAwardFirstPut',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }, {
              text: '取消确认',
              key: 'cpsRacingAwardFirstCancelConfirm',
              func: (vm) => {
                return this.confirmAction(vm, 'N')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }]
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        searchParam: {
          employeeCode: '',
          fullName: '',
          groupId: '',
          orgName: '',
          orgUnitName: '',
          isMerge: '',
          isMergeId: '',
          raceResults: '',
          checkMonthStr: '',
          checkMonthEnd: '',
          racingAward: ''
        }
      }
    },
    methods: {
      afterFetch (res) {
        res.data.map(item => {
          if (item.checkMonth) {
            item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
          }
        })
        return Promise.resolve(true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
