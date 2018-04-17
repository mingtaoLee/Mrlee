<template>
  <div headerKey="cpsAchievementBonusThreeClustersGet">
    <i-layout>
      <template slot="header">
        <i-form @search="search" @reset="reset">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.employeeName"></el-input>
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="searchParam.posTitleId"></el-input>
          </el-form-item>
          <el-form-item label="团队">
            <el-input v-model="searchParam.orgUnitId"></el-input>
          </el-form-item>
          <el-form-item label="薪资组">
            <!-- <el-input v-model="searchParam.groupId"></el-input> -->
            <i-select
              v-model="searchParam.groupId"
              :props="groupProps"
              dataKey="salaryGroup"
              filterable
            >
            </i-select>
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
  </div>
</template>

<script>
  import req, { config } from 'api/compensation/data-collection/three-clusters'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import moment from 'moment'

  export default {
    mixins: [PaginationMixin, ConfirmDataMixin],
    components: {
    },
    data () {
      return {
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        reqConfig: { req: req, getName: 'getThreeClustersList' },
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
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            {prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left'},
            {prop: 'employeeName', label: '姓名', width: '120', align: 'left', fixed: 'left'},
            {prop: 'groupName', label: '薪资组', width: '140', align: 'left'},
            {prop: 'posTitleName', label: '职务', width: '140', align: 'left'},
            {prop: 'checkMonth', label: '核算月份', width: '120', align: 'left'},
            {prop: 'orgUnitName', label: '团队', align: 'left', width: '140'},
            {prop: 'achievementBonus', label: '绩效奖金', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'grantMonth', label: '发放月份', width: '120', align: 'left'},
            {prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '三集群计件_计量_非计件计量绩效奖金'
              },
              req: config.getThreeClustersList,
              key: 'cpsAchievementBonusThreeClustersExport'
            },
            import: {
              key: 'cpsAchievementBonusThreeClustersImport',
              business: 'cps-achievement-bonus',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '确认无误',
              key: 'cpsAchievementBonusThreeClustersPut',
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
          employeeName: '',
          posTitleId: '',
          orgUnitId: '',
          team: '',
          groupId: '',
          checkMonthStart: '',
          checkMonthEnd: ''
        }
      }
    },
    methods: {
      afterFetch (res) {
        res.data.map(item => {
          if (item.checkMonth && item.grantMonth) {
            item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
            item.grantMonth = item.grantMonth.slice(0, 4) + '-' + item.grantMonth.slice(4)
          }
        })
        return Promise.resolve(true)
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
