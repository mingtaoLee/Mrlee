<template>
  <i-layout headerKey="cpsBestirsGet">
    <i-form @reset="reset" @search="search" slot="header">
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
      <el-form-item label="核算月份起">
        <el-date-picker
          v-model="searchParam.effectiveDateStart"
          type="month"
          @change="handleEffectiveDateStartChange"
          :picker-options="effectStartOptions"
        ></el-date-picker>
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
              :fixed="col.fixed"
            >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                ></i-table-cell>
              </template>
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="(currentRow.id ? '修改' : '新增') + '短期激励信息'"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <ModifyIncentive :data="currentRow" ref="ModifyIncentive"></ModifyIncentive>
      </i-dialog>
      <i-dialog
        v-model="isShowDetailDialog"
        title="短期激励明细方案"
        destroyedWhenClose
      >
        <detail ref="detail" :id="currentRowId"></detail>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/data-collection/short-term-incentive'
  import ModifyIncentive from './modify-incentive'
  import Detail from './detail'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import { showMessage, confirmPopover, dateFormat } from 'utils/index'
  import Access from 'mixins/access'
  import ConfirmDataMixin from 'mixins/compensation/confirm-data-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access, ConfirmDataMixin],
    components: {
      ModifyIncentive,
      Detail,
      RemoteSelect
    },
    data () {
      return {
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
        searchParam: {
          employeeCode: '',
          employeeName: '',
          orgUnitId: '',
          posTitleId: '',
          personnelGroupCode: '',
          effectiveDateStart: '',
          effectiveDateEnd: '',
          groupId: '',
          employeeStatus: '',
          jobName: ''
        },
        loading: true,
        dataConfirmConfig: { req: req, name: 'confirmData', params: {confirmStatus: 'Y'}, cancelParams: {confirmStatus: 'N'} },
        // id键值标识
        idKey: 'id',
        // 表格类名配置
        cellClassConfigs: [{ property: 'confirmStatus' }],
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

        currentRow: {},
        isShowDetailDialog: false,
        currentRowId: '',

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', align: 'left', width: '140' },
            { prop: 'personnelGroupName', label: '人事范围名称', align: 'left', width: '140' },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '120' },
//            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '组织名称', width: '200', align: 'left' },
            { prop: 'posTitleName', label: '职务', align: 'left', width: '120' },
            { prop: 'jobName', label: '职位', align: 'left', width: '120' },
            { prop: 'employeeStatus', label: '员工状态', align: 'left', width: '120', display: {dict: 'EMPLOYEE_STATUS'} },
            { prop: 'hireDate', label: '入职日期', width: '140', align: 'left', display: { date: 'default' } },
            { prop: 'recordTime', label: '离职日期', width: '140', align: 'left', display: { date: 'default' } },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'reward', label: '金额', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            {prop: 'confirmStatus', label: '确认状态', align: 'left', width: '120', display: { dict: 'CONFIRM_STATUS' }},
            { prop: 'lastUpdateBy', label: '操作者工号', align: 'left', width: '120' },
            { prop: 'lastUpdateDate', label: '操作时间', align: 'left', width: '140', display: { date: 'long' } }
          ],
          setting: {
            operator: [
              {
                text: '修改',
                key: 'cpsBestirsPut',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'cpsBestirsDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [
              {
                text: '新增',
                key: 'bestirsCreatePost',
                func: this.addList
              }, {
                text: '删除',
                type: 'danger',
                key: 'cpsBestirsListPut',
                func: this.delete
              }, {
                text: '确认无误',
                key: 'cpsBestirsConfirm',
                func: (vm) => {
                  return this.confirmAction(vm, 'Y')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }, {
                text: '取消确认',
                key: 'bestirsCancelPut',
                func: (vm) => {
                  return this.confirmAction(vm, 'N')
                },
                show: () => ({ disable: this.confirmDataButtonIsDisabled() })
              }
            ],
            import: {
              business: 'cps-bestir',
              key: 'cpsBestirsImportPost',
              show: () => ({ empty: false })
            },
            export: {
              config: {
                fileName: '短期激励'
              },
              req: config.getBestirsList,
              key: 'cpsBestirsExport'
            },
            editor: {
              reward: {
                type: 'button',
                func: (row, col) => {
                  this.openDetail(row)
                }
              }
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
    methods: {
      openDetail (row) {
        this.currentRowId = row.id
        this.isShowDetailDialog = true
      },
      fetch (options = {}) {
        this.load()
        req('getBestirsList', options).then(res => {
          if (res) {
            res.data.map(item => {
              if (item.checkMonth !== null) {
                item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
              } else {
                return ''
              }
            })
            Object.assign(this.table, res)
            this.loaded()
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
          this.resetAllParam(1)
          this.delBestirs([scope.row.id])
        })
      },
      delBestirs (idArr = []) {
        return req('delBestirs', idArr).then(res => {
          if (res) {
            showMessage('success', '删除成功！')
            this.fetch(this.allParam)
          } else {
            showMessage('danger', '删除失败！')
          }
        })
      },
      modifyBestirs (params = {}) {
        return req('modifyBestirs', params).then(res => {
          if (res) {
            this.fetch(this.allParam)
            showMessage('success', '修改成功！')
          } else {
            showMessage('danger', '修改失败！')
          }
        })
      },
      addBestirs (params = {}) {
        return req('addBestirs', params).then(res => {
          if (res) {
            this.reset()
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
      validateForm () {
        return new Promise(resolve => {
          this.$refs['ModifyIncentive'].$refs['form'].validate(res => {
            if (res) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      },
      async handleSave (done) {
        let bool = await this.validateForm()
        return new Promise((resolve, reject) => {
          let tableCellVM = this.$refs['ModifyIncentive'].$refs['tableCell']
          if (tableCellVM.filter(el => !el.validate()).length > 0 || !bool) {
            reject(false)
            return false
          }
          const data = JSON.parse(JSON.stringify(this.$refs['ModifyIncentive'].form))
          data.checkMonth = dateFormat(data.checkMonth, 'YYYYMM')
          data.bestirInfoDto.map(item => {
            delete item._id
          })
          if (this.currentRow.id) {
            this.modifyBestirs(data).then(() => {
              resolve(true)
              done()
            })
          } else {
            this.addBestirs(data).then(() => {
              resolve(true)
              done()
            })
          }
        })
      },
      delete (vm) {
        const selected = vm.getMultipleSelection().map(item => {
          return item.id
        })
        if (!selected.length) return showMessage('info', '请选择至少一项！')
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          this.resetAllParam(selected.length)
          this.delBestirs(selected)
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
