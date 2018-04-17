<template>
  <section>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payProcessesGet">
    <i-form ref="form" @reset="reset" @search="search" slot="header">
      <el-form-item label="核算月份:">
         <el-date-picker
            v-model="form.payMonth"
            type="month"
            placeholder="请选择"
            value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="省区:">
          <i-select-tree
            :multiple="false"
            :lazy="false"
            dataKey="areaUnit"
            nodeKey="areaId"
            :props="setProps"
            v-model="form.areaId"
            size="small"
          ></i-select-tree>
      </el-form-item>
      <el-form-item label="薪资组:">
        <remote-select
          v-model="form.groupId"
          :props="groupProps"
          dataKey="salaryGroup"
          :multiple="false"
          :collapseTags="false"
          :displayKeys="displayKeys"
          filterable
        ></remote-select>
      </el-form-item>
      <el-form-item label="工资套类型:">
        <i-select v-model="form.componentListType" parameter="COMPONENT_LIST_TYPE" placeholder="请选择"></i-select>
      </el-form-item>
      <el-form-item label="过账推送状态:">
        <i-select v-model="form.postingStatus" parameter="POSTING_STATUS" placeholder="请选择"></i-select>
      </el-form-item>
      <el-form-item label="是否已出款:">
        <i-select v-model="form.payrollAuditStatus" parameter="WHETHER_TYPE" placeholder="请选择"></i-select>
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
            @selection-change="selectionChangeHandler">
            <el-table-column type="selection"/>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :sortable="col.sortable"
              :fixed="col.fixed"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :align="col.align"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <i-table-operator :table="tableScope"/>
            <!-- <el-table-column
              label="操作"
              width="160"
              align="center"
              fixed="right"
              v-if="operatorColumn"
            >
              <template slot-scope="scope">
                <i-table-operator
                :table="tableScope"
                :row="scope.row"
                @accessControl="accessControl"/>
              </template>
            </el-table-column> -->
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
  <i-dialog
    v-model="isShowDialog"
    title="请选择要发放的薪资组"
    :toolbar="detailEditToolbar"
    size="small"
    destroyedWhenClose
    >
        <create-edit ref="detailEdit" :salaryGroupList="salaryGroupList"></create-edit>
    </i-dialog>
    <i-dialog
    v-model="isShowDialogSecond"
    title="新建发放过程"
    :toolbar="detailEditToolbarSecond"
    size="standard"
    destroyedWhenClose
    >
        <create-edit-second ref="detailEditSecond" :selectList="selectList"></create-edit-second>
    </i-dialog>
    <i-dialog
    v-model="isShowPostSend"
    title="过账及数据推送"
    :toolbar="postSendToolbar"
    size="small"
    destroyedWhenClose
    >
        <post-send-data></post-send-data>
    </i-dialog>
    <i-dialog
    v-model="isShowApplyCheck"
    title="申请出款"
    :toolbar="applyCheckToolbar"
    size="large"
    destroyedWhenClose
    >
        <apply-check :applyCheckData="applyCheckData"></apply-check>
    </i-dialog>
    <i-dialog
    v-model="isShowCancelPost"
    title="取消过账"
    :toolbar="cancelpostToolbar"
    size="small"
    destroyedWhenClose
    >
        <cancel-post></cancel-post>
    </i-dialog>
    <i-dialog
    v-model="isShowExportTax"
    title="导出个税申报表"
    :toolbar="exportToolbar"
    size="small"
    ref='exportTax'
    destroyedWhenClose
    >
        <export-tax-report exportName='个税申报表.xls'></export-tax-report>
    </i-dialog>
    <i-dialog
    v-model="isShowOfferExportTax"
    title="导出报盘申报表"
    :toolbar="exportOfferToolbar"
    size="small"
    ref='exportTax'
    destroyedWhenClose
    >
        <export-tax-report exportName='银行报盘表.xls'></export-tax-report>
    </i-dialog> 
  </section>
</template>

