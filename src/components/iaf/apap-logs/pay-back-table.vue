<template>
  <i-layout 
    :headerPadding="0" 
    :borderWidth="0" 
    :margin="0"  
    :sectionPadding="0"  
    :titlePadding="3"
    header-key="insAccountingFrp"
    v-loading="loading"
    :element-loading-text="$loadingText"
  >
    <i-form 
      @reset="resetInputs" 
      @search="search" 
      slot="header" 
      ref="form"
    >
      <el-form-item label="工号:">
        <el-input v-model="searchData.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="searchData.fullName"></el-input>
      </el-form-item>
      <el-form-item label="组织:">
        <el-input v-model="searchData.orgUnitName"></el-input>
      </el-form-item>
      <el-form-item label="人事范围名称:">
        <el-input v-model="searchData.personnelGroupName"></el-input>
      </el-form-item>
      <el-form-item label="人事范围代码:">
        <el-input v-model="searchData.personnelGroupCode"></el-input>
      </el-form-item>
      <el-form-item label="补缴开始月份:">
        <el-date-picker
          type="month"
          v-model="searchData.startMonth"
          placeholder="选择日期"
          :editable="false"
          :picker-options="startMonthOptions"
          @change="handleMonthDayDateChange(searchData.startMonth, 'searchData', 'startMonth')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="补缴结束月份:">
        <el-date-picker
          type="month"
          v-model="searchData.endMonth"
          placeholder="选择日期"
          :editable="false"
          :picker-options="endMonthOptions"
          @change="handleMonthDayDateChange(searchData.endMonth, 'searchData', 'endMonth')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="补缴原因:">
        <i-select v-model="searchData.reason" parameter="IAF_SUPPLEMENT_REASON"></i-select>
      </el-form-item>
      <el-form-item label="户头代码:">
        <el-input v-model="searchData.accountCode"></el-input>
      </el-form-item>
      <el-form-item label="险种:">
        <i-select v-model="searchData.insuranceType" parameter="INSURANCE_TYPE"></i-select>
      </el-form-item>
      <el-form-item label="缴费状态:">
        <i-select v-model="searchData.paymentStatus" parameter="PAYMENT_STATUS"></i-select>
      </el-form-item>
    </i-form>
    <div slot="section" class="mt15">
      <i-table
        @pageSizeChange="addHandleSizeChange"
        @pageIndexChange="addHandleCurrentChange"
        :table="table"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            @selection-change="handleChange"
            :border="$$.table.border"
            :stripe="$$.table.stripe"
            :data="tableScope.clone"
            v-loading="tableLoading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, idx) of tableScope.columns"
              :key="idx"
              :prop="col.prop"
              :min-width="col.width"
              :label="col.label"
              :formatter="tableScope.formatter"
              align="center"
            >
              <el-table-column
                v-for="(item, index) in col.children"
                :width="item.width"
                :prop="item.prop"
                :label="item.label"
                :key="index"
                :formatter="tableScope.formatter"
                align="center"
              ></el-table-column>
            </el-table-column>
            <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <!-- <apap-dialog ref="apapDialog"
        :requestCheck="requestCheck"
        :visible="dialogShow"
        @cancel="cancel"
        :formData="dialogFormData"
        :tableData="dialogTableData"
        @confirm="confirm"
        @close="closeDialog"
        @open="openDialog">
      </apap-dialog> -->
      <pay-dialog
        @cancel="closeDialog"
        @confirm="confirm"
        ref="payDialog"
        :title="dialogTitle"
        :isDialogShow="dialogShow"
        :dialogForm.sync="dialogFormData"
        :tableData="dialogTableData"
        :showDisabled.sync="showDisabled"
        :accountIdOptions.sync="accountIdOptions"
        :insuranceTypeOptions.sync="insuranceTypeOptions"
        :hideKeysArr="hideKeysArr"
        pageName='payBackTable'
        reasonMessage='请输入补缴原因'
        startMonthMessage='请输入补缴开始月份'
        endMonthMessage='请输入补缴结束月份'
      ></pay-dialog>
    </div>
  </i-layout>
</template>

<script>

import ITable from 'components/common/i-table'
import IDialog from 'components/common/i-dialog/i-dialog'
import PayDialog from './dialog/pay-dialog'
import ITableOperator from 'components/common/i-table-operator'
import IForm from 'components/common/i-form/i-form.vue'
import ISelect from 'components/common/i-select/i-select.vue'
import req, {config} from 'api/iaf/social-security'
import moment from 'moment'
import ILayout from 'components/common/i-layout'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'

