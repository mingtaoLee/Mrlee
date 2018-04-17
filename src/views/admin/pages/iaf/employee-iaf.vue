<template>
  <i-layout header-key="insInformationEnquiryGet">
    <i-form slot="header" @reset="resetInputs" @search="search">
      <el-form-item label="工号">
        <el-input v-model="searchData.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchData.fullName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="社保号">
        <el-input v-model="searchData.securityNumber"></el-input>
      </el-form-item> -->
      <el-form-item label="组织代码">
        <el-input v-model="searchData.orgUnitCode"></el-input>
      </el-form-item>
      <el-form-item label="组织名称">
        <el-input v-model="searchData.orgUnitName"></el-input>
      </el-form-item>
      <el-form-item label="人事范围">
        <el-input v-model="searchData.personnelGroupName"></el-input>
      </el-form-item>
      <el-form-item label="入职起始日期">
        <el-date-picker 
          type="date" 
          v-model="searchData.hireStartDate" 
          :editable="false"
          :picker-options="hireStartDateTwoOptions"
          @change="handleDateChange(searchData.hireStartDate, 'searchData', 'hireStartDate', 'string')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="入职终止日期">
        <el-date-picker 
          type="date" 
          v-model="searchData.hireEndDate" 
          :editable="false"
          :picker-options="hireEndDateTwoOptions"
          @change="handleDateChange(searchData.hireEndDate, 'searchData', 'hireEndDate', 'string')"
        ></el-date-picker>
      </el-form-item>
    </i-form>
    <div slot="section">
      <i-table
        @pageSizeChange="searchHandleSizeChange"
        @pageIndexChange="searchHandleCurrentChange"
        :table="table"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            v-loading="loading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <!-- <el-table-column
              v-for="(col, key) in tableScope.columns"
              :prop="col.prop"
              :width="col.width"
              align="center"
              :label="col.label"
              :formatter="tableScope.formatter"
              :key="key"
            >
              <el-table-column
                v-for="(item, index) in col.children"
                :prop="item.prop"
                :width="item.width"
                align="center"
                :label="item.label"
                :formatter="tableScope.formatter"
                :key="index"
              ></el-table-column>
            </el-table-column> -->
            <el-table-column
              label="工号"
              prop="employeeCode"
              :formatter="tableScope.formatter"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              label="姓名"
              prop="fullName"
              sortable
              :formatter="tableScope.formatter"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              label="组织代码"
              prop="orgUnitCode"
              sortable
              :formatter="tableScope.formatter"
              width="200"
              align="center"
            ></el-table-column>
            <el-table-column
              label="组织名称"
              prop="orgUnitName"
              sortable
              :formatter="tableScope.formatter"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              label="人事范围"
              prop="personnelGroupName"
              sortable
              :formatter="tableScope.formatter"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              label="入职日期"
              prop="hireDate"
                
              :formatter="tableScope.formatter"
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column label="养老保险" prop="endowment">
              <el-table-column
                label="户头代码"
                width="100"
                align="center"
                prop="endowmentAccountCode"
              ></el-table-column>
              <el-table-column
                label="户头名称"
                width="100"
                align="center"
                prop="endowmentAccountName"
              ></el-table-column>
              <el-table-column
                label="个人账号"
                width="100"
                align="center"
                prop="endowmentPriAccount"
              ></el-table-column>
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="endowmentInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="个人基数"
                width="100"
                align="center"
                prop="endowmentEmpPayBase"
              ></el-table-column>
              <el-table-column
                label="单位基数"
                width="100"
                align="center"
                prop="endowmentCompPayBase"
              ></el-table-column>
              <el-table-column
                label="个人比例(%)"
                width="100"
                align="center"
                prop="endowmentEmpPayRatio"
              ></el-table-column>
              <el-table-column
                label="单位比例(%)"
                width="100"
                align="center"
                prop="endowmentCompPayRatio"
              ></el-table-column>
              <el-table-column
                label="生效时间"
                width="150"
                align="center"
                prop="endowmentEffectiveDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="医疗保险" prop="medicare" align="center">
              <el-table-column
                label="户头代码"
                width="100"
                align="center"
                prop="medicareAccountCode"
              ></el-table-column>
              <el-table-column
                label="户头名称"
                width="100"
                align="center"
                prop="medicareAccountName"
              ></el-table-column>
              <el-table-column
                label="个人账号"
                width="100"
                align="center"
                prop="medicarePriAccount"
              ></el-table-column>
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="medicareInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="个人基数"
                width="100"
                align="center"
                prop="medicareEmpPayBase"
              ></el-table-column>
              <el-table-column
                label="单位基数"
                width="100"
                align="center"
                prop="medicareCompPayBase"
              ></el-table-column>
              <el-table-column
                label="个人比例(%)"
                width="100"
                align="center"
                prop="medicareEmpPayRatio"
              ></el-table-column>
              <el-table-column
                label="单位比例(%)"
                width="100"
                align="center"
                prop="medicareCompPayRatio"
              ></el-table-column>
              <el-table-column
                label="生效时间"
                width="100"
                align="center"
                prop="medicareEffectiveDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="失业保险" prop="unemployee" align="center">
              <el-table-column
                label="户头代码"
                width="100"
                align="center"
                prop="unemployeeAccountCode"
              ></el-table-column>
              <el-table-column
                label="户头名称"
                width="100"
                align="center"
                prop="unemployeeAccountName"
              ></el-table-column>
              <el-table-column
                label="个人账号"
                width="100"
                align="center"
                prop="unemployeePriAccount"
              ></el-table-column>
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="unemployeeInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="个人基数"
                width="100"
                align="center"
                prop="unemployeeEmpPayBase"
              ></el-table-column>
              <el-table-column
                label="单位基数"
                width="100"
                align="center"
                prop="unemployeeCompPayBase"
              ></el-table-column>
              <el-table-column
                label="个人比例(%)"
                width="100"
                align="center"
                prop="unemployeeEmpPayRatio"
              ></el-table-column>
              <el-table-column
                label="单位比例(%)"
                width="100"
                align="center"
                prop="unemployeeCompPayRatio"
              ></el-table-column>
              <el-table-column
                label="生效时间"
                width="100"
                align="center"
                prop="unemployeeEffectiveDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="工伤保险" prop="employeeInjury" align="center">
              <el-table-column
                label="户头代码"
                width="100"
                align="center"
                prop="employeeInjuryAccountCode"
              ></el-table-column>
              <el-table-column
                label="户头名称"
                width="100"
                align="center"
                prop="employeeInjuryAccountName"
              ></el-table-column>
              <el-table-column
                label="个人账号"
                width="100"
                align="center"
                prop="employeeInjuryPriAccount"
              ></el-table-column>
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="employeeInjuryInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="个人基数"
                width="100"
                align="center"
                prop="employeeInjuryEmpPayBase"
              ></el-table-column>
              <el-table-column
                label="单位基数"
                width="100"
                align="center"
                prop="employeeInjuryCompPayBase"
              ></el-table-column>
              <el-table-column
                label="个人比例(%)"
                width="100"
                align="center"
                prop="employeeInjuryEmpPayRatio"
              ></el-table-column>
              <el-table-column
                label="单位比例(%)"
                width="100"
                align="center"
                prop="employeeInjuryCompPayRatio"
              ></el-table-column>
              <el-table-column
                label="生效时间"
                width="100"
                align="center"
                prop="employeeInjuryEffectiveDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="生育保险" prop="maternity" align="center">
              <el-table-column
                label="户头代码"
                width="100"
                align="center"
                prop="maternityAccountCode"
              ></el-table-column>
              <el-table-column
                label="户头名称"
                width="100"
                align="center"
                prop="maternityAccountName"
              ></el-table-column>
              <el-table-column
                label="个人账号"
                width="100"
                align="center"
                prop="maternityPriAccount"
              ></el-table-column>
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="maternityInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="个人基数"
                width="100"
                align="center"
                prop="maternityEmpPayBase"
              ></el-table-column>
              <el-table-column
                label="单位基数"
                width="100"
                align="center"
                prop="maternityCompPayBase"
              ></el-table-column>
              <el-table-column
                label="个人比例(%)"
                width="100"
                align="center"
                prop="maternityEmpPayRatio"
              ></el-table-column>
              <el-table-column
                label="单位比例(%)"
                width="100"
                align="center"
                prop="maternityCompPayRatio"
              ></el-table-column>
              <el-table-column
                label="生效时间"
                width="100"
                align="center"
                prop="maternityEffectiveDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="公积金" prop="hpfund" align="center">
              <el-table-column
                label="户头代码"
                width="100"
                align="center"
                prop="hpfundAccountCode"
              ></el-table-column>
              <el-table-column
                label="户头名称"
                width="100"
                align="center"
                prop="hpfundAccountName"
              ></el-table-column>
              <el-table-column
                label="个人账号"
                width="100"
                align="center"
                prop="hpfundPriAccount"
              ></el-table-column>
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="hpfundInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="个人基数"
                width="100"
                align="center"
                prop="hpfundEmpPayBase"
              ></el-table-column>
              <el-table-column
                label="单位基数"
                width="100"
                align="center"
                prop="hpfundCompPayBase"
              ></el-table-column>
              <el-table-column
                label="个人比例(%)"
                width="100"
                align="center"
                prop="hpfundEmpPayRatio"
              ></el-table-column>
              <el-table-column
                label="单位比例(%)"
                width="100"
                align="center"
                prop="hpfundCompPayRatio"
              ></el-table-column>
              <el-table-column
                label="生效时间"
                width="100"
                align="center"
                prop="hpfundEffectiveDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="补充工伤" prop="supplyEmployeeInjury" align="center">
              <el-table-column
                label="户头代码"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryAccountCode"
              ></el-table-column>
              <el-table-column
                label="户头名称"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryAccountName"
              ></el-table-column>
              <el-table-column
                label="个人账号"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryPriAccount"
              ></el-table-column>
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="个人基数"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryEmpPayBase"
              ></el-table-column>
              <el-table-column
                label="单位基数"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryCompPayBase"
              ></el-table-column>
              <el-table-column
                label="个人比例(%)"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryEmpPayRatio"
              ></el-table-column>
              <el-table-column
                label="单位比例(%)"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryCompPayRatio"
              ></el-table-column>
              <el-table-column
                label="生效时间"
                width="100"
                align="center"
                prop="supplyEmployeeInjuryEffectiveDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="大病补医保" prop="supplyMedicare" align="center">
              <el-table-column
                label="户头代码"
                width="100"
                align="center"
                prop="supplyMedicareAccountCode"
              ></el-table-column>
              <el-table-column
                label="户头名称"
                width="100"
                align="center"
                prop="supplyMedicareAccountName"
              ></el-table-column>
              <el-table-column
                label="个人账号"
                width="100"
                align="center"
                prop="supplyMedicarePriAccount"
              ></el-table-column>
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="supplyMedicareInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="个人基数"
                width="100"
                align="center"
                prop="supplyMedicareEmpPayBase"
              ></el-table-column>
              <el-table-column
                label="单位基数"
                width="100"
                align="center"
                prop="supplyMedicareCompPayBase"
              ></el-table-column>
              <el-table-column
                label="个人比例(%)"
                width="100"
                align="center"
                prop="supplyMedicareEmpPayRatio"
              ></el-table-column>
              <el-table-column
                label="单位比例(%)"
                width="100"
                align="center"
                prop="supplyMedicareCompPayRatio"
              ></el-table-column>
              <el-table-column
                label="生效时间"
                width="150"
                align="center"
                prop="supplyMedicareEffectiveDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="商业险" prop="cmlInsured" align="center">
              <el-table-column
                label="参保状态"
                width="100"
                align="center"
                prop="cmlInsuredStatus"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="保单号"
                width="100"
                align="center"
                prop="policyCode"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="人员生效时间"
                width="100"
                align="center"
                prop="selfInsuredDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="人员失效时间"
                width="100"
                align="center"
                prop="selfUninsuredDate"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <el-table-column
                label="金额"
                width="100"
                align="center"
                prop="policyMoney"
              ></el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </div>
  </i-layout>
