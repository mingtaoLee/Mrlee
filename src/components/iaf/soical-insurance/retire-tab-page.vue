<template>
  <i-layout
    :borderWidth="0"
    :margin="0"
    :headerPadding="0"
    :sectionPadding="0"
    header-key="insRetirementGet"
    v-loading="loading"
    :element-loading-text="$loadingText"
  >
    <i-form  
      slot="header" 
      @reset="resetInputs" 
      @search="search" 
      v-model="searchData"
      ref="form"
    >
      <el-form-item label="工号">
        <el-input v-model="searchData.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchData.fullName"></el-input>
      </el-form-item>
      <el-form-item label="组织">
        <el-input v-model="searchData.orgUnitName"></el-input>
      </el-form-item>
      <el-form-item label="人事范围名称">
        <el-input v-model="searchData.personnelGroupName"></el-input>
      </el-form-item>
      <el-form-item label="员工状态">
        <i-select v-model="searchData.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="searchData.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="户头代码">
        <el-input v-model="searchData.accountCode"></el-input>
      </el-form-item>
      <el-form-item label="参保户头">
        <el-input v-model="searchData.accountName"></el-input>
      </el-form-item>
      <el-form-item label="医保办理情况">
        <i-select v-model="searchData.medicalInsuranceStatus" parameter="RETIRED_MEDICAL_STATUS"></i-select>
      </el-form-item>
      <el-form-item label="医保退休时间始">
        <el-date-picker 
          type="date" 
          v-model="searchData.medicalTransactDateStartTime" 
          :picker-options="retireStartDayOptions"
          @change="handleDateChange(searchData.medicalTransactDateStartTime, 'searchData', 'medicalTransactDateStartTime', 'string')"
          :editable="false">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="医保退休时间止">
        <el-date-picker 
          type="date" 
          v-model="searchData.medicalTransactDateEndTime"
          :picker-options="retireEndDayOptions"
          @change="handleDateChange(searchData.medicalTransactDateEndTime, 'searchData', 'medicalTransactDateEndTime', 'string')" 
          :editable="false">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="缴费年月始">
        <el-date-picker 
          type="month" 
          v-model="searchData.payDateStartTime"
          :picker-options="payStartDayOptions"
          @change="handleDateChange(searchData.payDateStartTime, 'searchData', 'payDateStartTime', 'string')" 
          :editable="false">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="缴费年月止">
        <el-date-picker 
          type="month" 
          v-model="searchData.payDateEndTime"
          :picker-options="payEndDayOptions"
          @change="handleDateChange(searchData.payDateEndTime, 'searchData', 'payDateEndTime', 'string')" 
          :editable="false">
        </el-date-picker>
      </el-form-item>
    </i-form>
    <div slot="section" class="mt15">
      <i-table
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
        :table="table"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            @selection-change="getDeleteArr"
            @sort-change="tableSort"
            :data="tableScope.clone"
            v-loading="tableLoading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, key) in table.columns"
              :prop="col.prop"
              :min-width="col.width"
              :sortable="col.sort"
              align="center"
              :label="col.label"
              :formatter="tableScope.formatter"
              :key="key"
            >
              <el-table-column
                v-for="(item, index) in col.children"
                :prop="item.prop"
                :label="item.label"
                align="center"
                :min-width="item.width"
                :formatter="tableScope.formatter"
                :key="index"
              ></el-table-column>
            </el-table-column>
            <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <retire-dialog
        @cancel="dialogCancel"
        @confirm="dialogConfirm"
        ref="retireDialog"
        :title="showTitle"
        :isDialogShow="isDialogShow"
        :dialogForm.sync="dialogFormData"
        :tableData="tableData"
      ></retire-dialog>
    </div>
  </i-layout>
