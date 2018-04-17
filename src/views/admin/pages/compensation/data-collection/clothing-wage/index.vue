<template>
  <i-layout headerKey="cpsClotingWageGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.employeeName"></el-input>
        </el-form-item>
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
        <el-form-item label="员工状态">
          <i-select v-model="searchParam.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="确认状态">
          <i-select v-model="searchParam.confirmStatus" parameter="CONFIRM_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="核算月份起">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="month"
            value-format="yyyy-MM"
            @change="handleEffectiveDateStartChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份止">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="month"
            value-format="yyyy-MM"
            @change="handleEffectiveDateEndChange"
          ></el-date-picker>
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
              :fixed="col.fixed"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            ></el-table-column>
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
        <isolate-edit ref="isolateEdit" :config="['org']" :id="id"></isolate-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import CancelData from 'components/compensation/confirm-data/index.vue'
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/clothing-wage'
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
      RemoteSelect,
      CancelData
    },
    data () {
      return {
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'postClotingWageList' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {confirmStatus: 'Y'}, cancelParams: {confirmStatus: 'N'} },
        isolateConfig: { req: req, name: 'getSyncData' },
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        // 人事范围选择器配置
        personnelGroupProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
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

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'provinceAreaName', label: '省/区', align: 'left', width: '120' },
            { prop: 'areaName', label: '区域', align: 'left', width: '120' },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '100' },
            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
            { prop: 'posTitleName', label: '职务', align: 'left', width: '120' },
            { prop: 'jobName', label: '职位', align: 'left', width: '120' },
            { prop: 'hireDate', label: '入职日期', align: 'left', width: '120', display: { date: 'default' } },
            { prop: 'employeeStatus', label: '员工状态', align: 'left', width: '120', display: { dict: 'EMPLOYEE_STATUS' } },
            { prop: 'sellAmount', label: '个人月销售总额', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'coefficientExtraction', label: '提成系数', align: 'right', width: '120' },
            { prop: 'wage', label: '提成金额', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'employeeSalary', label: '月薪标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'prewageStandard', label: '原工资标准', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'isCompare', label: '是否与原工资标准对比', align: 'left', width: '150', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'monthSales', label: '应发-提成', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' } },
            { prop: 'lastUpdateBy', label: '操作者工号', width: '120', align: 'left' },
            { prop: 'lastUpdateDate', label: '操作时间', width: '140', align: 'left', display: { date: 'long' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '服装提成列表'
              },
              key: 'cpsClothWageExport',
              req: config.postClotingWageList
            },
            import: {
              key: 'cpsClothingWageImport',
              business: 'cps-clothwage',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '抽数',
              key: 'cpsClotingWageSync',
              func: this.isolatePolicy
            }, {
              text: '确认无误',
              key: 'cpsClotingWages',
              func: (vm) => {
                return this.confirmAction(vm, 'Y')
              },
              show: () => ({ disable: this.confirmDataButtonIsDisabled() })
            }, {
              text: '取消确认',
              key: 'cpsClotingWagesCancelConfirm',
              func: (vm) => {
                return this.confirmAction(vm, 'N')
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
          employeeCode: '',
          employeeName: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          groupId: '',
          personnelGroupCode: ''
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
