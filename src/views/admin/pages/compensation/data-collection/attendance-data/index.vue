<template>
  <i-layout headerKey="cpsAttendancesGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.employeeName"></el-input>
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
        <el-form-item label="员工状态">
          <i-select v-model="searchParam.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="考勤月份起">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="month"
            @change="handleEffectiveDateStartChange"
            :picker-options="effectStartOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考勤月份止">
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
            :data="tableScope.clone"
            :cell-class-name="cellClassName"
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
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :editorStatus="editorStatus" :idKey="idKey" :id="id"></detail-edit>
      </i-dialog>
      <i-dialog
        v-model="isShowIsolate"
        title="抽数"
        size="mini"
        :toolbar="isolateEditToolbar"
        destroyedWhenClose
      >
        <isolate-edit ref="isolateEdit" :isolateId="isolateId"></isolate-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/attendance-data'
  import DetailEdit from './detail-edit'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import { dateFormat } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin, isolateMixin],
    components: {
      DetailEdit,
      IsolateEdit,
      RemoteSelect
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getAttendances', deleteName: 'deleteAttendance', deleteListName: 'deleteAttendances' },
        dataConfirmConfig: { req: req, name: 'confirmData', params: {confirmStatus: 'Y'}, cancelParams: {confirmStatus: 'N'} },
        isolateConfig: { req: req, name: 'getAttendanceData' },
        title: '考勤数据',
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
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
        id: String,
        isolateId: String,

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', sortable: true, align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', sortable: true, align: 'left', width: '120', fixed: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '120' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '120' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '100' },
            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
            { prop: 'orgUnitCode', label: '组织代码', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '组织名称', width: '120', align: 'left' },
            { prop: 'posTitleName', label: '职务', align: 'left', width: '120' },
            { prop: 'jobName', label: '职位', align: 'left', width: '120' },
            { prop: 'employeeStatus', label: '员工状态', align: 'left', width: '120', display: { dict: 'EMPLOYEE_STATUS' } },
            { prop: 'checkMonth', label: '考勤月份', width: '120', align: 'left' },
            { prop: 'overtimeHoursOne', label: '加班工资-150%（时数）', align: 'right', width: '180', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'overtimeHoursTwo', label: '加班工资-300%（时数）', align: 'right', width: '180', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'nightAllowanceTimes', label: '夜班津贴（次数）', align: 'right', width: '160', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'thingDebitHours', label: '事假扣款（时数）', align: 'right', width: '160', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'sickDebitHours', label: '病假扣款（时数）', align: 'right', width: '160', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'maternityHoursCompany', label: '产假扣款（公司发放）（时数）', align: 'right', width: '210', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'maternityDebitHours', label: '产假扣款（社保发放）（时数）', align: 'right', width: '210', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'lateDebitHours', label: '迟到扣款（分钟数）', align: 'right', width: '150', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'earlyDebitHours', label: '早退扣款（分钟数）', align: 'right', width: '150', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'absentDebitHours', label: '旷工扣款（时数）', align: 'right', width: '150', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'missedDebitTimes', label: '忘打卡总数（次数）', align: 'right', width: '150', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'noscheDebitDays', label: '未排班扣款（天数）', align: 'right', width: '150', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'workAmonth', label: '月工作时数（时数）', align: 'right', width: '150', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'remainingHours', label: '待休工时数（时数）', align: 'right', width: '150', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'monthlyHours', label: '月排班时数（时数）', align: 'right', width: '150', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'funeralHolidayHours', label: '丧假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'marriageHolidayHours', label: '婚假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'yearHolidayHours', label: '年假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'jobhurthOlidayHours', label: '工伤假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'adjustmentHolidatyHours', label: '调休假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'toleranceHolidayHours', label: '公差假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'accompanyHolidayHours', label: '陪产假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'lactationHolidayHours', label: '哺乳假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'birthcheckHolidayHours', label: '产检假（时数）', align: 'right', width: '120', display: { mixin: (row, col) => row[col] ? row[col] : 0 } },
            { prop: 'confirmStatus', label: '确认状态', width: '120', align: 'left', display: { dict: 'CONFIRM_STATUS' } },
            { prop: 'createBy', label: '操作者工号', width: '100', align: 'left' },
            { prop: 'createDate', label: '操作时间', align: 'left', width: '160', display: { date: 'long' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '考勤数据'
              },
              key: 'cpsAttendancesExport',
              req: config.getAttendances
            },
            import: {
              key: 'cpsAttendancesImportPost',
              business: 'cps-attendances',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'cpsAttendancesPut',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'cpsAttendancesDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [
              {
                text: '抽数',
                key: 'cpsIntegSharegooAttendanceDataGet',
                func: this.isolatePolicy
              }, {
                text: '新增',
                key: 'cpsAttendancesPost',
                func: this.addPage
              }, {
                text: '删除',
                key: 'cpsAttendancesListPut',
                type: 'danger',
                func: this.delete
              }, {
                text: '确认无误',
                key: 'cpsAttendanceConfirm',
                func: (vm) => {
                  return this.confirmAction(vm, 'Y')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }, {
                text: '取消确认',
                key: 'attendanceConfirmCancelPut',
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
          employeeName: '',
          employeeCode: '',
          orgId: '',
          effectiveDateStart: null,
          effectiveDateEnd: null,
          orgName: '',
          orgUnitId: '',
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
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        const date = this.$refs.detailEdit
        date.checkMonth = dateFormat(date.checkMonth, 'YYYYMM')
        return date.save().then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
          }
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
