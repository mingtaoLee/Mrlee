<template>
  <div>
    <i-layout :borderWidth="0" :padding="0" :margin="0" headerKey="cpsEmpGroupUnallocateGet">
      <template slot="header">
        <i-form @search="search" @reset="reset" ref="iForm">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.fullName"></el-input>
          </el-form-item>
          <el-form-item label="组织名称">
            <i-select-tree
              v-model="searchParam.orgUnitId"
              :multiple="false"
              dataKey="org"
              nodeKey="orgUnitId"
              lazy
              size="small"
            ></i-select-tree>
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="searchParam.name"></el-input>
          </el-form-item>
          <el-form-item label="在职状态">
            <i-select v-model="searchParam.status" parameter="EMPLOYEE_STATUS"></i-select>
          </el-form-item>
          <el-form-item label="入职时间起">
            <el-date-picker
              v-model="searchParam.effectiveDateStart"
              type="date"
              :picker-options="effectStartOptions"
              @change="handleEffectiveDateStartChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="入职时间止">
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
              <!--<i-table-operator scope :table="tableScope"></i-table-operator>-->
            </el-table>
          </template>
        </i-table>
      </template>
    </i-layout>
    <i-dialog
      v-model="isShowDialog"
      :title="currentTitle"
      :toolbar="commonToolbar"
      size="small"
      destroyedWhenClose
    >
      <component
        ref="currentComponent"
        dataKey="empEmployeeId"
        :is="currentComponent"
        :selected="currentSelected"
        :effectiveDatePickerOptions="effectiveDatePickerOptions"
      ></component>
    </i-dialog>
  </div>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import req, { config } from 'api/compensation/employee-info/salary-distribute'
  import {showMessage} from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      ILayout
    },
    data () {
      return {
        effectiveDatePickerOptions: null,
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
            text: '取消',
            type: 'plain',
            func: done => {
              done()
            }
          },
          {
            text: '调入',
            func: done => {
              this.handleTransferConfirm(done)
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
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            {prop: 'employeeCode', label: '工号', sortable: true, align: 'left', width: '120', fixed: 'left'},
            {prop: 'fullName', label: '姓名', align: 'left', width: '120', fixed: 'left'},
            {prop: 'orgUnitName', label: '组织名称', align: 'left', width: '160'},
            {prop: 'name', label: '职位', align: 'left', width: '160'},
            {prop: 'status', label: '在职状态', align: 'left', width: '120', display: {dict: 'EMPLOYEE_STATUS'}},
            // {prop: 'transferType', label: '上次异动类型', align: 'center', width: '120', display: {dict: 'dict'}},
            {prop: 'transferDate', label: '入职时间', align: 'left', width: '120', display: {date: 'default'}}
          ],
          setting: {
            export: {
              config: {
                fileName: '未分配薪资组人员'
              },
              key: 'cpsEmpGroupAllocateExport',
              req: config.getUndistributedEmps
            },
            operator: [
              {
                text: '分配薪资组',
                key: 'cpsEmpGroupAllocatePost',
                func: this.distribute
              }
            ],
            toolbar: [{
              text: '分配薪资组',
              key: 'cpsEmpGroupAllocatePost',
              type: 'plain',
              func: this.distribute
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          name: '',
          fullName: '',
          status: '',
          employeeCode: '',
          orgUnitId: '',
          effectiveDateStart: '',
          effectiveDateEnd: ''
        }
      }
    },
    created () {
      this.$eventBus.$on('initLayout1', this.initLayout)
    },
    beforeDestroy () {
      this.$eventBus.$off('initLayout1', this.initLayout)
    },
    methods: {
      initLayout () {
        this.$refs.iForm && this.$refs.iForm.initLayout()
      },
      /** 获取数据 */
      fetch (options = {}) {
        this.load()
        req('getUndistributedEmps', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },

      /** 打开共用弹窗 */
      openCommonDialog () {
        this.isShowDialog = true
      },

      /** 弹窗确认事件 */
      handleConfirm (done) {
        this.$refs.currentComponent.save().then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
          }
        })
      },

      /** 打开分配薪资组弹窗 */
      distribute ({row}) {
        // 如果是行内分配薪资组，则重置已选人员为当前行
        if (row) this.currentSelected = [row]
        this.effectiveDatePickerOptions = {}
        this.handleToggleComponent(row, '分配薪资组', () => import('../group-employee/distribute'))
      },

      /** 判断是否已有选择 */
      isSelected () {
        this.currentSelected = this.$refs.iTable.getMultipleSelection()
        return !!this.currentSelected.length
      },

      /** 处理弹窗组件切换 */
      handleToggleComponent (row, title, component, message = '请至少选择一项！') {
        if (row || this.isSelected()) {
          this.currentTitle = title
          this.currentComponent = component
          this.openCommonDialog()
        } else {
          showMessage('info', message)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
