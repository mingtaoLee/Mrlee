<template>
  <div>
    <i-layout
      :borderWidth="0"
      :margin="0"
      :headerPadding="0"
      header-key="insInsuredInsuranceIncreaseGet"
      :sectionPadding="0"
      v-loading="loading"
      :element-loading-text="$loadingText"
    >
      <iaf-search 
        slot="header" 
        ref="searchForm" 
        :additions="searchData" 
        :isShowItem="false"
        @search="search" 
        @resetInputs="resetInputs" 
        @checckStatus= "checkStatusList"
      >
        <!-- <el-form-item label="职位">
          <el-input v-model="searchData.positionName"></el-input>
        </el-form-item>
        <el-form-item label="司龄(月)">
          <el-input v-model="searchData.seniority"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="searchData.age"></el-input>
        </el-form-item> -->
        <el-form-item label="员工户口性质:">
          <i-select clearable v-model="searchData.domicileType" parameter="DOMICILE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="保险类型">
          <i-select v-model="searchData.insuranceType" parameter="INSURANCE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="户头代码">
          <el-input v-model="searchData.accountCode"></el-input>
        </el-form-item>
        <el-form-item label="缴纳地域">
          <i-select-area  v-model="searchData.applyArea" ref="selectArea"></i-select-area>
        </el-form-item>
        <el-form-item label="原因">
          <i-select v-model="searchData.applyReason" parameter="IAF_ADD_REASON"></i-select>
        </el-form-item>
      </iaf-search>
    <div slot="section" class="mt15">
      <i-table
        @pageSizeChange="searchHandleSizeChange"
        @pageIndexChange="searchHandleCurrentChange"
        :table="table"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :border="$$.table.border"
            :stripe="$$.table.stripe"
            :data="tableScope.clone"
            @selection-change="deleteRow"
            v-loading="tableLoading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column min-width="100" align="center" prop="employeeCode" :sortable="false" label="工号"></el-table-column>
            <el-table-column min-width="100" align="center" prop="fullName" label="姓名"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns || []"
              v-if="col.show"
              :key="idx"
              :prop="col.prop"
              :formatter="tableScope.formatter"
              :sortable="col.sort"
              align="center"
              :min-width="col.width"
              :label="col.label"
            ></el-table-column>
          </el-table>
        </template>
      </i-table>
      <el-dialog
        title="导入增员成功记录"
        @open="openDialog"
        @close="closeDialog"
        :visible.sync="showDialog">
          <uploader></uploader>
      </el-dialog>
      <screen v-model="visible" :columns="table.columns" @receiveColumns="receiveColumns">
        <template slot="checked">
          <el-checkbox checked disabled>工号</el-checkbox>
          <el-checkbox checked disabled>姓名</el-checkbox>
        </template>
      </screen>
    </div>
    </i-layout>
    </div>
