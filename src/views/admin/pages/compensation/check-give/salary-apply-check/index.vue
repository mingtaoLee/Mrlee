<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payAuditCheckGet">
    <template slot="header">
      <i-form  @reset="reset" @search="search" >
         <el-form-item label="月份" >
           <el-date-picker
             v-model="searchParms.auditMonth"
             type="month"
             placeholder="请选择"
             :editable="false"
            >
           </el-date-picker>
         </el-form-item>

        <el-form-item label="工资套类别">
           <i-select
             v-model="searchParms.componentListType"
             parameter="COMPONENT_LIST_TYPE"
            >
           </i-select>
         </el-form-item>

         <el-form-item label="公司">
            <el-select v-model="searchParms.companyCode" placeholder="请选择">
                <el-option
                  v-for="item in companyData"
                  :key="item.companyCode"
                  :value="item.companyCode"
                  :label="item.companyName"
                >
              </el-option>
           </el-select>
         </el-form-item>

         <!-- <el-form-item label="审批状态">
           <i-select
             v-model="searchParms.auditStatus"
             parameter="AUDIT_STATUS"
             >
             </i-select>
         </el-form-item> -->

         <el-form-item label="申请人姓名">
           <el-input placeholder="请输入" v-model="searchParms.createByName"></el-input>
         </el-form-item>

         <el-form-item label="薪资组">
           <remote-select
            v-model="searchParms.groupId"
            :props="groupProps"
            dataKey="salaryGroup"
            :multiple="false"
            :collapseTags="false"
            :displayKeys="displayKeys"
            filterable
           ></remote-select>
          </el-form-item>

          <el-form-item label="最小金额">
           <el-input placeholder="请输入"  v-model="searchParms.minAmount"></el-input>
         </el-form-item>

         <el-form-item label="最大金额">
           <el-input placeholder="请输入" v-model="searchParms.maxAmount"></el-input>
         </el-form-item>

         <el-form-item label="处理状态">
           <i-select
             v-model="searchParms.auditRecordStatus"
             parameter="AUDIT_HANDLE_STATUS"
             >
             </i-select>
         </el-form-item>

         <el-form-item label="工资批次">
           <el-input placeholder="请输入" v-model="searchParms.processCode"></el-input>
         </el-form-item>

         <el-form-item label="支付账户">
           <el-input placeholder="请输入" v-model="searchParms.payAccount"></el-input>
         </el-form-item>

         <el-form-item label="基本户">
           <el-input placeholder="请输入" v-model="searchParms.basicAccount"></el-input>
         </el-form-item>

         <el-form-item label="制单人工号">
           <el-input placeholder="请输入" v-model="searchParms.madeEmployeeCode"></el-input>
         </el-form-item>
       </i-form>
     </template>
     <template slot="section">
        <i-table
         :table="table"
         v-loading="pageLoading"
         :element-loading-text="$loadingText"
         @pageSizeChange="handleSizeChange"
         @pageIndexChange="handleCurrentChange"
         >
          <template slot="table" slot-scope="tableScope">
            <el-table
              border
              :data="tableScope.clone"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="selectionChangeHandler(tableScope, $event)"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  >
                </el-table-column>

                <el-table-column
                   v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :formatter="tableScope.formatter"
                  :align="item.align"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  v-if = "item.label"
                 >
                </el-table-column>

                <el-table-column
                  prop="basicAccount"
                  label="基本户"
                  :min-width="120"
                  :align="center"
                  show-overflow-tooltip
                  sortable
                  v-else-if="item.isBasicAccount"
                >
                 <template slot-scope="scope">
                    <span class="controller-link" v-if="accessMap['payAuditCheckCompanyAccountsUpdatePut']"
                     @click="changeBasicAccount(scope)">
                      <a>{{scope.row.basicAccount}}</a>
                    </span>
                    <span v-else>
                      <a>{{scope.row.basicAccount}}</a>
                    </span>
                  </template>
              </el-table-column>

              <el-table-column
                prop="payAccount"
                label="支付账户"
                :min-width="120"
                :align="center"
                show-overflow-tooltip
                sortable
                v-else-if="item.ispayAccount"
               >
               <template slot-scope="scope">
                    <span class="controller-link" v-if="accessMap['payAuditCheckGroupAccountsUpdatePut']"
                     @click="changePayAccount(scope)">
                      <a>{{scope.row.payAccount}}</a>
                    </span>
                    <span v-else>
                      <a>{{scope.row.payAccount}}</a>
                    </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        title="修改基本账户"
        size="mini"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit
          ref="detailEdit"
          :companyAccountId="selectCompanyAccountId"
          :companyCode="selectCompanyCode"
          :basicAccount="selectBasicAccount"
          :paymentCompanyName="selectPaymentCompanyName"
          :companyName="selectCompanyName"
        >
        </detail-edit>
      </i-dialog>
      <i-dialog
        v-model="isShowDialogSecond"
        title="修改支付账户"
        size="small"
        :toolbar="detailEditSecondToolbar"
        destroyedWhenClose
      >
        <detail-edit-second
          ref="detailEditSecond"
          :payrollAuditRecordId="selectPayrollAuditRecordId"
          :companyAccountId="selectCompanyAccountId"
          :paymentCompanyName="selectPaymentCompanyName"
        >
        </detail-edit-second>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
