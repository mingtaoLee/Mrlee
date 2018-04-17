<template>
  <i-layout headerKey="cpsEmpPayAttendGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.fullName"></el-input>
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
            v-model="searchParam.orgUnitId"
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="上班方式">
          <i-select v-model="searchParam.workType" parameter="WORK_SYSTEM"></i-select>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            :picker-options="effectStartOptions"
            @change="handleEffectiveDateStartChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            :picker-options="effectEndOptions"
            @change="handleEffectiveDateEndChange"
          >
          </el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
        ref="table"
        class="table"
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone"
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
        size="small"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :editorStatus="editorStatus" :idKey="idKey" :attendanceBasisId="attendanceBasisId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/employee-info/work-calendar'
  import DetailEdit from './detail-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    components: {
      DetailEdit,
      RemoteSelect
    },
    mixins: [PaginationMixin, SearchDateMixin, Access],
    data () {
      return {
        reqConfig: { req: req, getName: 'getWorkCalendarList', deleteName: 'deleteWorkCalendar' },
        idKey: 'attendanceBasisId',
        title: '员工工作制',
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
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

        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', sortable: true, align: 'left', width: '120', fixed: 'left' },
            { prop: 'fullName', label: '姓名', width: '120', align: 'left', fixed: 'left' },
            { prop: 'personnelGroupName', label: '人事范围', width: '160', align: 'left' },
            { prop: 'groupName', label: '薪资组', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '组织名称', width: '120', align: 'left' },
            { prop: 'workType', label: '上班方式', align: 'left', width: '120', display: { dict: 'WORK_SYSTEM' } },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '120', display: { date: '' } },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'left', width: '120', display: { date: '' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '员工工作制'
              },
              key: 'cpsEmpPayAttendExport',
              req: config.getWorkCalendarList
            },
            import: {
              key: 'cpsEmpPayAttendImport',
              business: 'cps-payAttendanceBasis',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'cpsEmpPayAttendIdPut',
                func: this.modifyRow
              }, {
                text: '删除',
                key: 'cpsEmpPayAttendIdDelete',
                func: this.deleteRow
              }],
            toolbar: [{
              text: '新增',
              key: 'cpsEmpPayAttendPost',
              func: this.addPage
            }]
            // , {
            //   text: '删除',
            //   key: 'cpsEmpPayAttendPut',
            //   type: 'danger',
            //   func: this.delete
            // }
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        jobFamilysProps: {
          children: 'children',
          label: 'name'
        },
        searchParam: {
          fullName: '',
          employeeCode: '',
          orgUnitName: '',
          posJobFamilyId: '10010299',
          orgUnitId: '',
          workType: '',
          effectiveDate: ''
        }
      }
    },
    methods: {

      /** 打开员工工作日历设置页面 */
      openDetailDialog () {
        this.isShowDialog = true
      },

      /** 删除员工工作日历 */
      delete (vm) {
        const selected = vm.getMultipleSelection().map(item => {
          return item.attendanceBasisId
        })
        if (!selected.length) return showMessage('info', '请选择至少一项！')
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          req('deleteWorkCalendarList', selected).then(res => {
            if (res) {
              this.resetAllParam(selected.length)
              this.fetch(this.allParam)
              showMessage('success', '恭喜你！删除成功！')
            }
          })
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
