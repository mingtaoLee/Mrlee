<template>
  <i-layout header-key="insInsuredOthersPost">
    <i-form  slot="header" @reset="resetInputs" @search="search" v-model="searchData">
      <el-form-item label="查看状态">
        <el-select v-model="checkStatuVal" placeholder="请选择" @change="checkStatusList">
          <el-option
            v-for="item in checkType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="searchData.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchData.fullName"></el-input>
      </el-form-item>
      <el-form-item label="组织">
        <el-input v-model="searchData.orgUnitName"></el-input>
      </el-form-item>
      <el-form-item label="缴纳月份起">
        <el-date-picker type="month" v-model="searchData.payStartMonth"></el-date-picker>
      </el-form-item>
      <el-form-item label="缴纳月份止">
        <el-date-picker type="month" v-model="searchData.payEndMonth"></el-date-picker>
      </el-form-item>
      <el-form-item label="人事范围">
        <el-input v-model="searchData.personnelGroupName"></el-input>
      </el-form-item>
    </i-form>
    <div slot="section">
      <i-table
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
        :table="table" 
        v-loading="loading"
        :element-loading-text="$loadingText"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            v-loading="tableScope.loading"
            :element-loading-text="$loadingText"
            @selection-change="getDeleteArr"
            @sort-change="tableSort"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, key) in tableScope.columns"
              :prop="col.prop"
              :min-width="col.width"
              :sortable="col.sort"
              align="center"
              :label="col.label"
              :formatter="tableScope.formatter"
              :key="key">
                <el-table-column
                  v-for="(item, index) in col.children"
                  :prop="item.prop"
                  :label="item.label"
                  align="center"
                  :min-width="item.width"
                  :formatter="tableScope.formatter"
                  :key="index"></el-table-column>
            </el-table-column>
            <i-table-operator :table="tableScope"/>
          </el-table>
        </template>
      </i-table>
      <other-dialog
        ref="otherDialog"
        :title="showTitle"
        :isDialogShow="isDialogShow"
        @confirm="dialogConfirm"
        @cancel="dialogCancel"
        :dialogForm.sync="dialogFormData"
        :tableData="tableData">
      </other-dialog>
    </div>
  </i-layout>
