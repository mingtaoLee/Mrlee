<template>
  <i-layout headerKey="cpsRacingAwardSecondQuery">
      <template slot="header">
        <i-form @search="search" @reset="reset">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.fullName"></el-input>
          </el-form-item>
          <el-form-item label="业态">
            <i-select v-model="searchParam.businessType" parameter="ORG_BUSINESS_TYPE"></i-select>
          </el-form-item>
          <el-form-item label="组织名称">
            <i-select-tree
              v-model="searchParam.orgUnitId"
              :multiple="false"
              dataKey="org"
              nodeKey="orgUnitId"
              size="small"
            ></i-select-tree>
          </el-form-item>
          <el-form-item label="职务">
            <i-select
              dataKey="posTitles"
              v-model="searchParam.posTitleId"
              :props="posTitleProps"
            ></i-select>
          </el-form-item>
          <el-form-item label="薪资组">
            <remote-select v-model="searchParam.groupId" dataKey="salaryGroup" :props="groupProps"></remote-select>
          </el-form-item>
          <el-form-item label="核算月份起">
            <el-date-picker
              v-model="searchParam.checkMonthStr"
              type="month"
              value-format="yyyy-MM"
              @change="handleEffectiveDateChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="核算月份止">
            <el-date-picker
              v-model="searchParam.checkMonthEnd"
              type="month"
              value-format="yyyy-MM"
              @change="handleEffectiveDateChange"
            ></el-date-picker>
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
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/two-race-reward'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, ConfirmDataMixin],
    components: { RemoteSelect },
    data () {
      return {
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        reqConfig: { req: req, getName: 'getTwoRacingPageList' },
        // 职务配置选项
        posTitleProps: {
          value: 'posTitleId',
          label: 'name'
        },
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        isShowDialog: false,

        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        /* table */
        table: {
          columns: [
            {prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left'},
            {prop: 'fullName', label: '姓名', align: 'left', width: '120', fixed: 'left'},
            {prop: 'checkMonth', label: '核算月份', width: '120', align: 'left'},
            {prop: 'businessType', label: '业态', align: 'left', width: '120', display: { dict: 'ORG_BUSINESS_TYPE' }},
            {prop: 'orgUnitName', label: '组织名称', align: 'left', width: '120'},
            {prop: 'posTitleName', label: '职务', align: 'left', width: '120'},
            {prop: 'groupName', label: '薪资组', align: 'left', width: '120'},
            {prop: 'racingAward', label: '赛马奖励', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '二集群赛马奖励'
              },
              key: 'cpsRacingAwardSecondExport',
              req: config.getTwoRacingPageList
            },
            import: {
              key: 'cpsRacingAwardSecondImportPost',
              business: 'cps-racingAwardSecond',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '确认无误',
              key: 'cpsRacingAwardSecondPut',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
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
          businessType: '',
          orgUnitName: '',
          posTitleName: '',
          posTitleId: '',
          orgUnitId: '',
          checkMonthStr: '',
          checkMonthEnd: ''
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
