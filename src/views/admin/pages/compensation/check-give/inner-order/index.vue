<template>
  <i-layout 
    v-loading='loading' 
    :borderWidth="0"
    :margin="0"
    :headerPadding="0"
    :sectionPadding="0"
    headerKey='payCostAufnTransferListGet'
  >
    <div slot="header" class="form">
      <i-form ref="search" @reset="reset" @search="search">
        <el-form-item label="工号:">
            <el-input v-model="form.employeeCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
            <el-input v-model="form.employeeName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="订单类型:">
            <i-select
            v-model="form.aufnType"
            parameter="AUFN_TRANSFER_TYPE"
            placeholder="请选择"></i-select>
        </el-form-item>
        <el-form-item label="内部订单号:">
            <el-input v-model="form.internalOrder" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称:">
            <remote-select
              v-model="form.transferOutPersonnelName"
              :props="personalAreaProps"
              dataKey="personnelGroup"
              filterable
            ></remote-select>
        </el-form-item>
        <el-form-item label="人事范围代码:">
            <el-input v-model="form.transferOutPersonnelCode" placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="划入组织名称:">
            <i-select-tree
              :multiple="false"
              dataKey="org"
              nodeKey="orgUnitId"
              v-model="form.transferInUnitName"
              lazy
              size="small"
            ></i-select-tree>
        </el-form-item>
        <el-form-item label="划入组织代码:">
            <el-input v-model="form.allocationProportion" placeholder="请输入"></el-input>
        </el-form-item> -->
        <el-form-item label="划拨月份:">
          <el-date-picker
            v-model="form.transferMonth"
            type="month"
            placeholder="请选择"
            value-format="yyyy-MM"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="form.beginDate"
            type="date"
            :picker-options="pickerOptions1"
            placeholder="请选择"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            :picker-options="pickerOptions2"
            placeholder="请选择"
            value-format="yyyy-MM-dd">
          </el-date-picker>
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
        <detail-edit ref="detailEdit" :accountId="accountId"></detail-edit>
      </i-dialog>
      <i-dialog
        v-model="isShowCheckDetail"
        title="查看内部订单信息"
        destroyedWhenClose
        size="large"
      >
        <check-detail :detailShow="detailShow"></check-detail>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/check-give/inner-order'
  import DetailEdit from './edit-innerOrder'
  import { showMessage, confirmPopover } from 'utils/index'
  import CheckDetail from './checkInnerOrder'
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
          transferMonth: '',
          beginDate: null,
          endDate: null,
          aufnType: '',
          transferOutPersonnelName: '',
          transferOutPersonnelCode: '',
          // transferInUnitName: '',
          internalOrder: ''
          // allocationProportion: ''
        },
        // 处理时间格式
        beginDate: '',
        endDate: '',
        // 详情编辑
        detailEditToolbar: [
          {
            text: '返回',
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
        isShowCheckDetail: false,
        loading: true,
        dialogTitle: '',
        detailShow: {},
        // pickerOptions1: {
        //   disabledDate: (time) => {
        //     console.log(time)
        //     if (!this.form.endDate) return false
        //     return time.getTime() > new Date(this.form.endDate) - 24 * 3600 * 1000
        //   }
        // },
        // pickerOptions2: {
        //   disabledDate: (time) => {
        //     if (!this.form.beginDate) return false
        //     return time.getTime() > new Date(this.form.beginDate) - 24 * 3600 * 1000
        //   }
        // },
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
            { prop: 'employeeName', label: '姓名', align: 'left', width: '100', fixed: true, sortable: true },
            { prop: 'transferMonth', label: '划拨月份', align: 'center', width: '100', fixed: true, sortable: true },
            { prop: 'beginDate', label: '开始日期', align: 'center', width: '100', display: {date: 'default'}, fixed: true, sortable: true },
            { prop: 'endDate', label: '结束日期', align: 'center', width: '100', display: {date: 'default'}, fixed: true, sortable: true },
            { prop: 'allocationDay', label: '费用分摊天数', align: 'center', width: '100' },
            { prop: 'transferOutPersonnelCode', label: '费用划出人事范围代码', align: 'left', width: '170', sortable: true },
            { prop: 'transferOutPersonnelName', label: '费用划出人事范围名称', align: 'left', width: '170', sortable: true },
            { prop: 'costCenterOutCode', label: '划出成本中心代码', align: 'left', width: '140' },
            { prop: 'costCenterOutName', label: '划出成本中心名称', align: 'left', width: '140' },
            { prop: 'aufnType', label: '订单类型', align: 'center', width: '100', display: {dict: 'AUFN_TRANSFER_TYPE'} },
            { prop: 'internalOrder', label: '内部订单号', align: 'left', width: '140' },
            { prop: 'cropCode', label: '订单公司代码', align: 'left', width: '140' },
            { prop: 'allocationProportion', label: '分摊比例', align: 'right', width: '100', display: {mixin: (row, col) => this.percentFormat(row[col])} },
            { prop: 'allocationAmount', label: '分摊金额', align: 'right', width: '100', display: {mixin: (row, col) => this.currencyFormat(row[col])} },
            { prop: 'remark', label: '备注', align: 'left', width: '200' },
            { prop: 'lastUpdateBy', label: '操作者', align: 'left', width: '100' },
            { prop: 'lastUpdateDate', label: '操作时间', align: 'center', width: '150', display: {date: 'long'} },
            { prop: 'dataSource', label: '数据来源', align: 'left', width: '100', display: {dict: 'DATA_RESOURCE'} },
            { prop: 'transferState', label: '划拨状态', align: 'left', width: '80', display: {dict: 'CL_TRANSFER_STATUS'} }
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
              req: config.getPayCostAufn,
              key: 'payCostAufnTransferExport',
              config: {
                fileName: '内部订单记录表'
              }
            },
            import: {
              business: 'pay-costAufn',
              key: 'payCostAufnTransferImport',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'payCostAufnTransferUpdatePut',
                func: this.modifyRow
              },
              {
                text: '删除',
                type: 'danger',
                key: 'payCostAufnTransferDeletePut',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              key: 'payCostAufnTransferAddPost',
              func: this.addPolicy
            }, {
              text: '删除',
              type: 'danger',
              key: 'payCostAufnTransferDeletePut',
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
        req('getPayCostAufn', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.pageLoading = false
          this.loading = false
        })
      },
      // 将小数转换为百分比
      percentFormat (value, percent = '%') {
        value = value * 100
        return value ? value + percent : null
      },
      /** 执行搜索方法 */
      search () {
        this.table.search = { ...this.form }
      },
      /** 新增 */
      addPolicy () {
        this.accountId = ''
        this.dialogTitle = '新增内部订单记录'
        this.openDetailDialog()
      },
      /** 修改 */
      modifyRow (row) {
        this.accountId = row.costAufnId
        this.dialogTitle = '修改内部订单记录'
        this.openDetailDialog()
      },
      /** 删除单行 */
      deleteRow (row) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('delCostTranferLog', [row.costAufnId]).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              // 判断在最后一页，剩余一条数据，删除后跳到上一页
              this.resetAllParam()
              this.fetch(this.allParam)
            } else {
              showMessage('error', '删除失败！')
            }
          })
        })
      },
      /** 删除多行 */
      delete (vm) {
        const accountSelected = vm.getMultipleSelection().map(item => {
          return item.costAufnId
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
              showMessage('error', '删除失败！')
            }
          })
        })
      },
      /** 打开修改和新增弹窗 */
      openDetailDialog () {
        this.isShowDialog = true
      },
      /** 修改新增弹窗按钮 */
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
