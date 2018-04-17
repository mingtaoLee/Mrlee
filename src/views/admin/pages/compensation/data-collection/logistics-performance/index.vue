<template>
  <i-layout>
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="工号">
        <el-input v-model="searchParam.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchParam.employeeName"></el-input>
      </el-form-item>
      <el-form-item label="组织名称">
        <el-input v-model="searchParam.orgName"></el-input>
      </el-form-item>
      <el-form-item label="业务类型">
        <ISelect v-model="searchParam.businessType" parameter="dict"></ISelect>
      </el-form-item>
      <el-form-item label="月份">
        <el-date-picker
          v-model="searchParam.perfMonth"
          type="date">
        </el-date-picker>
      </el-form-item>
    </i-form>
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
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-for="(btn, idx) of tableScope.operator" size="mini"
                  :key="idx"
                  type="text"
                  @click="btn.func(scope)">
                  {{ btn.text }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="(currentRow.id ? '修改' : '新增') + '计件/计量信息'"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <ModifyLogistics :form="currentRow"></ModifyLogistics>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import IForm from 'components/common/i-form/i-form'
  import req, { config } from 'api/compensation/data-collection/logistics-performance'
  import ISelect from 'components/common/i-select/i-select'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import ModifyLogistics from './modify-logistics'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import { showMessage, confirmPopover } from 'utils/index'

  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    components: {
      ITable,
      ITableCell,
      ISelect,
      IForm,
      IDialog,
      ModifyLogistics,
      ILayout
    },
    data () {
      return {
        searchParam: {
          employeeCode: '',
          employeeName: '',
          orgName: '',
          businessType: '',
          perfMonth: ''
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
            text: '确认',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,

        currentRow: {},
        loading: false,

        /* table */
        table: {
          columns: [
            { prop: 'orgCode', label: '组织代码', align: 'left', width: '120' },
            { prop: 'orgName', label: '组织名称', width: '160', align: 'left' },
            { prop: 'employeeCode', label: '工号', align: 'left', width: '120' },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '120' },
            { prop: 'perfMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'businessType', label: '业务类型', align: 'left', width: '140' },
            { prop: 'dispatchNum', label: '配送量', width: '120', align: 'right' },
            { prop: 'dispatchNumTarget', label: '配送目标值', align: 'right', width: '120' },
            { prop: 'errorNum', label: '出错次数', align: 'right', width: '120' },
            { prop: 'reward', label: '准确率奖励金', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'dataState', label: '数据状态', align: 'left', width: '140', display: { dict: 'dict' } }
            // { prop: 'createBy', label: '操作者', align: 'left', width: '140' },
            // { prop: 'createDate', label: '操作时间', align: 'left', width: '140' }
          ],
          setting: {
            operator: [
              {
                text: '修改',
                func: this.modifyRow
              },
              {
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              func: this.addList
            }, {
              text: '删除',
              type: 'danger',
              func: this.delete
            }, {
              text: '导入',
              func: this.import
            }],
            export: {
              req: config.getLogisticsList,
              elTable: null
            }
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        }
      }
    },
    // created () {
    //   this.init()
    // },
    mounted () {
      this.table.setting.export.elTable = this.$refs.table
    },
    methods: {
      fetch (options = {}) {
        req('getLogisticsList', options).then(res => {
          if (res) {
            Object.assign(this.table, res)
            this.loading = false
          }
        })
      },
      addList () {
        this.currentRow = {}
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.currentRow = scope.row
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          this.delLogistics([scope.row.id])
        })
      },
      delLogistics (idArr = []) {
        return req('delLogistics', idArr).then(res => {
          if (res) {
            showMessage('success', '删除成功！')
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
          } else {
            showMessage('danger', '删除失败！')
          }
        })
      },
      modifyLogistics (params = {}) {
        return req('modifyLogistics', params).then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            showMessage('success', '修改成功！')
          } else {
            showMessage('danger', '修改失败！')
          }
        })
      },
      addLogistics (params = {}) {
        return req('addLogistics', params).then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            showMessage('success', '添加成功！')
          } else {
            showMessage('danger', '添加失败！')
          }
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        if (this.currentRow.id) {
          this.modifyLogistics(this.currentRow).then(() => {
            done()
          })
        } else {
          this.addLogistics(this.currentRow).then(() => {
            done()
          })
        }
      },
      delete (vm) {
        const selected = vm.getMultipleSelection().map(item => {
          return item.id
        })
        if (!selected.length) return showMessage('info', '请选择至少一项！')
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          this.delLogistics(selected)
        })
      },
      import () {},
      export () {}
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
