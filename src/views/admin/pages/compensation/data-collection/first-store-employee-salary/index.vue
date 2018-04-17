<template>
  <i-layout headerKey="cpsCpsHourlyWageQueryPost">
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
        <el-form-item label="小店名称">
          <el-input v-model="searchParam.orgUnitName"></el-input>
          <!-- <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="searchParam.orgUnitId"
            size="small"
          ></i-select-tree> -->
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
        <el-form-item label="雇佣状态">
          <i-select v-model="searchParam.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="店龄">
          <i-select v-model="searchParam.storeAge" parameter="SHOP_CATEGORY"></i-select>
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
  import req, { config } from 'api/compensation/data-collection/first-store-employee-salary'
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
        idKey: 'cpsEmployeeWageId',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
        reqConfig: { req: req, getName: 'postfirstStoreEmployeeSalaryList' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {} },
        isolateConfig: { req: req, name: 'getfirstStoreEmployeeSalaryData' },
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
            { prop: 'provinceAreaName', label: '省/区', align: 'left', width: '120' },
            { prop: 'areaName', label: '区域', width: '120', align: 'left' },
            { prop: 'empEmployeeCode', label: '工号', align: 'left', width: '120', fixed: 'left' },
            { prop: 'empEmployeeName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '100' },
            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
            { prop: 'storeAge', label: '店龄', align: 'left', width: '120', display: {dict: 'SHOP_CATEGORY'} },
            { prop: 'storeCategory', label: '门店类型', align: 'left', width: '120', display: {dict: 'STORE_TYPE'} },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'entryDate', label: '入职日期', align: 'left', width: '120', display: {date: 'default'} },
            { prop: 'employeeStatus', label: '雇佣状态', align: 'left', width: '120', display: {dict: 'EMPLOYEE_STATUS'} },
            { prop: 'smallStoreName', label: '小店名称', align: 'left', width: '120' },
            { prop: 'posTitleName', label: '职务', align: 'left', width: '120' },
            { prop: 'jobName', label: '职位', align: 'left', width: '120' },
            { prop: 'hourStandard', label: '时薪起薪标准', align: 'left', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'varyWithTime', label: '是否随时效浮动', align: 'right', width: '120', display: {dict: 'WHETHER_TYPE'} },
            { prop: 'prescriptionLevel', label: '时效档级', align: 'right', width: '120', display: {dict: 'PRESCRIPTION_LEVEL'} },
            { prop: 'prescriptionLevelStandardAmount', label: '时效档级-标准金额', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashPerformance', label: '收银绩效', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'planHourlyWage', label: '应发-时薪', align: 'left', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'originalStandardWage', label: '原工资标准', width: '120', align: 'left', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'compareWithOriginalWage', label: '是否与原工资对比', align: 'left', width: '120', display: {dict: 'WHETHER_TYPE'} },
            { prop: 'wageDifference', label: '对比值', align: 'left', width: '120' },
            { prop: 'realHourlyWage', label: '实发-时薪', align: 'left', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'realWorkHours', label: '个人实际工时', align: 'left', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'sickLeaveHours', label: '病假工时', align: 'left', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'maternityLeaveHours', label: '产假(公司发放)工时', align: 'left', width: '140', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'absenteeismHours', label: '旷工工时', align: 'left', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'missedClockTimes', label: '忘打卡次数', align: 'left', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: {dict: 'CONFIRM_STATUS'} }
          ],
          setting: {
            export: {
              config: {
                fileName: '一集群门店全职员工时薪'
              },
              key: 'cpsCpsHourlyWageExport',
              req: config.postfirstStoreEmployeeSalaryList
            },
            import: {
              key: 'cpsCpsHourlyWageImportPost',
              business: 'cps-CpsHourlyWage',
              show: () => ({ empty: false })
            },
            toolbar: [
              {
                text: '抽数',
                key: 'cpsStoreStaffHourGet',
                func: this.isolatePolicy
              }, {
                text: '确认无误',
                key: 'cpsCpsHourlyWageConfirmPut',
                func: (vm) => {
                  return this.confirmAction(vm, 'Y')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }, {
                text: '取消确认',
                key: 'cpsCpsHourlyWageUnconfirmPut',
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
          areaId: '',
          orgUnitName: '',
          employeeCode: '',
          employeeName: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          groupId: '',
          jobId: '',
          storeAge: '',
          posTitleId: '',
          employeeStatus: '',
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
