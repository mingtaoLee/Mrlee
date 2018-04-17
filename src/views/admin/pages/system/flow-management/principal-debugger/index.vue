<template>
  <i-layout headerKey="">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="发起人">
         <el-input v-model="personnels" readonly>
            <i
              slot="suffix"
              class="el-icon-menu"
              @click="handleIconClick"
            ></i>
        </el-input>
          <i-personnel-select
            :isShow.sync="isShow"
            :multiple="false"
            @confirm="handleConfirm"
          ></i-personnel-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            class="over-width"
            v-model="searchParams.principalId"
            filterable>
            <el-option
              v-for="(p, idx) in principals"
              :key="idx"
              :label="p.name"
              :value="p.wfPrincipalId">
            </el-option>
          </el-select>
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
            v-loading="isTableLoading"
            :element-loading-text="$loadingText"
            border
            :data="tableScope.clone">
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :min-width="col.minWidth"
              :align="col.align"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        :title="title"
        :toolbar="detailEditToolbar"
        v-model="isShowDialog"
      >
      <el-form :model="dialogForm">
        <el-form-item label="SQL">
          <el-input
            type="textarea"
            :rows="5"
            v-model="dialogForm.sql"
          ></el-input>
        </el-form-item>
      </el-form>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req from 'api/system/flow-managent'
  import { showMessage } from 'utils/index'
  export default {
    data () {
      return {
        // i-personnel-select
        isShow: false,
        personnels: '',
        // 角色el-select
        principals: [],
        // 查询参数
        searchParams: {
          employeeId: '',
          principalId: ''
        },
        // dialog
        title: 'SQL',
        dialogForm: {
          sql: ''
        },
        isShowDialog: false,
        // dialogToolBar
        detailEditToolbar: [
          {
            text: '关闭',
            type: 'plain',
            func: done => {
              this.isShowDialog = !this.isShowDialog
            }
          }
        ],
        // table相关
        isTableLoading: false,
        table: {
          columns: [
            { prop: 'empEmployeeId', label: '员工Id', align: 'left', width: '120' },
            { prop: 'employeeCode', label: '员工编号', align: 'left', width: '120' },
            { prop: 'fullName', label: '员工姓名', align: 'left', width: '120' },
            { prop: 'orgUnitCode', label: '部门编号', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '部门名称', align: 'left', width: '120' }
          ],
          data: null,
          showPagebar: true,
          search: null,
          info: null,
          total: 0,
          setting: {
            toolbar: [{
              text: '查看SQL',
              func: done => {
                this.isShowDialog = true
              }
            }]
          }
        }
      }
    },

    mounted () {
      this.getPrincipalList()
    },

    methods: {
      // i-personel-select相关
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        this.personnels = selected.map(item => item.employeeName).toString()
        this.searchParams.employeeId = selected.length > 0 ? selected[0].employeeId : ''
      },
      // 重置搜索条件
      reset () {
        this.personnels = ''
        this.searchParams = {
          employeeId: '',
          principalId: ''
        }
      },
      // 搜索条件查询
      search () {
        if (!this.searchParams.principalId) {
          showMessage('warning', '查询条件不能为空')
        } else {
          this.table.search = { principalId: this.searchParams.principalId }
        }
      },
      // 获取数据
      fetch (opts) {
        this.isTableLoading = true
        req('getEmployeeByEmployeeIdAndPrincipalId', { employeeId: this.searchParams.employeeId, ...opts }).then((res, other) => {
          this.table = Object.assign(this.table, res)
          this.dialogForm.sql = res.additions.sql
          this.isTableLoading = false
        }, (res) => {
          showMessage('error', res.message)
          this.isTableLoading = false
        })
      },
      // 页数变化
      handleSizeChange (opts) {
        this.fetch(opts)
      },
      // 页码变化
      handleCurrentChange (opts) {
        this.fetch(opts)
      },
      // 角色列表
      getPrincipalList () {
        req('getPrincipalList', {
          entityType: '01'
        }).then(res => {
          this.principals = res
        })
      }
    }
  }
</script>
