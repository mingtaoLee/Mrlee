<template>
  <section>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey='payExternalTaxListGet'>
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="税款所属月:">
        <el-date-picker
          v-model="form.taxMonth"
          type="month"
          value-format="yyyy-MM"
          placeholder="请选择"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="所属组织:">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="form.orgUnitId"
            lazy
            size="small"
          ></i-select-tree>
      </el-form-item>
      <el-form-item label="个税主体:">
        <el-input v-model="form.taxOrgunitName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="工号:">
        <el-input v-model="form.employeeCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="form.employeeName" placeholder="请输入"></el-input>
      </el-form-item>
    </i-form>

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
            <el-table-column type="selection"/>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :sortable="col.sortable"
              :align="col.align"
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
    </template>
  </i-layout>
  <i-dialog
    v-model="isShowDialog"
    :title="dialogTitle"
    :toolbar="detailEditToolbar"
    size="small"
    destroyedWhenClose
    >
        <detail-edit ref="detailEdit" :accountId="accountId"></detail-edit>
    </i-dialog>
    <i-dialog
    v-model="isShowDetail"
    title="员工月度纳税记录"
    size="small"
    destroyedWhenClose
    >
        <check-detail  :showData="showData"></check-detail>
    </i-dialog>
     <i-dialog
    v-model="isShowExportW"
    title="导出12w报税表"
    :toolbar="exportWToolbar"
    size="small"
    ref='exportW'
    destroyedWhenClose
    >
        <export-tax-report @yearChange='yearChange'></export-tax-report>
    </i-dialog>
  </section>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import companyReq from 'api/compensation'
  import DetailEdit from './detail-edit'
  import CheckDetail from './check-detail'
  import req, { config } from 'api/compensation/check-give/outer-taxpay-log'
  import { showMessage, confirmPopover } from 'utils/index'
  import ExportTaxReport from './export-report/exportTaxReport'
  import access from 'mixins/access'
  import PaginationMixins from '../mixins/paginationMixins'
  import { getToken } from 'utils/auth'

  export default {
    mixins: [PaginationMixins, access],
    name: 'OuterTaxpayLog',
    components: {
      DetailEdit,
      CheckDetail,
      ExportTaxReport,
      RemoteSelect
    },
    data () {
      return {
        // 查询表单数据汇总
        form: {
          taxMonth: '',
          orgUnitId: '',
          taxOrgunitName: '',
          employeeCode: '',
          employeeName: ''
        },
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
            text: '确定',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        exportWToolbar: [
          {
            text: '确定',
            func: done => {
              this.exportW(done)
            }
          },
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.cancelExportW(done)
            }
          }
        ],
        isShowExportW: false,
        isShowDialog: false,
        loading: true,
        tableLoading: false,
        dialogTitle: '',
        isShowDetail: false,
        showData: {},
        selectYear: '',
        // 个税主体数据请求配置
        companyApiConfig: {
          req: companyReq,
          name: 'getCompanies'
        },
        remoteProps: {
          value: 'companyCode',
          label: 'companyName'
        },
        // 表格
        table: {
          columns: [
            { prop: 'taxMonth', label: '税款所属月', width: '170', align: 'center', sortable: true },
            { prop: 'employeeCode', label: '工号', width: '140', align: 'center', sortable: true },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '140', sortable: true },
            { prop: 'taxOrgunitName', label: '个税主体名称', align: 'left', width: '200', sortable: true },
            { prop: 'taxOrgunitCode', label: '个税主体代码', align: 'left', width: '200', sortable: true },
            { prop: 'taxableIncome', label: '应付工资', align: 'right', width: '170', sortable: true, display: {mixin: (row, col) => this.currencyFormat(row[col])} },
            { prop: 'personalIncomeTax', label: '个税', align: 'right', sortable: true, display: {mixin: (row, col) => this.currencyFormat(row[col])} }
          ],
          setting: {
            editor: {
              employeeCode: {
                type: 'button',
                func: this.showDetail
              }
            },
            export: {
              req: config.getTaxpayLogList,
              key: 'payExternalTaxExport',
              config: {
                fileName: '外部纳税记录表'
              }
            },
            import: {
              text: '导入月度纳税记录',
              business: 'pay-externalTax',
              key: 'payExternalTaxImport',
              show: () => ({ empty: false })
            },
            operator: [
              {
                text: '修改',
                key: 'payExternalTaxUpdatePut',
                func: this.modifyRow
              },
              {
                text: '删除',
                type: 'danger',
                key: 'payExternalTaxDeletePut',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              key: 'payExternalTaxAddPost',
              func: this.addPolicy
            }, {
              text: '删除',
              type: 'danger',
              key: 'payExternalTaxDeletePut',
              func: this.delete
            }, {
              text: '生成年12W报税表',
              key: 'payExternalTaxExportGet',
              type: 'success',
              func: this.exportWReporting
            }]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        }
      }
    },
    created () {
      this.selectYear = new Date().getFullYear() - 1
    },
    methods: {
      fetch (options = { }) {
        req('getTaxpayLogList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
          this.pageLoading = false
        })
      },
      /** 新增编辑 */
      addPolicy () {
        this.accountId = ''
        this.dialogTitle = '新增员工月度纳税记录'
        this.openDetailDialog()
      },
      /** 单条信息编辑 */
      modifyRow (row) {
        this.accountId = row.taxRecordId
        this.dialogTitle = '修改员工月度纳税记录'
        this.openDetailDialog()
      },
      /** 删除单行 */
      deleteRow (row) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('delTaxpay', [row.taxRecordId]).then(res => {
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
        const delRowList = vm.getMultipleSelection().map(item => {
          return item.taxRecordId
        })
        if (!delRowList.length) return showMessage('info', '请选择至少一项！')
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          req('delTaxpay', delRowList).then(res => {
            if (res) {
              showMessage('success', '恭喜你！删除成功！')
              // 判断在最后一页，删除数据量等于最后一页数据量，跳到上一页
              this.resetAllParam(delRowList.length)
              this.fetch(this.allParam)
            } else {
              showMessage('error', '删除失败！')
            }
          })
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      /** 修改和新增页面的确认和取消 */
      handleCancel (done) {
        done()
      },
      yearChange (year) {
        this.selectYear = year
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
      // 导出12W税报表
      exportWReporting () {
        this.isShowExportW = true
      },
      exportW (done) {
        req('exportTaxpayReport', {_year: this.selectYear}).then(res => {
          if (res) {
            let url = `${this.$$.BASE_URL}/pay/external-tax/transfer/export/${this.selectYear}?ihrAdminAuthorization=${getToken()}`
            this.downLoad(url)
          } else {
            showMessage('error', '没有超过年12W收入的员工！')
          }
        })
        done()
      },
      cancelExportW (done) {
        done()
      },
      /** 根据工号查看详情 */
      showDetail (row, col) {
        this.showData = row
        this.isShowDetail = true
      },
      /** 文件下载函数 */
      downLoad (url) {
        let el = document.createElement('a')
        document.body.appendChild(el)
        el.href = url
        el.target = '_self'
        var e = document.createEvent('MouseEvents')
        e.initEvent('click', true, true)
        el.dispatchEvent(e)
        document.body.removeChild(el)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
