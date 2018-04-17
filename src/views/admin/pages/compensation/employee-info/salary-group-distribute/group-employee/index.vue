<template>
  <div>
    <i-layout :borderWidth="0" :padding="0" :margin="0" headerKey="cpsEmpGroupPayGet">
      <template slot="header">
        <i-form @search="search" @reset="reset" ref="iForm">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.fullName"></el-input>
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
              :props="groupProps"
              :displayKeys="['groupCode', 'groupName']"
              dataKey="salaryGroup"
              placeholder="请输入代码或名称搜索"
            ></remote-select>
          </el-form-item>
          <el-form-item label="组织名称">
            <i-select-tree
              v-model="searchParam.orgUnitId"
              :multiple="false"
              dataKey="org"
              nodeKey="orgUnitId"
              size="small"
              lazy
            ></i-select-tree>
          </el-form-item>
          <el-form-item label="在职状态">
            <i-select v-model="searchParam.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
          </el-form-item>
          <el-form-item label="发薪主体">
            <remote-select
              v-model="searchParam.companyCode"
              :displayKeys="['companyCode', 'companyName']"
              :props="companyProps"
              dataKey="company"
              placeholder="请输入代码或名称搜索"
            ></remote-select>
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
          ref="iTable"
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
          v-model="isShowDetailDialog"
          :title="title"
          :toolbar="detailEditToolbar"
          destroyedWhenClose
        >
        <detail-edit ref="detailEdit" :empgroupId="empgroupId"></detail-edit>
      </i-dialog>
      </template>
    </i-layout>
    <i-dialog
      v-model="isShowDialog"
      :title="currentTitle"
      size="small"
      :toolbar="commonToolbar"
      destroyedWhenClose
    >
      <component ref="currentComponent" :is="currentComponent" :selected="currentSelected"></component>
    </i-dialog>
    <i-dialog
      v-model="isTransfer"
      title="待调入列表"
      :toolbar="transferToolbar"
      destroyedWhenClose
    >
      <employee-transfer ref="employeeTransfer"></employee-transfer>
    </i-dialog>
  </div>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/employee-info/salary-distribute'
  import EmployeeTransfer from './transfer'
  import DetailEdit from './detail-edit'
  import Access from 'mixins/access'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      DetailEdit,
      EmployeeTransfer,
      RemoteSelect
    },
    data () {
      return {
        // 公司选择器配置
        companyProps: {
          value: 'companyCode',
          label: 'companyCode'
        },
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
        // 当前除调入弹窗外内嵌组件
        currentComponent: null,
        // 当前公用弹窗头部信息
        currentTitle: '',
        // 当前选中的行数据
        currentSelected: [],
        // 待调入
        isTransfer: false,
        transferToolbar: [
          {
            text: '返回',
            type: 'plain',
            func: done => {
              this.fetch({ pageSize: this.pageInfo.pageSize, pageIndex: 1 })
              done()
            }
          }
        ],

        /* 公用toolbar */
        commonToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.handleConfirm(done)
            }
          }
        ],
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
        isShowDetailDialog: false,
        isShowDialog: false,
        id: String,
        empgroupId: String,

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', sortable: true, align: 'left', width: '120', fixed: 'left' },
            { prop: 'fullName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '120' },
            { prop: 'groupName', label: '薪资组名称', width: '120', align: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', width: '120', align: 'left' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '组织名称', align: 'left', width: '120' },
            { prop: 'name', label: '职位', align: 'left', width: '120' },
            { prop: 'employeeStatus', label: '在职状态', align: 'left', width: '120', display: {dict: 'EMPLOYEE_STATUS'} },
            // { prop: 'costCenter', label: '成本中心', width: '120', align: 'left' },
            { prop: 'payCompany', label: '发薪主体', width: '120', align: 'left' },
            { prop: 'taxCompany', label: '报税主体', width: '120', align: 'left' },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '140', display: { date: '' } },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'left', width: '140', display: { date: '' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '薪资组人员'
              },
              key: 'cpsEmpGroupExport',
              req: config.getSalaryGroupEmpList
            },
            operator: [
              {
                text: '修改',
                key: 'cpsEmpGroupPayIdGet',
                func: this.modifyRow
              }],
            toolbar: [
            // {
            //   text: '薪资组调出',
            //   key: 'cpsEmpGroupTransferoutPost',
            //   func: this.tuneOut
            // }, {
            //   text: '薪资组调入',
            //   key: 'cpsEmpGroupTransferinGet',
            //   type: 'plain',
            //   func: this.transfer
            // },
              {
                text: '分配其他薪资组',
                key: 'cpsEmpGroupOtherSalaryPut',
                type: 'plain',
                func: this.distribute
              }, {
                text: '注销员工薪资组',
                key: 'cpsEmpGroupLogoutPut',
                type: 'plain',
                func: this.logout
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
          fullName: '',
          employeeCode: '',
          groupName: '',
          groupId: '',
          orgUnitId: '',
          employeeStatus: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          costCenter: '',
          companyCode: ''
        }
      }
    },
    created () {
      this.$eventBus.$on('initLayout0', this.initLayout)
      // 调出关闭事件监听
      this.$root.$on('closeTransferDialog', this.closeTransferDialog)
      // 重新获取数据监听
      this.$root.$on('fetch', this.fetch)
    },
    beforeDestroy () {
      this.$eventBus.$off('initLayout0', this.initLayout)
    },
    methods: {
      initLayout () {
        this.$refs.iForm && this.$refs.iForm.initLayout()
      },
      /** 获取列表数据 */
      fetch (options = {}) {
        this.load()
        req('getSalaryGroupEmpList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },
      modifyRow (scope) {
        this.empgroupId = scope.row.empgroupId
        this.title = '员工薪资组信息修改'
        this.openDetailDialog()
      },
      openDetailDialog () {
        this.isShowDetailDialog = true
      },

      /** 打开共用窗口 */
      openCommonDialog () {
        this.isShowDialog = true
      },

      /** 打开调出窗口 */
      openTransferDialog () {
        this.isTransfer = true
      },
      handleSave (done) {
        return this.$refs.detailEdit.save().then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
          }
        })
      },

      /** 弹窗确认事件 */
      handleConfirm (done) {
        this.$refs.currentComponent.save().then(res => {
          if (res) {
            showMessage('success', this.currentTitle + '成功！')
            this.fetch({ pageSize: this.pageInfo.pageSize, pageIndex: 1 })
            done()
          }
        })
      },

      /** 删除 */
      delete (vm) {
        const selected = vm.getMultipleSelection().map(item => {
          return item.attendanceBasisId
        })
        if (!selected.length) return showMessage('info', '请至少选择一项！')
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          req('deleteWorkCalendarList', {selected}).then(res => {
            if (res) {
              showMessage('success', '恭喜你！删除成功！')
              this.fetch(this.allParam)
            }
          })
        })
      },

      /** 打开分配薪资组弹窗 */
      distribute () {
        this.handleToggleComponent('分配其他薪资组', () => import('./distribute'))
      },

      /** 打开调出人员弹窗 */
      tuneOut () {
        this.handleToggleComponent('薪资组调出', () => import('./tune-out'))
      },

      /** 关闭调出人员弹窗 */
      closeTransferDialog () {
        this.isTransfer = false
      },

      /** 打开注销薪资组 */
      logout () {
        this.handleToggleComponent('注销员工薪资组', () => import('./logout'))
      },

      /** 打开待调入人员弹窗 */
      transfer () {
        this.openTransferDialog()
      },

      /** 确认调入人员 */
      handleTransferConfirm (done) {
        this.$refs.employeeTransfer.save().then(res => {
          if (res) {
            this.reset()
            this.fetch({ pageSize: this.pageInfo.pageSize, pageIndex: 1 })
            done()
          }
        })
      },

      /** 判断是否已有选择 */
      isSelected () {
        this.currentSelected = this.$refs.iTable.getMultipleSelection()
        return !!this.currentSelected.length
      },

      /** 处理弹窗组件切换 */
      handleToggleComponent (title, component, message = '请至少选择一项！') {
        if (this.isSelected()) {
          this.currentTitle = title
          this.currentComponent = component
          this.openCommonDialog()
        } else {
          showMessage('info', message)
        }
      },

      /** 转换时间格式 */
      handleEffectiveDateChange (value) {
        this.searchParam.effectiveDate = value
      },

      beforeDestroy () {
        this.$root.$off('fetch', this.fetch)
        this.$root.$off('closeTransferDialog', this.closeTransferDialog)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