</template>
<script>
import IafSearch from 'components/iaf/search/iaf-search'
import ITable from 'components/common/i-table'
import req, {config} from 'api/iaf/insurance-manage'
import ISelect from 'components/common/i-select/i-select.vue'
import Uploader from 'components/common/upload/uploader'
import Screen from 'components/iaf/fund/screen'
import ILayout from 'components/common/i-layout'
import ISelectArea from 'components/common/i-select-area'
// import {windowOpen} from 'utils'
export default {
  components: {
    IafSearch,
    ISelect,
    ITable,
    Uploader,
    Screen,
    ILayout,
    ISelectArea
  },
  data () {
    return {
      lastData: false,
      showDialog: false,
      visible: false,
      tableLoading: true,
      loading: true,
      newSearchData: {},
      deleteArr: [],
      searchData: {
        // positionName: '',
        // seniority: '',
        // age: '',
        domicileType: '',
        insuranceType: '',
        accountCode: '',
        applyArea: '',
        applyReason: ''
      },
      table: {
        title: '',
        columns: [
          // {prop: 'employeeCode', label: '工号', show: true},
          // {prop: 'fullName', label: '姓名', show: true},
          {prop: 'orgUnitName', label: '组织', show: true, sort: false, width: '150'},
          {prop: 'personnelGroupName', label: '人事范围', show: true, sort: false, width: '150'},
          {prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'}},
          {prop: 'positionName', label: '职位', show: true, width: '200'},
          {prop: 'hireDate', label: '入职日期', show: true, width: '150', display: { date: 'default' }},
          {prop: 'seniority', label: '司龄(月)', show: true, width: '100'},
          {prop: 'idNumber', label: '身份证', show: true, width: '200'},
          {prop: 'gender', label: '性别', show: true, width: '100', display: {dict: 'GENDER'}},
          {prop: 'age', label: '年龄', show: true, width: '100'},
          {prop: 'domicileType', label: '员工户口性质', show: true, width: '100', display: {dict: 'DOMICILE_TYPE'}},
          {prop: 'domicileGrade', label: '员工户口级别', show: true, width: '100', display: {dict: 'DOMICILE_LEVE'}},
          {prop: 'householdCode', label: '户头户口性质', show: true, width: '100', display: {dict: 'IAF_ACCOUNT_TYPE'}},
          {prop: 'empInsuredAccount', label: '保险个人号码', show: true, width: '150'},
          {prop: 'insuranceType', label: '保险类别', show: true, width: '100', display: { dict: 'INSURANCE_TYPE' }},
          {prop: 'accountCode', label: '户头代码', show: true, width: '200'},
          {prop: 'accountName', label: '户头名称', show: true, width: '150'},
          {prop: 'paymentMethods', label: '支付方式', show: true, width: '150', display: {dict: 'IAF_PAYMENT_TYPE'}},
          {prop: 'insuredStatus', label: '参保状态', show: true, width: '100', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'mobile', label: '联系电话', show: true, width: '150'},
          {prop: 'applyArea', label: '申请地域', show: true, width: '100'},
          {prop: 'applyReason', label: '原因', show: true, width: '100', display: {dict: 'IAF_ADD_REASON'}},
          {prop: 'remark', label: '备注提示', show: true, width: '100'},
          {prop: 'empPayBase', label: '社保个人缴纳基数', show: true, width: '200'},
          {prop: 'compPayBase', label: '社保公司缴纳基数', show: true, width: '200'},
          {prop: 'increaseDate', label: '申请时间', show: true, width: '200', display: { date: 'default' }},
          {prop: 'lastUpdateBy', label: '操作者', show: true, width: '100'},
          {prop: 'lastUpdateDate', label: '操作时间', show: true, width: '150', display: { date: 'default' }}
        ],
        setting: {
          toolbar: [
            // {text: '导入增员成功记录', func: this.searchExportInfo},
            // {text: '查看最新状态信息', func: this.showNewMsg},
            // {text: '查看所有状态信息', func: this.showAllMsg},
            // {text: '增员挂靠', func: () => { windowOpen('flow.html#/flow/iafAddMemberFlow?processType=iafAddMemberFlow') }},
            {text: '删除', func: this.deleteRows, type: 'danger', key: 'insInsuredInsuranceIncreaseDelete'}
          ],
          export: {
            config: {
              fileName: '社保增员表',
              sync: {
                all: false
              }
            },
            req: config.socialAddSuccessInsurance,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredInsuranceIncreaseExportGet'
          },
          import: [
            {
              text: '导入',
              business: 'iaf-IafAddCompleteImportDto',
              show: () => ({empty: false}),
              key: 'insInsuredInsuranceIncreaseImportPost'
            },
            {
              text: '调整基数',
              business: 'iaf-insuredAddSuccessAdjustEmpBase',
              show: () => ({empty: false}),
              key: 'insInsuredInsuranceIncreaseImportPost'
            }
          ]
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      }
    }
  },
  created () {
    this.lastData = false
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, increaseState: true})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('socialAddSuccessInsurance', Object.assign({}, options, this.newSearchData,
              {lastData: this.lastData, increaseState: true}
            )
         )
        .then(res => {
          Object.keys(res).map(key => (this.table[key] = res[key]))
          this.loading = false
          this.tableLoading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.tableLoading = false
        })
    },
    initLayout () {
      this.$refs.searchForm && this.$refs.searchForm.initLayout()
    },
    search (searchData) {
      this.newSearchData = Object.assign({}, searchData)
      this.table.search = Object.assign({}, searchData, {lastData: this.lastData, increaseState: true})
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    searchExportInfo () {
      this.showDialog = true
    },
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, increaseState: true})
    },
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, increaseState: true})
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.searchForm.resetForm()
      this.$refs.selectArea.deleteSelected()
      this.lastData = false
    },
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    searchHandleCurrentChange (options) {
      this.fetch(options)
    },
    deleteRows () {
      for (let key in this.searchData) {
        if (this.searchData[key]) {
          this.lastData = false
        }
      }
      if (this.deleteArr.length === 0) {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      } else {
        this.$confirm('确认删除？').then(() => {
          req('socialSecurityInsuranceIncreasedDelete', this.deleteArr).then(data => {
            if (data === true) {
              this.$message({
                type: 'info',
                message: '删除成功'
              })
              this.$refs.searchForm.search()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {})
      }
    },
    deleteRow (row) {
      this.deleteArr = row.map(item => {
        return item.insuredRecordId
      })
    },
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
.el-checkbox{
  width: 25%;
}
.el-checkbox+.el-checkbox{
  margin-left: 0px;
}
</style>
