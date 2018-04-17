<template>
  <div>
    <i-layout
      :borderWidth="0"
      :margin="0"
      header-key="insInsuredInsuranceGet"
      :headerPadding="0"
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
        <el-form-item label="保险类别">
          <i-select clearable v-model="searchData.insuranceType" parameter="INSURANCE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker 
            type="date" 
            v-model="searchData.effectiveStartDate" 
            :editable="false"
            :picker-options="effectiveStartDateOptions"
            @change="handleDateChange(searchData.effectiveStartDate, 'searchData', 'effectiveStartDate', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="生效结束日期">
          <el-date-picker 
            type="date" 
            v-model="searchData.effectiveEndDate" 
            :editable="false"
            :picker-options="effectiveEndDateOptions"
            @change="handleDateChange(searchData.effectiveEndDate, 'searchData', 'effectiveEndDate', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="失效开始日期">
          <el-date-picker 
            type="date" 
            v-model="searchData.uneffectiveStartDate" 
            :editable="false"
            :picker-options="uneffectiveStartDateOptions"
            @change="handleDateChange(searchData.uneffectiveStartDate, 'searchData', 'uneffectiveStartDate', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker 
            type="date" 
            v-model="searchData.uneffectiveEndDate" 
            :editable="false"
            :picker-options="uneffectiveEndDateOptions"
            @change="handleDateChange(searchData.uneffectiveEndDate, 'searchData', 'uneffectiveEndDate', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="户头代码">
          <el-input v-model="searchData.accountCode"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <i-select clearable v-model="searchData.paymentMethods" parameter="IAF_PAYMENT_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="社保状态">
          <i-select clearable v-model="searchData.insuranceStatus" parameter="IAF_INSURANCE_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="参保状态">
          <i-select clearable v-model="searchData.insuredStatus" parameter="IAF_INSURED_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="不参保类型">
          <i-select clearable v-model="searchData.notInsuredType" parameter="NO_INSURED_TYPE"></i-select>
        </el-form-item>
      </iaf-search>
      <div slot="section" class="mt15">
        <i-table
          :table="table"
          ref="table"
          @pageSizeChange="searchHandleSizeChange"
          @pageIndexChange="searchHandleCurrentChange"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table
              border
              @selection-change="deleteRow"
              :data="tableScope.clone"
              :stripe="$$.table.stripe"
              v-loading="tableLoading"
              :element-loading-text="$loadingText"
            >
              <el-table-column type="selection" :fixed="true">
              </el-table-column>
              <el-table-column min-width="100" align="center"  prop="employeeCode" label="工号"></el-table-column>
              <el-table-column min-width="100" align="center" prop="fullName" label="姓名"></el-table-column>
              <el-table-column
                v-for="(item,index) in table.columns"
                v-if="item.show"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                align="center"
                :sortable="item.sort"
                :formatter="tableScope.formatter"
              >
              </el-table-column>
            </el-table>
          </template>
        </i-table>
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
import Screen from 'components/iaf/fund/screen'
import ILayout from 'components/common/i-layout'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
export default {
  components: {
    IafSearch,
    ISelect,
    ITable,
    Screen,
    ILayout
  },
  mixins: [IafSearchMixin],
  data () {
    return {
      deleteArr: [],
      newSearchData: {},
      tableLoading: true,
      visible: false,
      lastData: false,
      loading: true,
      // effectiveDate: '',
      // uneffectiveDate: '',
      searchData: {
        // positionName: '',
        // seniority: '',
        // age: '',
        domicileType: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        uneffectiveStartDate: '',
        uneffectiveEndDate: '',
        insuranceType: '',
        accountCode: '',
        insuranceStatus: '',
        insuredStatus: '',
        notInsuredType: ''
      },
      table: {
        columns: [
          {prop: 'orgUnitName', label: '组织', show: true, sort: false, width: '150'},
          {prop: 'personnelGroupName', label: '人事范围', show: true, sort: false, width: '150'},
          {prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'}},
          {prop: 'positionName', label: '职位', show: true, width: '200'},
          {prop: 'hireDate', label: '入职日期', show: true, width: '150', display: { date: 'default' }},
          {prop: 'seniority', label: '司龄(月)', show: true, width: '100'},
          {prop: 'idNumber', label: '身份证号码', show: true, width: '200'},
          {prop: 'gender', label: '性别', show: true, width: '100', display: {dict: 'GENDER'}},
          {prop: 'age', label: '年龄', show: true, width: '100'},
          {prop: 'domicileType', label: '员工户口性质', show: true, width: '100', display: {dict: 'DOMICILE_TYPE'}},
          {prop: 'domicileGrade', label: '员工户口级别', show: true, width: '100', display: {dict: 'DOMICILE_LEVE'}},
          {prop: 'householdCode', label: '户头户口性质', show: true, width: '100', display: {dict: 'IAF_ACCOUNT_TYPE'}},
          {prop: 'empInsuredAccount', label: '保险个人号码', show: true, width: '150'},
          {prop: 'insuranceType', label: '保险类别', show: true, width: '100', display: { dict: 'INSURANCE_TYPE' }},
          {prop: 'accountCode', label: '户头代码', show: true, width: '200'},
          {prop: 'accountName', label: '户头名称', show: true, width: '150'},
          {prop: 'effectiveDate', label: '生效日期', show: true, width: '150', display: { date: 'default' }},
          {prop: 'uneffectiveDate', label: '失效日期', show: true, width: '150', display: { date: 'default' }},
          {prop: 'insuranceStatus', label: '社保状态', show: true, width: '100', display: {dict: 'IAF_INSURANCE_STATUS'}},
          {prop: 'insuredStatus', label: '参保状态', show: true, width: '100', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'notInsuredType', label: '不参保类型', show: true, width: '150', display: {dict: 'NO_INSURED_TYPE'}},
          {prop: 'paymentMethods', label: '支付方式', show: true, width: '150', display: {dict: 'IAF_PAYMENT_TYPE'}},
          {prop: 'empPayBase', label: '个人缴纳基数', show: true, width: '150'},
          {prop: 'compPayBase', label: '单位缴纳基数', show: true, width: '150'},
          {prop: 'empPayRatio', label: '个人缴纳比例(%)', show: true, width: '150'},
          {prop: 'compPayRatio', label: '单位缴纳比例(%)', show: true, width: '150'},
          {prop: 'lastUpdateBy', label: '操作者', show: true, width: '100'},
          {prop: 'lastUpdateDate', label: '操作时间', show: true, width: '150', display: { date: 'default' }}
        ],
        setting: {
          // toolbar: [
          //   {text: '发送增员申请通知', func: this.searchSndAddInfo, key: 'insSendNotificationPost'}
          //   // {text: '查看最新状态信息', func: this.showNewMsg},
          //   // {text: '查看所有状态信息', func: this.showAllMsg},
          //   // {text: '筛选', fun, type: 'error', func: this.openEmpPay}
          // ],
          export: {
            config: {
              fileName: '社保参保查询表',
              sync: {
                all: false
              }
            },
            req: config.socialSecurityInsurance,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredInsuranceExportGet'
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
  watch: {

  },
  created () {
    this.lastData = false
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('socialSecurityInsurance', Object.assign({}, options, this.newSearchData,
              {lastData: this.lastData}
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
      this.$refs.searchForm.initLayout()
    },
    // 查看最新
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
    },
    // 查看所有
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    search (searchData) {
      this.newSearchData = searchData
      this.table.search = Object.assign({}, searchData, {lastData: this.lastData})
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.searchForm.resetForm()
      this.effectiveDate = ''
      this.uneffectiveDate = ''
      this.lastData = false
    },
    // 每页大小改变
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    // 页码改变
    searchHandleCurrentChange (options) {
      this.fetch(options)
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
