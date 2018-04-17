<template>
  <i-layout 
    v-loading="loading"
    :element-loading-text="$loadingText"
    :borderWidth="0"
    :margin="0"
    :headerPadding="0"
    :sectionPadding="0" 
    headerKey='payHourTransferListGet'
  >
    <div slot="header" class="form">
      <i-form 
      @reset="reset" 
      @search="search" 
      ref="search" 
      labelWidth="large">
        <el-form-item label="工号:">
          <el-input v-model="form.employeeCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="form.employeeName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="划出组织代码:">
          <el-input v-model="form.transferOutUnitCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="划出组织:">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="form.transferOutUnit"
            lazy
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="划入组织代码:">
          <el-input v-model="form.transferInUnitCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="划入组织:">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="form.transferInUnit"
            lazy
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="划入人事范围代码:">
          <el-input v-model="form.transferInPersonnelCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="划入人事范围:">
          <remote-select
            v-model="form.transferInPersonnelName"
            :props="personalAreaProps"
            dataKey="personnelGroup"
            filterable
          ></remote-select>
        </el-form-item>
        <el-form-item label="划拨月份:">
          <el-date-picker
            v-model="form.transferMonth"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月份"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="划拨原因:">
          <i-select v-model="form.transferReason" parameter="LABORHOUR_TRANSFER_REASON"></i-select>
        </el-form-item>
      </i-form>
    </div>
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        v-loading="pageLoading"
        :element-loading-text="$loadingText"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column type="selection" width="50" align="right"/>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :align="col.align"
              :fixed="col.fixed"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            >

            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                :col="col.prop"
                :table="tableScope"
                ref="cell"
              />
            </template>
            </el-table-column>

            <i-table-operator :table="tableScope"/>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="dialogTitle"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
        size="standard"
      >
        <detail-edit ref="detailEdit" :accountId="accountId" :slectedReason="slectedReason"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/check-give/laborhour-tranfer'
  import DetailEdit from './detail-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import Access from 'mixins/access'
  import PaginationMixins from '../mixins/paginationMixins'
  import RemoteSelect from 'components/compensation/remote-select/index'

  export default {
    name: 'LaborhourTranfer',
    mixins: [PaginationMixins, Access],
    components: {
      DetailEdit,
      RemoteSelect
    },
    data () {
      return {
        // 查询表单数据汇总
        form: {
          transferMonth: '',
          beginDate: '',
          endDate: '',
          employeeCode: '',
          employeeName: '',
          transferOutUnitCode: '',
          transferOutUnit: '',
          transferInUnitCode: '',
          transferInUnit: '',
          transferInPersonnelCode: '',
          transferInPersonnelName: '',
          transferReason: ''
        },
        // 新增修改对话框按钮
        detailEditToolbar: [
          {
            text: '返回',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          }, {
            text: '确认',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,
        isShowDialogAdd: false,
        isShowHighSearch: false,
        accountId: '',
        slectedReason: '', // 选择划拨原因
        dialogTitle: '',
        loading: true,
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
         // 人事范围下拉配置
        personalAreaProps: {
          value: 'personnelGroupName',
          label: 'personnelGroupName'
        },
        // 时间限制
        pickerOptions1: {
          disabledDate: (time) => {
            let endDate = new Date(this.form.toTime)
            if (endDate) {
              return time.getTime() > endDate
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let beginDateVal = new Date(this.form.fromTime)
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            }
          }
        },
        // 表格
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', width: '100', align: 'center', fixed: true, sortable: true },
            { prop: 'employeeName', label: '姓名', width: '80', align: 'center', fixed: true, sortable: true },
            { prop: 'transferMonth', label: '划拨月份', width: '100', align: 'center', fixed: true, dispaly: { date: 'default' }, sortable: true },
            { prop: 'transferHours', label: '划拨工时', align: 'center', width: '100' },
            { prop: 'transferOutUnitName', label: '划出组织', width: '120', align: 'left', sortable: true },
            { prop: 'transferOutUnitCode', label: '划出组织代码', width: '120', align: 'left', sortable: true },
            { prop: 'transferInUnitName', label: '划入组织', align: 'left', width: '120', sortable: true },
            { prop: 'transferInUnitCode', label: '划入组织代码', align: 'left', width: '120', sortable: true },
            { prop: 'transferInPersonnelName', label: '划入人事范围', align: 'left', width: '120', sortable: true },
            { prop: 'transferInPersonnelCode', label: '划入人事范围代码', align: 'left', width: '150', sortable: true },
            { prop: 'transferReason', label: '划拨原因', align: 'left', width: '100', display: {dict: 'LABORHOUR_TRANSFER_REASON'} },
            { prop: 'remark', label: '备注', align: 'center', width: '100' },
            { prop: 'lastUpdateBy', label: '操作者', align: 'center', width: '100' },
            { prop: 'lastUpdateDate', label: '操作时间', align: 'center', width: '200', display: {date: 'long'} },
            { prop: 'dataSource', label: '数据来源', align: 'left', width: '120', display: {dict: 'DATA_RESOURCE'} },
            { prop: 'transferState', label: '划拨状态', align: 'left', width: '100', display: {dict: 'CL_TRANSFER_STATUS'} }
          ],
          setting: {
            export: {
              req: config.getLabhourList,
              config: {
                fileName: '工时划拨表'
              },
              key: 'payHourTransferExport'
            },
            import: {
              business: 'pay-workingHours',
              show: () => ({ empty: false }),
              key: 'payHourTransferImport'
            },
            operator: [
              {
                text: '修改',
                func: this.modifyRow,
                key: 'payHourTransferUpdatePut'
              },
              {
                text: '删除',
                type: 'danger',
                func: this.deleteRow,
                key: 'payHourTransferDeletePut'
              }
            ],
            toolbar: [{
              text: '新增',
              func: this.addPolicy,
              key: 'payAddHourTransferPost'
            }, {
              text: '删除',
              type: 'danger',
              func: this.delete,
              key: 'payHourTransferDeletePut'
            }],
            editor: {
              // 为了除了字典数据可以显示其他输入文本，无奈加入
              transferReason: {
                type: 'select'
              }
            }
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null,
          editable: false
        }
      }
    },
    methods: {
      fetch (options = {}) {
        req('getLabhourList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.pageLoading = false
          this.loading = false
        })
      },
      /** 新增 */
      addPolicy () {
        this.slectedReason = ''
        this.accountId = ''
        this.dialogTitle = '新增工时划拨信息'
        this.openLaborhourDialog()
      },
      /** 修改 */
      modifyRow (row) {
        this.slectedReason = row.transferReason
        this.accountId = row.transferId
        this.dialogTitle = '修改工时划拨信息'
        this.openLaborhourDialog()
      },
      /** 删除单行 */
      deleteRow (row) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('delLabhour', [row.transferId]).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              // 判断在最后一页，剩余一条数据，删除后跳到上一页
              this.resetAllParam()
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      /** 删除多行 */
      delete (vm) {
        const delLaborhourList = vm.getMultipleSelection().map(item => {
          return item.transferId
        })
        if (!delLaborhourList.length) return showMessage('info', '请选择至少一项！')
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          req('delLabhour', delLaborhourList).then(res => {
            if (res) {
              showMessage('success', '恭喜你！删除成功！')
              // 判断在最后一页，删除数据量等于最后一页数据量，跳到上一页
              this.resetAllParam(delLaborhourList.length)
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      /** 打开编辑弹窗 */
      openLaborhourDialog () {
        this.isShowDialog = true
      },
      /** 修改和新增页面的确认和取消 */
      handleCancel (done) {
        done()
      },
      handleSave (done) {
        this.$refs.detailEdit.save().then(res => {
          if (res === 'modifier') {
            this.fetch(this.allParam)
          } else {
            this.reset()
            this.fetch({ pageSize: this.pageInfo.pageSize, pageIndex: 1 })
          }
          done()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form {
    padding-bottom: 10px;
  }
  .btn {
    margin-top: 10px;
  }
</style>