</template>
<script>
import IForm from 'components/common/i-form/i-form'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import ILayout from 'components/common/i-layout'
import OtherDialog from 'components/iaf/other-insurance/other-dialog'
import req, { config } from 'api/iaf/insurance-manage'
export default {
  components: {
    IForm,
    ISelect,
    ITable,
    ILayout,
    OtherDialog
  },
  data () {
    return {
      lastData: true,
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
      isDialogShow: false,
      showTitle: '',
      deleteArr: [],
      payMonth: '',
      // 高级搜索数据
      searchData: {
        employeeCode: '',
        fullName: '',
        orgUnitName: '',
        personnelGroupName: '',
        payStartMonth: '',
        payEndMonth: ''
      },
      // 对话框表单数据
      dialogFormData: {
        employeeCode: '',
        fullName: '',
        orgUnitName: '',
        personnelGroupName: '',
        payMonth: ''
      },
      // 对话框表格数据
      tableData: {
        otherInsuranceList: [
          // {typeCode: '', policyMoney: ''}
        ]
      },
      table: {
        columns: [
          {prop: 'employeeCode', label: '工号', sort: false, width: '100'},
          {prop: 'fullName', label: '姓名', width: '100'},
          {prop: 'orgUnitName', label: '组织', sort: false, width: '150'},
          {prop: 'personnelGroupName', label: '人事范围', sort: false, width: '150'},
          {prop: 'payMonth', label: '缴纳月份', display: { date: 'short' }, sort: false, width: '150'},
          {
            label: '养老保险',
            children: [
              {prop: 'oldageWithholdingPersonalpayment', label: '代扣代缴(个人补缴)', width: '200'},
              {prop: 'oldageWithholdingIndividualtoassumecompanypayment', label: '代扣代缴(个人承担公司补缴)', width: '250'},
              {prop: 'oldageDelayingpaymentIndividualtoassume', label: '滞纳金(个人承担)', width: '200'},
              {prop: 'oldageDelayingpaymentCompanytoundertake', label: '滞纳金(公司承担)', width: '200'},
              {prop: 'oldageCompanytopayCompanypayment', label: '公司缴纳(公司补缴)', width: '200'},
              {prop: 'oldageCompanyreceivableCompanytofillout', label: '公司应收(公司补退)', width: '200'},
              {prop: 'oldageShouldsendFilloutindividual', label: '应发(个人补退)', width: '200'},
              {prop: 'oldageAccountName', label: '养老户头', width: '200'},
              {prop: 'oldageAccountCode', label: '养老户头名称', width: '200'}
            ]
          },
          {
            label: '医疗保险',
            children: [
              {prop: 'healthinsuranceWithholdingPersonalpayment', label: '代扣代缴(个人补缴)', width: '200'},
              {prop: 'healthinsuranceWithholdingIndividualtoassumecompanypayment', label: '代扣代缴(个人承担公司补缴)', width: '250'},
              {prop: 'healthinsuranceDelayingpaymentIndividualtoassume', label: '滞纳金(个人承担)', width: '200'},
              {prop: 'healthinsuranceDelayingpaymentCompanytoundertake', label: '滞纳金(公司承担)', width: '200'},
              {prop: 'healthinsuranceCompanytopayCompanypayment', label: '公司缴纳(公司补缴)', width: '200'},
              {prop: 'healthinsuranceCompanyreceivableCompanytofillout', label: '公司应收(公司补退)', width: '200'},
              {prop: 'healthinsuranceShouldsendFilloutindividual', label: '应发(个人补退)', width: '200'},
              {prop: 'healthinsuranceAccountName', label: '医保户头', width: '200'},
              {prop: 'healthinsuranceAccountCode', label: '医保户头名称', width: '200'}
            ]
          },
          {
            label: '失业保险',
            children: [
              {prop: 'outofworkWithholdingPersonalpayment', label: '代扣代缴(个人补缴)', width: '200'},
              {prop: 'outofworkWithholdingIndividualtoassumecompanypayment', label: '代扣代缴(个人承担公司补缴)', width: '250'},
              {prop: 'outofworkDelayingpaymentIndividualtoassume', label: '滞纳金(个人承担)', width: '200'},
              {prop: 'outofworkDelayingpaymentCompanytoundertake', label: '滞纳金(公司承担)', width: '200'},
              {prop: 'outofworkCompanytopayCompanypayment', label: '公司缴纳(公司补缴)', width: '200'},
              {prop: 'outofworkCompanyreceivableCompanytofillout', label: '公司应收(公司补退)', width: '200'},
              {prop: 'outofworkShouldsendFilloutindividual', label: '应发(个人补退)', width: '200'},
              {prop: 'outofworkAccountName', label: '失业户头', width: '200'},
              {prop: 'outofworkAccountCode', label: '失业户头名称', width: '200'}
            ]
          },
          {
            label: '生育保险',
            children: [
              {prop: 'fertilityWithholdingPersonalpayment', label: '代扣代缴(个人补缴)', width: '200'},
              {prop: 'fertilityWithholdingIndividualtoassumecompanypayment', label: '代扣代缴(个人承担公司补缴)', width: '250'},
              {prop: 'fertilityDelayingpaymentIndividualtoassume', label: '滞纳金(个人承担)', width: '200'},
              {prop: 'fertilityDelayingpaymentCompanytoundertake', label: '滞纳金(公司承担)', width: '200'},
              {prop: 'fertilityCompanytopayCompanypayment', label: '公司缴纳(公司补缴)', width: '200'},
              {prop: 'fertilityCompanyreceivableCompanytofillout', label: '公司应收(公司补退)', width: '200'},
              {prop: 'fertilityShouldsendFilloutindividual', label: '应发(个人补退)', width: '200'},
              {prop: 'fertilityAccountName', label: '生育户头', width: '200'},
              {prop: 'fertilityAccountCode', label: '生育户头名称', width: '200'}
            ]
          },
          {
            label: '工伤保险',
            children: [
              {prop: 'workinjuryWithholdingPersonalpayment', label: '代扣代缴(个人补缴)', width: '200'},
              {prop: 'workinjuryWithholdingIndividualtoassumecompanypayment', label: '代扣代缴(个人承担公司补缴)', width: '250'},
              {prop: 'workinjuryDelayingpaymentIndividualtoassume', label: '滞纳金(个人承担)', width: '200'},
              {prop: 'workinjuryDelayingpaymentCompanytoundertake', label: '滞纳金(公司承担)', width: '200'},
              {prop: 'workinjuryCompanytopayCompanypayment', label: '公司缴纳(公司补缴)', width: '200'},
              {prop: 'workinjuryCompanyreceivableCompanytofillout', label: '公司应收(公司补退)', width: '200'},
              {prop: 'workinjuryShouldsendFilloutindividual', label: '应发(个人补退)', width: '200'},
              {prop: 'workinjuryAccountName', label: '工伤户头', width: '200'},
              {prop: 'workinjuryAccountCode', label: '工伤户头名称', width: '200'}
            ]
          },
          {
            label: '公积金',
            children: [
              {prop: 'providentfundWithholdingPersonalpayment', label: '代扣代缴(个人补缴)', width: '200'},
              {prop: 'providentfundCompanytopayCompanypayment', label: '代扣代缴(个人承担公司补缴)', width: '250'},
              {prop: 'providentfundCompanyreceivableCompanytofillout', label: '公司应收(公司补退)', width: '200'},
              {prop: 'providentfundShouldsendFilloutindividual', label: '应发(个人补退)', width: '200'},
              {prop: 'providentfundAccountName', label: '公积金户头', width: '200'},
              {prop: 'providentfundAccountCode', label: '公积金户头名称', width: '200'}
            ]
          },
          {
            label: '补充大病医疗保险',
            children: [
              {prop: 'supplementarymedicaltreatmentWithholdingPersonalpayment', label: '代扣代缴(个人承担)', width: '200'},
              {prop: 'supplementarymedicaltreatmentCompanytopayCompanytoundertake', label: '公司缴纳(公司承担)', width: '200'},
              {prop: 'supplementarymedicaltreatmentAccountName', label: '补充大病医疗户头', width: '200'},
              {prop: 'supplementarymedicaltreatmentAccountCode', label: '补充大病医疗户头名称', width: '200'}
            ]
          },
          {
            label: '补充工伤保险',
            children: [
              {prop: 'supplementaryinjuryCompanytopayCompanypayment', label: '代扣代缴(公司补缴)', width: '200'},
              {prop: 'supplementaryinjuryCompanytopayCompanytoundertake', label: '公司缴纳(公司承担)', width: '200'},
              {prop: 'supplementaryinjuryAccountName', label: '补充工伤险户头', width: '200'},
              {prop: 'supplementaryinjuryAccountCode', label: '补充工伤险户头名称', width: '200'}
            ]
          }
        ],
        setting: {
          export: {
            config: {
              fileName: '其他参保表'
            },
            req: config.otherSecuritySearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insOtherExportPost'
          },
          toolbar: [
            {text: '新增', func: this.addRecord, key: 'insInsuredOthersPost'},
            {text: '删除', func: this.deleteRecord, key: 'insIinsuredOtherDelete'}
            // {text: '查看最新状态信息', func: this.showNewMsg},
            // {text: '查看所有状态信息', func: this.showAllMsg},
            // {text: '导入', func: this.leadRecord}
          ],
          operator: [
            {text: '修改', func: this.modificationRow, key: 'insInsuredOtheRecordIdPut'},
            {text: '删除', func: this.deleteRow, key: 'insIinsuredOtherDelete'}
          ],
          import: {
            business: 'iaf-otherInsuranceSuccessful',
            show: () => ({empty: false}),
            key: 'insExternalExternalPost'
          }
        },
        data: null,
        total: 0,
        info: null,
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
      this.searchData.payStartMonth && (this.searchData.payStartMonth = new Date(Date.parse(this.searchData.payStartMonth) + 3600 * 1000 * 8))
      this.searchData.payEndMonth && (this.searchData.payEndMonth = new Date(Date.parse(this.searchData.payEndMonth) + 3600 * 1000 * 8))
      req('otherSecuritySearch', Object.assign({}, options, this.searchData, {lastData: this.lastData}))
        .then(res => Object.assign(this.table, res))
        .catch(err => console.log(err))
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
        return {employeeId: item.employeeId, payMonth: item.payMonth}
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
      this.fetch(this.table.info)
    },
    // 新增按钮
    addRecord () {
      // 清空弹出框数据
      for (let key in this.dialogFormData) {
        this.dialogFormData[key] = ''
      }
      this.$refs.otherDialog.resetTableData()
      this.isAddOrEdit = 'add'
      this.showTitle = '新增记录'
      this.isDialogShow = true
    },
    dialogCancel () {
      this.isDialogShow = false
    },
    // dialog确定按钮
    dialogConfirm (data) {
      let submitData = Object.assign({}, this.dialogFormData)
      submitData.otherInsuranceList = data
      // 如果新增弹出框请求otherAdd接口
      if (this.isAddOrEdit === 'add') {
        req('otherAdd', submitData).then(data => {
          this.fetch(this.table.info)
          this.isDialogShow = false
        })
      // 如果修改弹出框请求otherUpdate接口
      } else if (this.isAddOrEdit === 'edit') {
        req('otherUpdate', submitData).then(data => {
          this.fetch(this.table.info)
          this.isDialogShow = false
        })
      }
    },

    // 删除按钮
    deleteRecord () {
      if (this.deleteArr.length) {
        this.$confirm('确定要删除记录吗？').then(() => {
          req('otherSecurityDelete', this.deleteArr).then(data => {
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
      req('otherGetDialogData', {otherRecordId: row.otherRecordId}).then(data => {
        this.dialogFormData = Object.assign({}, data, {otherRecordId: row.otherRecordId})
        this.dialogFormData.payMonth = new Date(this.dialogFormData.payMonth)
        this.$refs.otherDialog.handlerTableData(data.otherInsuranceList)
        this.isDialogShow = true
        this.showTitle = '修改记录'
      })
    },
    // 行操作删除
    deleteRow (row) {
      this.deleteArr = [{employeeId: row.employeeId, payMonth: row.payMonth}]
      this.$confirm('确定要删除记录吗？').then(() => {
        req('otherSecurityDelete', this.deleteArr).then(data => {
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