</template>
<script>
import RetireDialog from './dialog/retire-dialog'
import req, { config } from 'api/iaf/insurance-manage'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
export default {
  name: 'RetireTabPage',
  components: {
    RetireDialog
  },
  mixins: [IafSearchMixin],
  data () {
    return {
      lastData: false,
      checkStatuVal: '',
      checkType: [
        {
          label: '查看最新状态信息',
          value: 'checkNewStatus'
        },
        {
          label: '查看所有状态信息',
          value: 'checkAallStatus'
        }
      ],
      // 控制新增或修改的变量
      isAddOrEdit: null,
      loading: true,
      isDialogShow: false,
      tableLoading: true,
      showTitle: '',
      deleteArr: [],
      // 高级搜索数据
      searchData: {
        employeeCode: '',
        fullName: '',
        orgUnitName: '',
        personnelGroupName: '',
        employeeStatus: '',
        idNumber: '',
        accountCode: '',
        accountName: '',
        medicalInsuranceStatus: '',
        medicalTransactDateStartTime: '',
        medicalTransactDateEndTime: '',
        payDateStartTime: '',
        payDateEndTime: ''
      },
      // 对话框表单数据
      dialogFormData: {
        employeeCode: '',
        fullName: '',
        idNumber: '',
        employeeStatus: '',
        accountName: '',
        accountCode: '',
        selfBaseMedicalSupplement: '',
        compBaseMedicalSupplement: '',
        selfSeriousMedicalSupplement: '',
        compSeriousMedicalSupplement: '',
        medicalInsuranceStatus: '',
        medicalTransactDate: '',
        payDate: new Date(),
        selfSeriousMedicalBase: '',
        selfSeriousMedicalRate: '',
        compSeriousMedicalBase: '',
        compSeriousMedicalRate: '',
        compPay: '',
        selfPay: '',
        totalPay: 0
      },
      // 对话框表格数据
      tableData: {
        otherInsuranceList: [
          // {typeCode: '', policyMoney: ''}
        ]
      },
      table: {
        columns: [
          {prop: 'employeeCode', label: '工号', show: true, sort: false, width: '150'},
          {prop: 'fullName', label: '姓名', show: true, sort: false, width: '150'},
          {prop: 'idNumber', label: '身份证号码', show: true, width: '100'},
          {prop: 'accountName', label: '参保户头', show: true, width: '200'},
          {prop: 'accountCode', label: '户头代码', show: true, width: '200'},
          {prop: 'employeeStatus', label: '员工状态', show: true, width: '150', display: {dict: 'EMPLOYEE_STATUS'}},
          {prop: 'personnelGroupName', label: '人事范围名称', show: true, width: '100'},
          {prop: 'personnelGroupCode', label: '人事范围代码', show: true, width: '140'},
          {prop: 'orgUnitName', label: '组织', show: true, width: '100'},
          {prop: 'selfBaseMedicalSupplement', label: '个人基本医疗补缴费用', show: true, width: '100'},
          {prop: 'compBaseMedicalSupplement', label: '单位基本医疗补缴费用', show: true, width: '100'},
          {prop: 'selfSeriousMedicalSupplement', label: '个人大病补医保补缴费用', show: true, width: '100'},
          {prop: 'compSeriousMedicalSupplement', label: '单位大病补医保补缴费用', show: true, width: '100'},
          {prop: 'medicalInsuranceStatus', label: '医疗保险办理情况', show: true, width: '100', display: { dict: 'RETIRED_MEDICAL_STATUS' }},
          {prop: 'medicalTransactDate', label: '医保退休办理时间', show: true, width: '100', display: { date: 'default' }},
          {prop: 'payDate', label: '缴费年月', show: true, width: '140', display: {date: 'yyyy-MM'}},
          {prop: 'selfSeriousMedicalBase', label: '个人大病补医保基数', show: true, width: '100'},
          {prop: 'compSeriousMedicalBase', label: '单位大病补医保基数', show: true, width: '100'},
          {prop: 'selfSeriousMedicalRate', label: '个人大病补医保缴费比例(%)', show: true, width: '150'},
          {prop: 'compSeriousMedicalRate', label: '单位大病补医保比例(%)', show: true, width: '150'},
          {prop: 'selfPay', label: '个人月费用', show: true, width: '130'},
          {prop: 'compPay', label: '单位月费用', show: true, width: '130'},
          {prop: 'totalPay', label: '合计', show: true, width: '100'},
          {prop: 'remark', label: '备注', show: true, width: '150'}
        ],
        setting: {
          toolbar: [
            {text: '新增', func: this.addRecord, key: 'insRetirementPostPost'},
            {text: '删除', func: this.deleteRecord, key: 'insRetirementDelete'}
          ],
          operator: [
            {text: '删除', func: this.deleteRow, key: 'insRetirementDelete'},
            {text: '修改', func: this.modificationRow, key: 'insRetirementPutPut'}
          ],
          import: {
            business: 'iaf-retirementManagementRecordsImport',
            key: 'insRetirementImportPost',
            show: () => ({empty: false})
          },
          export: {
            config: {
              fileName: '退休管理表'
            },
            key: 'insRetirementExportGet',
            req: config.retirementGet        // api 配置信息（参数名以自身业务为准）【必填】
          }
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      }
    }
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      this.searchData.payStartMonth && (this.searchData.payStartMonth = new Date(Date.parse(this.searchData.payStartMonth) + 3600 * 1000 * 8))
      this.searchData.payEndMonth && (this.searchData.payEndMonth = new Date(Date.parse(this.searchData.payEndMonth) + 3600 * 1000 * 8))
      req('retirementGet', Object.assign({}, options, this.searchData, {lastData: this.lastData}))
        .then(res => {
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
    // 将获取数据的函数捆绑在监听页面大小的回调中
    handleSizeChange (options) {
      this.fetch(options)
    },
    // 将获取数据的函数捆绑在监听页数的回调中
    handleCurrentChange (options) {
      this.fetch(options)
    },
    // 多选框选中时，或的删除数据的数组
    getDeleteArr (data) {
      this.deleteArr = data.map(item => {
        return item.retireRecordId
      })
    },
    // 重置表单
    resetInputs () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    // 搜索按钮
    search () {
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
      // this.fetch(this.table.info)
    },
    // 新增按钮
    addRecord () {
      // 清空弹出框数据
      for (let key in this.dialogFormData) {
        key !== 'payDate' && (this.dialogFormData[key] = '')
      }
      this.dialogFormData.payDate = new Date()
      this.isAddOrEdit = 'add'
      this.showTitle = '新增记录'
      this.isDialogShow = true
    },
    dialogCancel () {
      this.isDialogShow = false
    },
    // dialog确定按钮
    dialogConfirm (formData) {
      let submitData = Object.assign({}, this.dialogFormData)
      submitData.selfBaseMedicalSupplement = Number(submitData.selfBaseMedicalSupplement)
      submitData.compBaseMedicalSupplement = Number(submitData.compBaseMedicalSupplement)
      submitData.selfSeriousMedicalSupplement = Number(submitData.selfSeriousMedicalSupplement)
      submitData.compSeriousMedicalSupplement = Number(submitData.compSeriousMedicalSupplement)
      submitData.selfSeriousMedicalBase = Number(submitData.selfSeriousMedicalBase)
      submitData.compSeriousMedicalBase = Number(submitData.compSeriousMedicalBase)
      // 如果新增弹出框请求otherAdd接口
      if (this.isAddOrEdit === 'add') {
        req('retirementPost', submitData)
        .then(data => {
          this.confirmResult('新增成功')
        })
        .catch(() => (this.$refs.retireDialog.toolbar[1].loading = false))
      // 如果修改弹出框请求otherUpdate接口
      } else if (this.isAddOrEdit === 'edit') {
        req('retirementPut', submitData)
        .then(data => {
          this.confirmResult('修改成功')
        })
        .catch(() => (this.$refs.retireDialog.toolbar[1].loading = false))
      }
    },
    confirmResult (message) {
      this.$message({
        type: 'success',
        message
      })
      this.fetch(this.table.info)
      this.isDialogShow = false
      this.$refs.retireDialog.toolbar[1].loading = false
    },
    initLayout () {
      this.$refs.form && this.$refs.form.initLayout()
    },
    // 删除按钮
    deleteRecord () {
      if (this.deleteArr.length) {
        this.$confirm('确定要删除记录吗？').then(() => {
          req('retirementDelete', this.deleteArr).then(data => {
            if (data === true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.fetch(this.table.info)
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      }
    },
    // 查看最新信息
    showNewMsg () {
      this.lastData = true
      this.table.search.lastData = true
      this.fetch(this.table.info)
    },
    // 查看所有信息
    showAllMsg () {
      this.lastData = false
      this.table.search.lastData = false
      this.fetch(this.table.info)
    },
    // 导入
    leadRecord () {},
    // 行操作修改
    modificationRow (row) {
      this.isAddOrEdit = 'edit'
      row.payDate = new Date(row.payDate)
      row.medicalTransactDate = new Date(row.medicalTransactDate)
      // req('otherGetDialogData', {otherRecordId: row.otherRecordId}).then(data => {
      this.dialogFormData = Object.assign({}, row)
      // this.dialogFormData.payMonth = new Date(this.dialogFormData.payMonth)
      this.isDialogShow = true
      this.showTitle = '修改记录'
      // })
    },
    // 行操作删除
    deleteRow (row) {
      this.$confirm('确定要删除记录吗？').then(() => {
        req('retirementDelete', [row.retireRecordId]).then(data => {
          if (data) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.fetch(this.table.info)
          }
        })
      })
    },
    // 排序
    tableSort (row) {},
    checkStatusList (val) {
      if (val === 'checkNewStatus') {
        this.showNewMsg()
      } else {
        this.showAllMsg()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content-card{
  padding:10px;
}
</style>