export default {
  name: 'PayBackTable',
  components: {
    ITable,
    ITableOperator,
    IForm,
    ISelect,
    ILayout,
    IDialog,
    PayDialog
  },
  mixins: [IafSearchMixin],
  data () {
    return {
      hideKeysArr: ['04', '05', '06'],
      deleteArr: [],
      accountIdOptions: [],
      insuranceTypeOptions: [],
      tableLoading: true,
      dialogShow: false,
      showDisabled: true,
      toolbar: [{
        text: '取消',
        type: 'text',
        hide: false,
        func: this.closeDialog
      }, {
        text: '确定',
        type: 'primary',
        hide: false,
        func: this.confirm
      }],
      requestCheck: '', // 请求接口标识
      updateReq: null,
      dialogTitle: '',
      loading: true,
      table: {
        title: '',
        columns: [
          {prop: 'personnelGroupCode', label: '人事范围代码', width: '100'},
          {prop: 'personnelGroupName', label: '人事范围名称', width: '100'},
          {prop: 'orgUnitName', label: '组织名称', width: '200'},
          {prop: 'employeeCode', label: '工号', width: '150'},
          {prop: 'fullName', label: '姓名', width: '150'},
          {prop: 'paymentType', label: '缴费类型', width: '100', display: {dict: 'PAYMENT_TYPE'}},
          // {prop: 'startMonth', label: '缴纳开始月份', width: '150'},
          // {prop: 'endMonth', label: '缴纳结束月份', width: '150'},
          // {prop: 'totalMonth', label: '补缴月数', width: '150'},
          {prop: 'realPayMonth', label: '实际缴纳月份', width: '150', display: {date: 'yyyy-MM'}},
          {prop: 'payMonth', label: '缴纳开始月份', width: '150', display: {date: 'yyyy-MM'}},
          {prop: 'payEndMonth', label: '缴纳结束月份', width: '150', display: {date: 'yyyy-MM'}},
          {prop: 'payCount', label: '缴费月份数', width: '150'},
          {prop: 'reason', label: '补缴原因', width: '100', display: {dict: 'IAF_SUPPLEMENT_REASON'}},
          {prop: 'accountCode', label: '户头代码', width: '100'},
          {prop: 'insuranceType', label: '险种', width: '100', display: {dict: 'INSURANCE_TYPE'}},
          {label: '单位部分',
            prop: 'UnitPart',
            children: [
              {prop: 'compPayBase', label: '单位基数', width: '100'},
              {prop: 'compPayRatio', label: '单位比例(%)', width: '100'},
              {prop: 'compPayFixedAmount', label: '固定金额', width: '100'},
              {prop: 'comPayAmount', label: '单位缴纳金额', width: '100'},
              {prop: 'comBearAmount', label: '单位承担（个人补缴金额）', width: '100'}
            ]
          },
          {label: '个人部分',
            prop: 'PersonalPart',
            children: [
              {prop: 'empPayBase', label: '个人基数', width: '100'},
              {prop: 'empPayRatio', label: '个人比例(%)', width: '100'},
              {prop: 'empPayFixedAmount', label: '固定金额', width: '100'},
              {prop: 'empPayAmount', label: '个人缴金额', width: '100'},
              {prop: 'empBearAmount', label: '个人承担（单位补缴金额）', width: '100'}
            ]
          },
          {label: '滞纳金',
            prop: 'LateMoney',
            children: [
              {prop: 'compPenalty', label: '单位', width: '100'},
              {prop: 'selfPenalty', label: '个人', width: '100'}
            ]
          },
          {label: '合计',
            prop: 'Total',
            children: [
              {prop: 'comTotal', label: '单位', width: '100'},
              {prop: 'empTotal', label: '个人', width: '100'}
            ]
          },
          {label: '缴费状态', prop: 'paymentStatus', width: '100', display: {dict: 'PAYMENT_STATUS'}},
          {label: '融通单号', prop: 'longtopNo', width: '200'},
          {label: '操作者', prop: 'lastUpdateBy', width: '150'},
          {label: '操作时间', prop: 'lastUpdateDate', width: '200', display: {date: 'default'}}
        ],
        setting: {
          toolbar: [
            {
              text: '新增',
              key: 'insAccountingF',
              func: this.addRecord
            },
            {
              text: '删除',
              key: 'insAccountingFr',
              func: this.deleteRecord
            }
          ],
          import: {
            business: 'iaf-supply',
            key: 'insFrpayImport',
            show: () => ({empty: false})
          },
          export: {
            config: {
              fileName: '补缴表'
            },
            key: 'insFrpayExport',
            req: config.PreBack
          },
          operator: [
            {
              text: '修改',
              key: 'insAccountingFra',
              func: this.editRow
            },
            {
              text: '删除',
              key: 'insAccountingFr',
              func: this.deleteRow
            }
          ]
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true,
        multiple: true
      },
      // 高级搜索
      searchData: {
        employeeCode: '',
        fullName: '',
        orgUnitName: '',
        personnelGroupName: '',
        personnelGroupCode: '',
        reason: '',
        accountCode: '',
        insuranceType: '',
        startMonth: '',
        endMonth: '',
        paymentStatus: '',
        paymentType: '02'
      },
      // 弹出框表单数据
      dialogFormData: {
        employeeCode: '',
        employeeId: '',
        fullName: '',
        accountCode: '',
        accountId: '',
        personnelGroupName: '',
        orgUnitCode: '',
        orgUnitName: '',
        payEndMonth: '',
        payMonth: '',
        insuranceType: '',
        realPayMonth: '',
        empTotal: 0,
        comTotal: 0,
        paymentType: '02',
        deleteComplementarityRecordId: [],
        prePayMonth: '',
        prePayEndMonth: ''
      },
      dialogTableData: []
    }
  },
  mounted () {
    this.getMultipleColumns()
    this.table.search = Object.assign({}, this.searchData)
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('PreBack', Object.assign({}, options, this.searchData))
        .then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.getMultipleData(res.data)
          Object.assign(this.table, res)
          this.loading = false
          this.tableLoading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.tableLoading = false
        })
    },
    closeDialog (done) {
      this.dialogShow = false
    },
    openDialog () {
      this.dialogShow = true
    },
    confirm (data) {
      this.dialogFormData.accountCode = ''
      this.dialogFormData.paymentType = '02'
      let submitData = Object.assign({}, this.dialogFormData)
      submitData.payEndMonth = moment(this.dialogFormData.payEndMonth).format('YYYY-MM-DD')
      submitData.iafComplementarityRecordNewDtoList = data
      if (this.requestCheck === 'add') {
        submitData.deleteComplementarityRecordId = []
        req('apapAdd', submitData).then(data => {
          if (data === true) {
            this.dialogShow = false
            this.$refs.payDialog.toolbar[1].loading = false
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.fetch(this.table.info)
          } else {
            this.dialogShow = true
            this.$refs.payDialog.toolbar[1].loading = false
            this.$message({
              type: 'error',
              message: '新增失败'
            })
          }
        })
        .catch(err => {
          console.log(err, 'err')
        })
      } else if (this.requestCheck === 'update') {
        submitData.iafComplementarityRecordNewDtoList.map(item => {
          this.dialogFormData.deleteComplementarityRecordId.map(data => {
            if (item.accountId === data) {
              item.accountId = item.accountIdCopy
            }
          })
        })
        req('apapUpdate', submitData).then(data => {
          if (data === true) {
            this.dialogShow = false
            this.$refs.payDialog.toolbar[1].loading = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.fetch(this.table.info)
          } else {
            this.dialogShow = true
            this.$refs.payDialog.toolbar[1].loading = false
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          }
        })
      }
    },
    cancel () {
      this.dialogShow = false
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.searchData.paymentType = '02'
    },
    search () {
      this.searchData.startMonth && (this.searchData.startMonth = moment(this.searchData.startMonth).format('YYYY-MM'))
      this.searchData.endMonth && (this.searchData.endMonth = moment(this.searchData.endMonth).format('YYYY-MM'))
      this.table.search = Object.assign({}, this.searchData)
    },
    // 修改记录
    editRow (row) {
      row.payMonth = moment(row.payMonth).format('YYYY-MM-DD')
      req('find', {employeeId: row.employeeId, payMonth: row.payMonth, paymentType: '02'}).then(res => {
        res.iafComplementarityRecordNewDtoList.forEach(item => {
          item.accountId = item.accountName
        })
        res.payMonth = new Date(row.payMonth)
        res.payEndMonth = new Date(row.payEndMonth)
        res.realPayMonth = new Date(row.realPayMonth)
        this.requestCheck = 'update'
        this.dialogTableData = res.iafComplementarityRecordNewDtoList
        this.dialogFormData.deleteComplementarityRecordId = []
        this.dialogFormData = Object.assign({}, this.dialogFormData, res)
        this.dialogFormData.prePayMonth = moment(res.payMonth).format('YYYY-MM-DD')
        this.dialogFormData.prePayEndMonth = moment(res.payEndMonth).format('YYYY-MM-DD')
        this.dialogShow = true
        this.dialogTitle = '修改补缴信息'
      })
    },
    // 删除一行
    deleteRow (row) {
      this.$confirm('确认删除？').then(() => {
        req('PreOrDelete', [row.complementarityRecordId]).then(data => {
          if (data === true) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.search()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      }).catch(() => {})
    },
    // 增加记录
    addRecord () {
      this.requestCheck = 'add'
      this.dialogShow = true
      this.showDisabled = true
      this.dialogTitle = '新增补缴信息'
      Object.keys(this.dialogFormData).forEach(item => {
        if (item !== 'prePayMonth' && item !== 'prePayEndMonth' && item !== 'paymentType' && item !== 'deleteComplementarityRecordId' && item !== 'account') {
          this.dialogFormData[item] = ''
        }
      })
      this.$refs.payDialog.resetTableData()
    },
    // 批量删除记录
    deleteRecord () {
      if (this.deleteArr.length === 0) {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      } else {
        this.$confirm('确认删除？').then(() => {
          req('PreOrDelete', this.deleteArr).then(data => {
            console.log(data)
            if (data === true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.search()
            } else {
              this.dialogShow = false
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {})
      }
    },
    initLayout () {
      this.$refs.form.initLayout()
    },
    handleChange (val) {
      this.deleteArr = val.map(item => {
        return item.complementarityRecordId
      })
    },
    addHandleSizeChange (options) {
      this.fetch(options)
    },
    addHandleCurrentChange (options) {
      this.fetch(options)
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabs-font{
    font-size:16px;
    position:relative;
    top:-5px;
    font-weight:bold;
  }
  .content-card{
    padding:10px;
  }
</style>