<script>
  import CreateEdit from './salary-give-create'
  import CreateEditSecond from './salary-give-create-second'
  import PostSendData from './childrenDialog/postSendData'
  import ApplyCheck from './childrenDialog/applyCheck'
  import CancelPost from './childrenDialog/cancelPost'
  import req, { config } from 'api/compensation/check-give/salary-give'
  import { showMessage, confirmPopover, windowOpen } from 'utils/index'
  import ExportTaxReport from './export-report/exportTaxReport'
  import Access from 'mixins/access'
  import PaginationMixins from '../mixins/paginationMixins'
  import RemoteSelect from 'components/compensation/remote-select/index'
  import { getToken } from 'utils/auth'
 //  import { AUTHORIZATION_KEY } from 'config/api'

  export default {
    mixins: [PaginationMixins, Access],
    name: 'SalaryGive',
    components: {
      CreateEdit,
      CreateEditSecond,
      PostSendData,
      ApplyCheck,
      CancelPost,
      ExportTaxReport,
      RemoteSelect
    },
    data () {
      return {
        // 搜索表单集合数据
        form: {
          payMonth: '',
          areaId: '',
          groupId: '',
          componentListType: '',
          payrollAuditStatus: '',
          postingStatus: ''
        },

        // 发放薪资组页面编辑按钮
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
        // 发放过程页面编辑按钮
        detailEditToolbarSecond: [
          {
            text: '返回',
            type: 'plain',
            func: done => {
              this.handleCancelSecond(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.handleSaveSecond(done)
            }
          }
        ],
        // 过账及推送页面按钮
        postSendToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.postCancel(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.postConfirm(done)
            }
          }
        ],
        // 申请出款页面按钮
        applyCheckToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.applyCancel(done)
            }
          },
          {
            text: '提交',
            func: done => {
              this.applyConfirm(done)
            }
          }
        ],
        // 取消过账页面按钮
        cancelpostToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.cancelPostCancel(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.cancelPostConfirm(done)
            }
          }
        ],
        // 个税申报表页面按钮
        exportToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.cancelExportTax(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.exportTax(done)
            }
          }
        ],
        // 报盘申报表页面按钮
        exportOfferToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.cancelExportOffer(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.exportOffer(done)
            }
          }
        ],
        isShowExportW: false,
        isShowDialog: false,
        isShowDialogSecond: false,
        isShowPostSend: false,
        isShowApplyCheck: false,
        isShowCancelPost: false,
        // 个税申报弹框
        isShowExportTax: false,
        // 报盘申报表
        isShowOfferExportTax: false,
        isShowAlert: false, // 遮罩层显示boolean
        loading: true,
        selectList: [],
        postSendDataList: [], // 过账及数据推送数组
        applyCheckList: [], // 申请出款薪资组数组
        cancelPostList: [], // 取消过账数组
        applyCheckData: {},
        salaryGroupList: [], // 薪资组列表
        updatePolicyList: [], // 修正取消列表
        isupdatePolicy: '01', // 用于判断修正按钮是否可以点（‘01可点’）
        isPullDateList: '01', // 用于判断数据推送按钮是否可以点（‘01可点’）
        // 导出公司列表判断
        hasExportCompanyCode: [],
        // 导出银行判断
        isHasBankCode: [],
        // 导出报盘列表
        exportBankList: [],
        // 导出个税列表
        exportTaxList: [],
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        displayKeys: ['groupCode', 'groupName'],
        // 省区树配置
        setProps: {
          children: 'children',
          label: 'areaName'
        },
        // 表格
        table: {
          columns: [
            { prop: 'processName', label: '发放过程名称', width: '150', align: 'left', sortable: true, fixed: true },
            { prop: 'groupCode', label: '薪资组代码', width: '90', align: 'left', fixed: true },
            { prop: 'groupName', label: '薪资组', width: '90', align: 'left', sortable: true, fixed: true },
            { prop: 'deliverType', label: '发放方式', align: 'left', width: '100', sortable: true },
            { prop: 'componentListName', label: '工资套', align: 'left', width: '85', sortable: true },
            { prop: 'componentListType', label: '工资套类型', align: 'center', width: '110', display: {dict: 'COMPONENT_LIST_TYPE'}, sortable: true },
            { prop: 'payMonth', label: '核算月份', align: 'center', width: '100', sortable: true },
            { prop: 'auditRecordStatus', label: '制单状态', align: 'center', display: {dict: 'AUDIT_HANDLE_STATUS'}, width: '100' },
            { prop: 'payrollAuditStatus', label: '是否已出款', align: 'center', width: '100', display: {dict: 'WHETHER_TYPE'} },
            { prop: 'postingStatus', label: '过账推送状态', align: 'left', width: '100', display: {dict: 'POSTING_STATUS'} },
            { prop: 'errorInfo', label: '推送过账错误信息', align: 'left', width: '140' },
            { prop: 'isIssue', label: '是否发布', align: 'center', width: '100', display: {dict: 'WHETHER_TYPE'} },
            { prop: 'createBy', label: '操作人', align: 'center', width: '100' },
            { prop: 'createDate', label: '操作时间', align: 'center', width: '200' }
          ],
          setting: {
            export: {
              req: config.getSalaryGiveList,
              key: 'payProcessesExportGet',
              config: {
                fileName: '工资发放数据'
              }
            },
            operator: [
              {
                text: '查看明细',
                key: 'payProcessesRecordsGet',
                func: this.openSalaryGiveDetail
              },
              {
                text: '删除',
                type: 'danger',
                key: 'payProcessesDeletePut',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新建发放',
              key: 'payProcessesCreatePost',
              func: this.addPolicy
            }, {
              text: '修正发放',
              key: 'payProcessesConfirmUncalculateApplyPut',
              func: this.updatePolicy,
              show: () => {
                return { disable: this.updatePolicyIsDisabled() }
              }
            }, {
              text: '过账及数据推送',
              key: 'payProcessesAuditDataPushPost',
              func: this.postSendData,
              show: () => {
                return { disable: this.pullDataIsDisabled() }
              }
            }, {
              text: '取消过账推送',
              key: 'payProcessesAuditCancelPushPost',
              func: this.cancelPost
            }, {
              text: '导出个税申报表',
              func: this.exportTaxReporting,
              key: 'payProcessesTaxExportPost',
              type: 'success'
            }, {
              text: '导出报盘申报表',
              func: this.exportOfferReporting,
              key: 'payProcessesBankExportPost',
              type: 'success'
            }
            ]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        }
      }
    },
    methods: {
      // ---------------------------页面显示功能---------------------------------
      fetch (options = {}) {
        req('getSalaryGiveList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.pageLoading = false
          this.loading = false
        })
      },
      /** 单行删除 */
      deleteRow (row) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('delSalaryGiveById', {processId: row.processId}).then(res => {
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
      openDetailDialog () {
        this.isShowDialog = true
      },
      // 获取数据状态
      selectionChangeHandler (selection) {
        // 修正发放状态控制
        const isUpdateList = selection.every(status => {
          return (status.auditRecordStatus === '0' || status.auditRecordStatus === '3') && (status.postingStatus === '1' || status.postingStatus === '3' || status.postingStatus === '6' || status.postingStatus === '9')
        })
        this.isupdatePolicy = isUpdateList ? '01' : '02'
        // 过账推送状态控制（能再推送过账状态）
        const pullDateList = selection.every(status => {
          return status.postingStatus === '1' || status.postingStatus === '3' || status.postingStatus === '4'
        })
        this.isPullDateList = pullDateList ? '01' : '02'
      },
      updatePolicyIsDisabled () {
        if (this.isupdatePolicy === '02') {
          return true
        }
      },
      // 过账推送状态控制
      pullDataIsDisabled () {
        if (this.isPullDateList === '02') {
          return true
        }
      },
      // 修正取消
      updatePolicy (vm) {
        if (vm.getMultipleSelection().length <= 0) {
          return showMessage('info', '请至少选择一个薪资组！')
        }
        this.updatePolicyList = vm.getMultipleSelection().map(item => {
          return item.processId
        })
        confirmPopover('warning', '修正发放后会删除该记录，是否进行修正发放', () => {
          return req('putUpdatePolicy', this.updatePolicyList).then(res => {
            if (res) {
              showMessage('success', '申请成功!')
              this.fetch()
            } else {
              showMessage('error', '申请失败!')
            }
          })
        })
      },
      // ----------------------页面确认取消按钮------------------------
      /** 选择发放薪资组 */
      handleCancel (done) {
        done()
      },
      handleSave (done) {
        if (this.$refs.detailEdit.salaryGroupId.length <= 0) {
          return showMessage('info', '请至少选择一个薪资组！')
        }
        this.$refs.detailEdit.getSalaryGroup().then(res => {
          this.selectList = res
          this.isShowDialogSecond = true
        })
      },
      /** 新建发放过程页面按钮 */
      handleCancelSecond (done) {
        done()
      },
      handleSaveSecond (done) {
        let payMonth = this.$refs.detailEditSecond.data.every(item => {
          return item.payMonth
        })
        let componentListTypeName = this.$refs.detailEditSecond.data.every(item => {
          return item.componentListTypeName
        })
        if (payMonth && componentListTypeName) {
          this.$refs.detailEditSecond.buildProcess().then(res => {
            if (res) {
              done()
              this.isShowDialog = false
              showMessage('success', '发放过程创建成功')
              this.fetch()
            } else {
              showMessage('danger', '发放过程创建失败')
            }
          })
        } else {
          showMessage('warning', '信息填写不完整')
        }
      },
      /** 过账及推送页面 */
      postConfirm (done) {
        req('postSendData', {processIds: this.postSendDataList.toString()}).then(res => {
          if (res === '工资推送正在后台运行，可刷新前端页面查看推送状态') {
            showMessage('success', res)
            this.fetch()
          } else {
            let url = `${this.$$.BASE_URL}/pay/processes/audit/data-push?processIds=${this.postSendDataList}&ihrAdminAuthorization=${getToken()}`
            this.downLoad(url)
            showMessage('error', '推送失败！')
          }
        })
        done()
      },
      postCancel (done) {
        done()
      },
      /** 申请出款页面 */
      applyConfirm (done) {
        // 跳转到申请出款流程页面
        windowOpen(`/flow.html#/flow/paySalaryApprovalProcess`, { processType: 'paySalaryApprovalProcess', applyCheckList: this.applyCheckList })
        done()
      },
      applyCancel (done) {
        done()
      },
      /** 取消过账页面 */
      cancelPostConfirm (done) {
        req('postCancelPost', this.cancelPostList).then(res => {
          if (res) {
            showMessage('success', res)
            // this.fetch()
          } else {
            showMessage('error', '取消失败！')
          }
        })
        done()
      },
      cancelPostCancel (done) {
        done()
      },
      /** 跳转到详情页面 */
      openSalaryGiveDetail (row) {
        this.$router.push({path: '/compensation/check-give/salary-give-detail', query: {processId: row.processId}})
      },
      // ------------------------表头按钮-------------------
      /** 新建发放 */
      addPolicy () {
        // req('getSalaryGroup', {}).then(res => {
        //   this.salaryGroupList = []
        //   this.salaryGroupList = res
        // })
        this.openDetailDialog()
      },
      /** 过账及数据推送 */
      postSendData (vm) {
        if (vm.getMultipleSelection().length <= 0) {
          return showMessage('info', '请至少选择一个薪资组！')
        }
        this.postSendDataList = []
        this.postSendDataList = vm.getMultipleSelection().map(item => {
          return item.processId
        })
        this.isShowPostSend = true
      },
      /** 申请出款 */
      applyCheck (vm) {
        if (vm.getMultipleSelection().length <= 0) {
          return showMessage('info', '请至少选择一个薪资组！')
        }
        this.applyCheckList = []
        this.applyCheckList = vm.getMultipleSelection().map(item => {
          return item.processId
        })
        this.applyCheckData = {}
        req('getapplyCheck', this.applyCheckList).then(res => {
          this.applyCheckData = res
          this.isShowApplyCheck = true
        })
      },
      /** 取消过账 */
      cancelPost (vm) {
        if (vm.getMultipleSelection().length <= 0) {
          return showMessage('info', '请至少选择一个薪资组！')
        }
        this.cancelPostList = []
        this.cancelPostList = vm.getMultipleSelection().map(item => {
          return item.processId
        })
        this.isShowCancelPost = true
      },
       /** 导出个税报表() */
      exportTaxReporting (vm) {
        if (vm.getMultipleSelection().length <= 0) {
          return showMessage('info', '请至少选择一个薪资组！')
        }
        this.exportTaxList = []
        this.exportTaxList = vm.getMultipleSelection().map(item => {
          return item.processId
        })
        this.hasExportCompanyCode = []
        this.hasExportCompanyCode = vm.getMultipleSelection().map(item => {
          return item.hasCompanyCode
        })
        this.isShowExportTax = true
      },
      /** 确认导出个税报表() */
      exportTax (done) {
        // let url = '/api/pay/processes/export?companyCode=123'
        // let url = '/api/pay/processes/export?processId=73a555c50f5b480db1e6669e38880556,868c93452fde4e47850f052de2ab7d04'
        // 导出判断的另一种方法
        req('getTaxReporting', {processId: this.exportTaxList.toString()}).then(res => {
          if (res) {
            let url = `${this.$$.BASE_URL}/pay/processes/export?processId=${this.exportTaxList}&ihrAdminAuthorization=${getToken()}`
            this.downLoad(url)
          } else {
            // 请求返回空时提示
            showMessage('error', '未找到对应的个税模板或者表头主体！')
          }
        })
        // if (!this.hasExportCompanyCode.includes('Y')) {
        //   done()
        //   return showMessage('error', '未找到对应的个税模板')
        // } else {
        //   let url = `${this.$$.BASE_URL}/pay/processes/export?processId=${this.exportTaxList}&ihrAdminAuthorization=${getToken()}`
        //   this.downLoad(url)
        // }
        done()
      },
      /** 取消导出个税报表() */
      cancelExportTax (done) {
        done()
      },

      // 导出银行报盘申报表
      exportOfferReporting (vm) {
        if (vm.getMultipleSelection().length <= 0) {
          return showMessage('info', '请至少选择一个薪资组！')
        }
        this.exportBankList = []
        this.exportBankList = vm.getMultipleSelection().map(item => {
          return item.processId
        })
        this.isHasBankCode = []
        this.isHasBankCode = vm.getMultipleSelection().map(item => {
          return item.hasBankCode
        })
        this.isShowOfferExportTax = true
      },
      /** 确认导出银行报盘 */
      exportOffer (done) {
        // let url = '/api/pay/processes/exportbank?areaId=95b14d9c8dc241609806751ad14f9936'
        // let url = '/api/pay/processes/exportbank'
        // 导出异常判断的另一种方法
        req('getBankReporting', {processId: this.exportBankList.toString()}).then(res => {
          if (res) {
            let url = `${this.$$.BASE_URL}/pay/processes/exportbank?processId=${this.exportBankList}&ihrAdminAuthorization=${getToken()}`
            this.downLoad(url)
          } else {
            // 请求返回空时提示
            showMessage('error', '未找到对应的银行模板或者表头主体尾部！')
          }
        })
        // if (!this.isHasBankCode.includes('Y')) {
        //   done()
        //   return showMessage('error', '未找到对应的银行模板')
        // } else {
        //   let url = `${this.$$.BASE_URL}/pay/processes/exportbank?processId=${this.exportBankList}&ihrAdminAuthorization=${getToken()}`
        //   console.log(url)
        //   this.downLoad(url)
        // }
        done()
      },
      /** 取消导出银行报盘 */
      cancelExportOffer (done) {
        done()
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
  #mask{
    text-align:center;
  }
</style>