import req, { config } from 'api/compensation/check-give/salaryApplyCheck'
import detailEdit from './detail-edit'
import detailEditSecond from './detail-edit-second'
import { showMessage, confirmPopover } from 'utils/index'
import access from 'mixins/access'
import initMonthMixin from '../mixins/initMonthMixin'
import searchMixin from '../mixins/searchMixin'
import RemoteSelect from 'components/compensation/remote-select/index'

export default {
  mixins: [access, initMonthMixin, searchMixin],
  components: {
    detailEditSecond,
    detailEdit,
    RemoteSelect
  },
  data () {
    return {
      loading: true,
      idselected: [],
      companyData: [],
      isShowDialog: false,
      isShowDialogSecond: false,
      // 带到子页面数据
      selectCompanyAccountId: '',
      selectCompanyCode: '',
      selectCompanyName: '',
      selectBasicAccount: '',
      selectPayrollAuditRecordId: '',
      selectPaymentCompanyName: '',
      // 搜索框
      searchParms: {
        auditMonth: '',
        groupId: '',
        auditStatus: '',
        minAmount: '',
        maxAmount: '',
        createByName: '',
        auditRecordStatus: '',
        componentListType: '',
        processCode: '',
        payAccount: '',
        basicAccount: '',
        madeEmployeeCode: ''
      },
        // 详情编辑
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
      detailEditSecondToolbar: [
        {
          text: '取消',
          type: 'plain',
          func: done => {
            this.handleCancelSecond(done)
          }
        },
        {
          text: '确认',
          func: done => {
            this.handleSaveSecond(done)
          }
        }
      ],

       // 工资组选择器配置
      groupProps: {
        value: 'groupId',
        label: 'groupName'
      },
      displayKeys: ['groupCode', 'groupName'],
      companyProps: {
        value: 'companyCode',
        label: 'companyName'
      },
      // 表格
      table: {
        columns: [
          { prop: 'auditMonth', label: '月份', width: 100, align: 'center', sortable: true, fixed: true },
          { prop: 'companyName', label: '公司', width: 120, align: 'left', sortable: true, fixed: true },
          { prop: 'basicAccount', isBasicAccount: true },
          { prop: 'groupName', label: '薪资组', width: 120, align: 'left', sortable: true },
          { prop: 'processCode', label: '工资批次', width: 120, align: 'right', sortable: true },
          { prop: 'paymentCompanyName', label: '支付主体', width: 120, align: 'left', sortable: true },
          { prop: 'payAccount', ispayAccount: true },
          { prop: 'totalNumber', label: '人数', width: 100, align: 'right', sortable: true },
          { prop: 'amount', label: '金额', width: 100, align: 'right', sortable: true },
          { prop: 'auditRecordStatus', label: '处理状态', width: 100, align: 'center', display: {dict: 'AUDIT_HANDLE_STATUS'} },
          { prop: 'createDate', label: '申请时间', width: 140, align: 'center', display: {date: 'long'}, sortable: true },
          { prop: 'createByName', label: '申请人姓名', width: 120, align: 'left', sortable: true },
          { prop: 'madeEmployeeCode', label: '制单人工号', width: 120, align: 'center', sortable: true },
          { prop: 'madeDate', label: '制单时间', width: 140, align: 'center', display: {date: 'long'}, sortable: true },
          { prop: 'transferEmployeeCode', label: '调拨人工号', width: 120, align: 'center', sortable: true },
          { prop: 'transferDate', label: '调拨时间', width: 140, align: 'center', display: {date: 'long'}, sortable: true }
        ],
        setting: {
          export: {
            req: config.getSalaryApplyData,
            config: {
              fileName: '资金组用款申请管理明细表'
            }
          },
          // 按钮
          toolbar: [
            {
              text: '制单',
              func: this.billsMake,
              key: 'payAuditCheckBillMakePut'
            },
            {
              text: '撤销制单',
              func: this.cancelBillsMake,
              key: 'payAuditCheckBillCancelPut'
            },
            {
              text: '调拨',
              func: this.transerence,
              key: 'payAuditCheckTransferencePut'
            }
          ]
        },
        data: [],
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      }
    }
  },
  created () {
    this.searchParms.componentListType = '01'
    this.getInitMonth()
    this.searchParms.auditMonth = this.searchMonth
    this.getCompanyCode()
  },
  mounted () {
    this.table.search = {auditMonth: this.searchParms.auditMonth, componentListType: this.searchParms.componentListType}
    // this.table.setting.export.elTable = this.$refs.elTable  // 挂载
  },
  methods: {
        // ---------------------------------页面通用----------------------------------------
    // 获取表格数据列表
    fetch (options = {}) {
      req('getSalaryApplyData', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(key => {
          this.table[key] = res[key]
        })
        this.pageLoading = false
        this.loading = false
      })
    },
    // 选择行事件
    selectionChangeHandler ({ selectionChangeHandler }, selection) {
      selectionChangeHandler(selection)
    },
    // ---------------------------------页面业务----------------------------------------
    // 搜索框公司编码
    getCompanyCode () {
      req('getCompanyCode')
      .then(res => {
        this.companyData = res
      })
    },
    // 获得payrollAuditRecordId
    getPayrollAuditRecordId (vm) {
      const selected = vm.getMultipleSelection().map(item => {
        return item.payrollAuditRecordId
      })
      this.idselected = selected
    },
    // 制单
    billsMake (vm) {
      this.getPayrollAuditRecordId(vm)
      this.bottonOperation('确定要申请制单吗？', 'billsMake')
    },
     // 撤销制单
    cancelBillsMake (vm) {
      this.getPayrollAuditRecordId(vm)
      this.bottonOperation('确定要申请撤销制单吗？', 'cancelBillsMake')
    },
    // 调拨
    transerence (vm) {
      this.getPayrollAuditRecordId(vm)
      this.bottonOperation('确定要申请调拨吗？', 'transerence')
    },
    // 按钮功能封装
    bottonOperation (message, request) {
      if (!this.idselected.length) return showMessage('info', '请选择至少一项！')
      confirmPopover('warning', message, () => {
        return req(request, this.idselected).then(res => {
          if (res) {
            showMessage('success', '申请成功!')
            this.getParms()
            this.table.search = this.reqParams
          } else {
            showMessage('danger', '申请失败!')
          }
        })
      })
    },
    // 打开页面修改基本账户
    changeBasicAccount (scope) {
      this.isShowDialog = true
      this.selectCompanyAccountId = scope.row.companyAccountId
      this.selectCompanyCode = scope.row.companyCode
      this.selectBasicAccount = scope.row.basicAccount
      this.selectCompanyName = scope.row.companyName
    },
    // 发起修改基本账户请求
    handleSave (done) {
      this.$refs.detailEdit.validate().then(res => {
        if (res) {
          req('changeBasicAccount', this.$refs.detailEdit.accountData).then(res => {
            if (res) {
              done()
              showMessage('success', '保存成功!')
              this.getParms()
              this.table.search = this.reqParams
            } else {
              showMessage('danger', '保存失败!')
            }
          })
        }
      })
    },
    handleCancel (done) {
      done()
    },
        // 打开页面修改支付账户
    changePayAccount (scope) {
      this.isShowDialogSecond = true
      this.selectPayrollAuditRecordId = scope.row.payrollAuditRecordId
      this.selectCompanyAccountId = scope.row.companyAccountId
      this.selectPaymentCompanyName = scope.row.paymentCompanyName
    },
    // 发起修改支付账户
    handleSaveSecond (done) {
      if (this.$refs.detailEditSecond.accountData.companyAccountId === '') {
        this.$refs.detailEditSecond.accountData.companyAccountId = this.selectCompanyAccountId
      }
      req('changePayAccount', this.$refs.detailEditSecond.accountData).then(res => {
        if (res) {
          done()
          showMessage('success', '保存成功!')
          this.getParms()
          this.table.search = this.reqParams
        } else {
          showMessage('danger', '保存失败!')
        }
      })
    },
    handleCancelSecond (done) {
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
