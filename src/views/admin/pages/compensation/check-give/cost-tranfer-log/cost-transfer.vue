<template>
  <i-layout 
    v-loading="loading"
    :element-loading-text="$loadingText" 
    :borderWidth="0"
    :margin="0"
    :headerPadding="0"
    :sectionPadding="0"
    headerKey='payCostTransferListGet'
  >
    <div slot="header" class="form">
      <i-form 
      ref="search" 
      @reset="reset" 
      @search="search" 
      labelWidth="large"
      >
        <el-form-item label="工号:">
          <el-input v-model="form.employeeCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="form.employeeName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="费用类型:">
          <i-select
            v-model="form.costType"
            parameter="EXPENSE_TRANSFER_TYPE"
            placeholder="请选择"
          ></i-select>
        </el-form-item>
        <el-form-item label="划拨月份">
          <el-date-picker
            v-model="form.transferMonth"
            type="month"
            placeholder="请选择"
            value-format="yyyy-MM"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="划出人事范围名称:">
          <remote-select
            v-model="form.transferOutPersonnelName"
            :props="personalAreaProps"
            dataKey="personnelGroup"
            filterable
          ></remote-select>
        </el-form-item>
        <el-form-item label="划出人事范围代码:">
            <el-input v-model="form.transferOutPersonnelCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="划入人事范围名称:">
          <remote-select
            v-model="form.transferInPersonnelName"
            :props="personalAreaProps"
            dataKey="personnelGroup"
            filterable
          ></remote-select>
        </el-form-item>
        <el-form-item label="划入人事范围代码:">
          <el-input v-model="form.transferInPersonnelCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="form.beginDate"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>     
        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions2"
            placeholder="请选择"
          ></el-date-picker>
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
        size="large"
      >
        <detail-edit 
          ref="detailEdit" 
          :accountId="accountId" 
          :costType="costType"
          :shareWay="shareWay"
          :row="row"
        >
        </detail-edit>
      </i-dialog>
      <i-dialog
        v-model="isShowCheckDetail"
        title="查看费用划拨信息"
        destroyedWhenClose
        size="large"
      >
        <check-detail :detailShow="detailShow"></check-detail>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/check-give/cost-tranfer-log'
  import DetailEdit from './detai-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import CheckDetail from './checkDetail'
  import access from 'mixins/access'
  import PaginationMixins from '../mixins/paginationMixins'
  import RemoteSelect from 'components/compensation/remote-select/index'

  export default {
    mixins: [PaginationMixins, access],
    name: 'CostTranferLog',
    components: {
      DetailEdit,
      CheckDetail,
      RemoteSelect
    },
    data () {
      return {
        // 查询表单数据汇总
        form: {
          employeeCode: '',
          employeeName: '',
          costType: '',
          auditMonth: '',
          beginDate: null,
          endDate: null,
          transferOutPersonnelName: '',
          transferOutPersonnelCode: '',
          transferInPersonnelName: '',
          transferInPersonnelCode: ''
        },
        // 详情编辑
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
        isShowCheckDetail: false,
        loading: true,
        dialogTitle: '',
        detailShow: {},
        // 时间限制
        pickerOptions1: {
          disabledDate: (time) => {
            if (!this.form.endDate) return false
            return time.getTime() > new Date(this.form.endDate)
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            if (!this.form.beginDate) return false
            return time.getTime() < new Date(this.form.beginDate)
          }
        },
        // 表格
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'center', width: '100', fixed: true, sortable: true },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '80', fixed: true, sortable: true },
            { prop: 'transferMonth', label: '划拨月份', align: 'center', width: '120', fixed: true, sortable: true },
            { prop: 'beginDate', label: '开始日期', align: 'center', width: '120', display: {date: 'default'}, fixed: true, sortable: true },
            { prop: 'endDate', label: '结束日期', align: 'center', width: '120', display: {date: 'default'}, fixed: true, sortable: true },
            { prop: 'allocationDays', label: '费用分摊天数', align: 'right', width: '100' },
            { prop: 'holidayDays', label: '含法定节假日天数', align: 'right', width: '100' },
            { prop: 'transferOutPersonnelCode', label: '划出人事范围代码', align: 'left', width: '160', sortable: true },
            { prop: 'transferOutPersonnelName', label: '划出人事范围名称', align: 'left', width: '160', sortable: true },
            { prop: 'costCenterOutCode', label: '费用划出成本中心代码', align: 'left', width: '140' },
            { prop: 'costCenterOutName', label: '费用划出成本中心名称', align: 'left', width: '140' },
            { prop: 'costType', label: '费用类型', align: 'center', width: '100', display: {dict: 'EXPENSE_TRANSFER_TYPE'} },
            { prop: 'transferInPersonnelCode', label: '划入人事范围代码', align: 'left', width: '100' },
            { prop: 'transferInPersonnelName', label: '划入人事范围名称', align: 'left', width: '100' },
            { prop: 'costCenterInCode', label: '划入成本中心代码', align: 'left', width: '140' },
            { prop: 'costCenterInName', label: '划入成本中心名称', align: 'left', width: '140' },
            { prop: 'allocationProportion', label: '分摊比例', align: 'center', width: '100' },
            { prop: 'allocationAmount', label: '分摊金额', align: 'right', width: '100', display: {mixin: (row, col) => this.currencyFormat(row[col])} },
            { prop: 'remark', label: '备注', align: 'left', width: '200' },
            { prop: 'lastUpdateBy', label: '维护人', align: 'left', width: '100' },
            { prop: 'lastUpdateDate', label: '操作时间', align: 'center', width: '200', display: {date: 'long'} },
            { prop: 'dataSource', label: '数据来源', align: 'center', width: '100', display: {dict: 'DATA_RESOURCE'} },
            { prop: 'transferState', label: '划拨状态 ', align: 'center', width: '100', display: {dict: 'CL_TRANSFER_STATUS'} }
          ],
          setting: {
            editor: {
              employeeCode: {
                type: 'button',
                func: this.showDetail
              },
              employeeName: {
                type: 'button',
                func: this.showDetail
              }
            },
            export: {
              req: config.getCostTranferLog,
              key: 'payCostTransferExport',
              config: {
                fileName: '费用划拨记录表'
              }
            },
            import: {
              business: 'pay-costTransfer',
              key: 'payCostTransferImport',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'payCostTransferUpdatePut',
                func: this.modifyRow
              },
              {
                text: '删除',
                type: 'danger',
                key: 'payCostTransferDeletePut',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              key: 'payCostTransferAddPost',
              func: this.addPolicy
            }, {
              text: '删除',
              type: 'danger',
              key: 'payCostTransferDeletePut',
              func: this.delete
            }]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        },
         // 人事范围下拉配置
        personalAreaProps: {
          value: 'personnelGroupName',
          label: 'personnelGroupName'
        }
      }
    },
    methods: {
      fetch (options = {}) {
        req('getCostTranferLog', options).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].allocationProportion) { // 将分摊比例转化为百分比显示
              res.data[i].allocationProportion = res.data[i].allocationProportion * 100 + '%'
            }
          }
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.pageLoading = false
          this.loading = false
        })
      },
      /** 新增 */
      addPolicy () {
        this.accountId = ''
        this.costType = ''
        this.dialogTitle = '新增费用划拨记录'
        this.openDetailDialog()
      },
      /** 修改 */
      modifyRow (row) {
        this.accountId = row.costTransferId
        this.costType = row.costType
        this.shareWay = row.shareWay
        this.row = row
        this.dialogTitle = '修改费用划拨记录'
        this.openDetailDialog()
      },
      /** 删除单行 */
      deleteRow (row) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('delCostTranferLog', [row.costTransferId]).then(res => {
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
        const accountSelected = vm.getMultipleSelection().map(item => {
          return item.costTransferId
        })
        if (!accountSelected.length) return showMessage('info', '请选择至少一项！')
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          req('delCostTranferLog', accountSelected).then(res => {
            if (res) {
              showMessage('success', '恭喜你！删除成功！')
             // 判断在最后一页，删除数据量等于最后一页数据量，跳到上一页
              this.resetAllParam(accountSelected.length)
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      /** 打开修改和新增弹窗 */
      openDetailDialog () {
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
      },
      /** 查看单行细节 */
      showDetail (row, col) {
        this.detailShow = row
        this.isShowCheckDetail = true
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