</template>

<script>
import IForm from 'components/common/i-form/i-form'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import req, {config} from 'api/iaf/external-data'
import ILayout from 'components/common/i-layout'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
// import moment from 'moment'

export default {
  name: 'EmployeeIaf',
  components: {
    IForm,
    ISelect,
    ITable,
    ILayout
  },
  mixins: [IafSearchMixin],
  data () {
    return {
      loading: false,
      lastData: true, // 是否最新数据
      searchData: {
        employeeCode: '',
        hireStartDate: '',
        hireEndDate: '',
        fullName: '',
        // securityNumber: '',
        orgUnitCode: '',
        orgUnitName: '',
        personnelGroupName: ''
      },
      table: {
        multiple: true,
        columns: [
          {prop: 'hireDate', display: {date: ''}},
          {prop: 'endowmentInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'endowmentEffectiveDate', display: {date: ''}},
          {prop: 'medicareInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'medicareEffectiveDate', display: {date: ''}},
          {prop: 'unemployeeInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'unemployeeEffectiveDate', display: {date: ''}},
          {prop: 'employeeInjuryInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'employeeInjuryEffectiveDate', display: {date: ''}},
          {prop: 'maternityInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'maternityEffectiveDate', display: {date: ''}},
          {prop: 'hpfundInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'hpfundEffectiveDate', display: {date: ''}},
          {prop: 'supplyEmployeeInjuryInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'supplyEmployeeInjuryEffectiveDate', display: {date: ''}},
          {prop: 'supplyMedicareInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'supplyMedicareEffectiveDate', display: {date: ''}},
          {prop: 'cmlInsuredStatus', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'selfInsuredDate', display: {date: ''}},
          {prop: 'selfUninsuredDate', display: {date: ''}}
        ],
        setting: {
          export: {
            config: {
              fileName: '员工保险信息查询表',
              sync: {
                all: false
              }
            },
            key: 'insInformationEnquiry',
            req: config.empInsuranceSearch        // api 配置信息（参数名以自身业务为准）【必填】
          }
        },
        info: null,
        data: [],
        total: 0,
        search: null,
        showPagebar: true
      }
    }
  },
  created () {
    this.getMultipleColumns()
    this.lastData = true
  },
  mounted () {
    this.loading = true
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
  },
  methods: {
    fetch (options = {}) {
      this.loading = true
      req('empInsuranceSearch', Object.assign({}, options, this.searchData,
            {lastData: this.lastData}
          )
        )
      .then(res => {
        this.getMultipleData(res.data)
        Object.assign(this.table, res)
        this.loading = false
      })
      .catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.lastData = true
    },
    search () {
      this.table.search = Object.assign({}, this.searchData)
    },
    // 页数大小改变
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    // 页码改变
    searchHandleCurrentChange (options) {
      this.fetch(options)
    }
  }
}
</script>
<style lang="scss" scoped>
.flex{
  display: flex;
  span{
    font-size: 14px;
    margin-right:10px;
  }
}
</style>
