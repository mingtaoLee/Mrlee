<template>
  <section class="pers-change table-card">
    <div id="headinfo">
      <ul>
        <li class="title"><span>实发总额 : </span><b>{{pageInfor.finalPayingAmount}}</b></li>
        <li class="title"><span>工资年月 : </span>{{pageInfor.payMonth}}</li>
        <li class="title"><span>薪资组 : </span>{{pageInfor.groupName}}</li>
        <li class="title"><span>过账推送状态 : </span>{{pageInfor.postingStatusName}}</li>
        <li class="title"><span>是否已出款 : </span>{{pageInfor.payrollAuditStatusName}}</li>
        <li class="title"><span>发布状态 : </span>{{pageInfor.isIssueName}}</li>
      </ul>
    </div>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payProcessesRecordsChildGet">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="工号:">
        <el-input v-model="form.employeeCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
          <el-input v-model="form.fullName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="身份证号:">
          <el-input v-model="form.idNumber" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="发放状态:">
          <i-select v-model="form.paymentStatus" parameter="PAY_STATUS" placeholder="请选择"></i-select>
      </el-form-item>
    </i-form>
    <div slot="section" v-loading="pageLoading" :element-loading-text="$loadingText">
      <template>
        <i-table
          class="table"
          :table="table"
          ref="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone"
              border
              @selection-change="selectionChangeHandler(tableScope, $event)">
              <!-- 动态、多级表头需要使用 tableScope.columns -->
              <el-table-column type="selection"/>
              <el-table-column
                v-for="col of tableScope.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :sortable="col.sortable"
                :fixed="col.fixed"
                :align="col.align"
                :formatter="tableScope.formatter">
                <el-table-column
                  v-for="son of col.children"
                  :key="son.prop"
                  :prop="son.prop"
                  :label="son.label"
                  :width="son.width"
                  :align="son.align"
                  :formatter="tableScope.formatter">
                </el-table-column>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
      </template>
    </div>
  </i-layout>
  <i-dialog
    v-model="isShowStopPay"
    title="紧急止付"
    :toolbar="stopPayToolbar"
    size="standard"
    destroyedWhenClose
    >
      <stop-pay ref="stopPay" :accountList="accountList" :processId="processId"></stop-pay>
    </i-dialog>
    <i-personnel-select
    v-if="accountId ? false : true"
    :isShow.sync="isShowPersonnel"
    :multiple="true"
    :defaultSelectedPersonnel="selectedPersonnel"
    @confirm="handlePersonnelDialogConfirm">
    </i-personnel-select>
  </section>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import StopPay from './stop-pay'
  import req, { config } from 'api/compensation/check-give/salary-give'
  import { showMessage, confirmPopover, windowOpen, getDict } from 'utils/index'
  import Access from 'mixins/access'

  export default {
    name: 'SalaryGiveDetail',
    mixins: [Access],
    components: {
      ITable,
      ITableCell,
      ILayout,
      StopPay
    },
    data () {
      return {
        form: {
          employeeCode: '',
          fullName: '',
          idNumber: '',
          paymentStatus: ''
        },
        pageInfor: {
          finalPayingAmount: '',
          groupName: '',
          isIssue: '',
          isIssueName: '',
          payMonth: '',
          payrollAuditStatus: '',
          payrollAuditStatusName: '',
          postingStatus: '',
          postingStatusName: '',
          processId: ''
        },
        // 紧急止付页面按钮
        stopPayToolbar: [
          {
            text: '返回',
            type: 'plain',
            func: done => {
              this.stopPayCancel(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.stopPayConfirm(done)
            }
          }
        ],
        isShowStopPay: false,
        isShowPersonnel: false,
        loading: true,
        pageLoading: true,
        accountList: [],
        delRowLsit: [],
        processId: '',
        // 字典数据
        costWhetherType: [],
        postWhetherType: [],
        postingStatus: [],
        // 表格
        table: {
          columns: [],
          setting: {
            export: {
              req: config.getSalaryGiveDetail,
              key: 'payProcessesProcessIdProcessRecordsGet',
              config: {
                fileName: '工资发放明细表',
                sync: false
              },
              param: () => ({
                processId: this.processId
              })
            },
            toolbar: [{
              text: '紧急止付',
              key: 'payProcessesRecordsSuspendPut',
              func: this.addStopPay
            }, {
              text: '剔除',
              key: 'payProcessesRecordsDeletePut',
              type: 'danger',
              func: this.delete
            }, {
              text: '追加',
              key: 'payProcessesRecordsAddPut',
              func: this.addPaySalary
            }, {
              text: '返回',
              type: 'plain',
              // key: 'payProcessesRecordsGet',
              func: this.back
            }]
          },
          data: [],
          info: null,
          total: 0,
          renderColumns: true,
          multiple: true,
          showPagebar: true
        }
      }
    },
    created () {
      this.processId = this.$router.currentRoute.query.processId
      this.init()
    },
    computed: {
    // 分页信息
      pageInfo (value) {
        const pageInfo = this.table.info
        return { pageSize: pageInfo.pageSize, pageIndex: pageInfo.pageIndex }
      },
    // 全部搜索条件
      allParam (value) {
        return { ...this.pageInfo, ...this.form }
      },
    // 最后一页剩余数据量
      leftOver (value) {
        const num = this.table.total
        return num % 10
      },
    // 判断是否在最后一页
      isLastPage (value) {
        if (Math.ceil(this.table.total / 10) === this.table.info.pageIndex) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      init () {
        this.fetch()
        this.fetchHead()
      },
      /** 分页显示页数变化监听 */
      handleSizeChange (options) {
        this.fetch(Object.assign(options, this.form))
      },
      /** 当前页数变化监听 */
      handleCurrentChange (options) {
        this.pageLoading = true
        this.fetch(Object.assign(options, this.form))
      },
      /** 获取表上方和表头信息 */
      fetchHead (val) {
        // 表上方数据请求
        req('getSalaryGiveMarkDetail', {processId: this.processId}).then(res => {
          if (val) {
            this.pageInfor.finalPayingAmount = res.finalPayingAmount
          } else {
            this.pageInfor = res
            this.getWhetherType()
            this.getPostingStatus()
          }
        })
        // 表头结构数据请求
        req('getProcessSheetHead', {processId: this.processId}).then(res => {
          // 添加排序功能和列固定
          for (let i = 0; i < 13; i++) {
            res.columns[i].sortable = true
            res.columns[i].width = '120'
            if (i === 0 || i === 1) {
              res.columns[i].fixed = true
            }
          }
          // 添加表头字典转换
          for (let key in res.columns) {
            if (res.columns[key].prop === 'paymentStatus') {
              res.columns[key].display = {dict: 'PAY_STATUS'}
            }
            if (res.columns[key].prop === 'deliverType') {
              res.columns[key].display = {dict: 'DELIVER_TYPE'}
            }
            if (res.columns[key].prop === 'bankCode') {
              res.columns[key].display = {dict: 'BANK_TYPE'}
            }
          }
          this.table.columns = res.columns
        })
      },
     // 表上方数据请求
      fetchTop () {
        req('getSalaryGiveMarkDetail', {processId: this.processId}).then(res => {
          this.pageInfor = res
          this.getWhetherType()
          this.getPostingStatus()
        })
      },
      // 获得字典数据
      getPostingStatus () {
        getDict('POSTING_STATUS').then(res => {
          console.log(res)
          let status = this.pageInfor.postingStatus
          this.postingStatus = res.filter(function (key) {
            return key.value === status
          })
          this.pageInfor.postingStatusName = this.postingStatus[0].label
        })
      },
      getWhetherType () {
        getDict('WHETHER_TYPE').then(res => {
          console.log(res)
          let costType = this.pageInfor.payrollAuditStatus
          let postType = this.pageInfor.isIssue
          this.costWhetherType = res.filter(function (key) {
            return key.value === costType
          })
          this.postWhetherType = res.filter(function (key) {
            return key.value === postType
          })
          this.pageInfor.payrollAuditStatusName = this.costWhetherType[0].label
          this.pageInfor.isIssueName = this.postWhetherType[0].label
        })
      },
      /** 获取表格数据 */
      fetch (options = {}) {
        req('getSalaryGiveDetail', { ...options, processId: this.processId }).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
          this.pageLoading = false
        })
      },
      /** 重置搜索条件 */
      reset () {
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
      },
      /** 执行搜索方法 */
      search () {
        this.pageLoading = true
        this.fetch({ ...this.form, processId: this.processId })
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      /** 新增紧急止付 */
      addStopPay (vm) {
        if (vm.getMultipleSelection().length <= 0) {
          return showMessage('info', '请至少选择一个项！')
        }
        this.accountList = vm.getMultipleSelection()
        this.isShowStopPay = true
        this.accountList.map(key => {
          key.blockedReason = ''
        })
      },
      /** 追加支付 */
      addPaySalary () {
        this.isShowPersonnel = true
      },
      /** 剔除 */
      delete (vm) {
        const deleteList = vm.getMultipleSelection().map(item => {
          return item.employeeId
        })
        if (deleteList.length <= 0) {
          return showMessage('info', '请至少选择一个项！')
        }
        confirmPopover('warning', '你确定要将选中人员从发放过程中删除？', () => {
          deleteList.processId = this.processId
          req('delEmployeeById', deleteList).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
               // 判断在最后一页，删除数据量等于最后一页数据量，跳到上一页
              if (this.leftOver === deleteList.length && this.isLastPage) {
                this.fetch(Object.assign(this.allParam, {pageIndex: (this.allParam.pageIndex - 1)}))
                this.fetchHead(true)
              } else {
                this.fetch(this.allParam)
                this.fetchHead(true)
              }
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      /** 紧急止付页面按钮 */
      stopPayConfirm (done) {
        this.$refs.stopPay.confirm().then(res => {
          if (res) {
            const arr = this.$refs.stopPay.sendFlowList
            const processId = this.$refs.stopPay.processId
            windowOpen(`/flow.html#/flow/PayProcessSuspendProcess`, { processType: 'PayProcessSuspendProcess', arr: encodeURIComponent(JSON.stringify(arr)), processId: processId })
            showMessage('success', '发起流程成功！')
            done()
          } else {
            showMessage('danger', '发起流程失败！')
          }
        })
      },
      stopPayCancel (done) {
        done()
      },
      import () {},
      back () {
        this.$router.back()
      },
      /** 追加人员选择器 */
      handlePersonnelDialogConfirm (selected) {
        const addPayList = selected.map(item => {
          return item.employeeId
        })
        addPayList.processId = this.processId // 转化为符合后端的数据结构
        req('putAddPay', addPayList).then(res => {
          if (res) {
            showMessage('success', '追加成功！')
            this.fetch()
            this.fetchHead(true)
          } else {
            showMessage('danger', '追加失败！')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
  .title{
    height: 40px;
    line-height:40px;
    float:left;
    padding-right:30px;
    font-family: 微软雅黑;
    font-weight: 410;
    font-style: normal;
    font-size: 12px;
    color: rgb(153, 153, 153);
  }
  #headinfo{
    padding-left:20px;
    overflow:hidden;
    background:#fff;
  }
</style>



