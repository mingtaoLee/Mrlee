<template>
  <i-layout 
    :headerPadding="0" 
    :borderWidth="0" 
    :margin="0"  
    :sectionPadding="0" 
    :titlePadding="3"
    v-loading="loading"
    :element-loading-text="$loadingText"
  >
    <template slot="header" header-key="insExternalAnchoredPost">
        <i-form @search="search(searchData)" @reset="reset" ref="form" @handleCollapse="handleCollapse">
          <el-form-item label="户头编码">
            <el-input v-model="searchData.accountCode"></el-input>
          </el-form-item>
          <el-form-item label="薪资组">
            <el-input v-model="searchData.groupName"></el-input>
          </el-form-item>
          <el-form-item label="公司代码">
            <el-input v-model="searchData.companyCode"></el-input>
          </el-form-item>
          <el-form-item label="缴纳月份起">
            <el-date-picker v-model="searchData.payStartDate" type="month" format="yyyy-MM"></el-date-picker>
          </el-form-item>
          <el-form-item label="缴纳月份止">
            <el-date-picker v-model="searchData.payEndDate" type="month" format="yyyy-MM"></el-date-picker>
          </el-form-item>
          <el-form-item label="险种(多选)">
            <i-select parameter="INSURANCE_TYPE" v-model="insuranceTypeList" :multiple="true"></i-select>
          </el-form-item>
        </i-form>
    </template>
    <div slot="section" class="mt15">
        <i-table
          @pageSizeChange="searchHandleSizeChange"
          @pageIndexChange="searchHandleCurrentChange"
          :table="table"
          ref="table"
        >
            <template slot="table" slot-scope="tableScope">
              <el-table
                @selection-change="deleteRow"
                border
                :data="tableScope.clone"
                :stripe="$$.table.stripe"
                v-loading="tableLoading"
                :element-loading-text="$loadingText"
              >
                <el-table-column type="selection" :fixed="true"></el-table-column>
                <el-table-column
                  v-for="(item,index) in table.columns"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  align="center"
                  :sortable="item.sort"
                  :formatter="tableScope.formatter"
                >
                  <el-table-column
                    v-for="(col, idx) in item.children"
                    v-if="item.children"
                    :key="idx"
                    align="center"
                    :prop="col.prop"
                    :width="col.width"
                    :label="col.label"
                  ></el-table-column>
                </el-table-column>
              </el-table>
            </template>
        </i-table>
      </div>
  </i-layout>
</template>
<script>
import IafSearch from 'components/iaf/search/iaf-search'
import ITable from 'components/common/i-table'
import req, {config} from 'api/iaf/insurance-manage'
import ISelect from 'components/common/i-select/i-select.vue'
import Screen from 'components/iaf/fund/screen'
import ILayout from 'components/common/i-layout'
import moment from 'moment'
export default {
  name: 'SummaryList',
  components: {
    IafSearch,
    ISelect,
    ITable,
    Screen,
    ILayout
  },
  data () {
    return {
      newSearchData: {},
      visible: false,
      lastData: true,
      tableLoading: true,
      loading: true,
      showInsuranceType: false,
      insuranceTypeList: [],
      searchData: {
        accountCode: '',
        groupName: '',
        companyCode: '',
        payStartDate: '',
        payEndDate: '',
        insuranceTypeListToString: ''
      },
      postData: {
        exportId: '',
        defaultCompanyName: '',
        payMonth: '',
        orgUnitName: '',
        costCenterName: '',
        profitCenterName: '',
        companyCode: '',
        defaultEndowmentAccountName: '',
        defaultEndowmentAccountCode: '',
        endowmentAccountName: '',
        endowmentAccountCode: '',
        endowmentCompPayValue: '',
        endowmentEmpPayValue: '',
        defaultUnemploymentAccountName: '',
        defaultUnemploymentAccountCode: '',
        unemploymentAccountName: '',
        unemploymentAccountCode: '',
        unemploymentCompPayValue: '',
        unemploymentEmpPayValue: '',
        defaultMedicareAccountName: '',
        defaultMedicareAccountCode: '',
        medicareAccountName: '',
        medicareAccountCode: '',
        medicareCompPayValue: '',
        medicareEmpPayValue: '',
        defaultEmploymentInjuryAccountName: '',
        defaultEmploymentInjuryAccountCode: '',
        employmentInjuryAccountName: '',
        employmentInjuryAccountCode: '',
        employmentInjuryCompPayValue: '',
        employmentInjuryEmpPayValue: '',
        defaultMaternityAccountName: '',
        defaultMaternityAccountCode: '',
        maternityAccountName: '',
        maternityAccountCode: '',
        maternityCompPayValue: '',
        maternityEmpPayValue: '',
        defaultHpfundAccountName: '',
        defaultHpfundAccountCode: '',
        hpfundAccountName: '',
        hpfundAccountCode: '',
        hpfundCompPayValue: '',
        hpfundEmpPayValue: '',
        local: '',
        localNumber: '',
        localCompPayValue: '',
        localEmpPayValue: '',
        affiliateNumber: '',
        affiliateCompPayValue: '',
        affiliateEmpPayValue: '',
        advanceNumber: '',
        advanceCompPayValue: '',
        advanceEmpPayValue: '',
        orderByProperty: '',
        orderStrategy: '',
        adminEmployeeId: this.$store.state.user.info.empEmployeeId || '8a8ea06a5faf744d015faf7dc1f90010'
      },
      table: {
        columns: [
          {prop: 'accountCode', label: '户头编码', show: true, sort: false, width: '150'},
          {prop: 'groupName', label: '薪资组', show: true, width: '100'},
          {prop: 'companyCode', label: '公司代码', show: true, width: '100'},
          {prop: 'payMonth', label: '缴费月份', show: true, width: '150', display: { date: 'default' }},
          {prop: 'insuranceType', label: '险种', show: true, width: '100', display: {dict: 'INSURANCE_TYPE'}},
          {
            prop: 'local',
            label: '正常本户头缴纳',
            show: true,
            children: [
              {prop: 'localNumber', label: '人数', width: '100'},
              {prop: 'localCompPayValue', label: '单位', width: '100'},
              {prop: 'localEmpPayValue', label: '个人', width: '100'}
            ]
          },
          {
            prop: 'affiliate',
            label: '异地参保费用',
            show: true,
            children: [
              {prop: 'affiliateNumber', label: '人数', width: '100'},
              {prop: 'affiliateCompPayValue', label: '单位', width: '100'},
              {prop: 'affiliateEmpPayValue', label: '个人', width: '100'}
            ]
          },
          {
            prop: 'advance',
            label: '代垫费用',
            show: true,
            children: [
              {prop: 'advanceNumber', label: '人数', width: '100'},
              {prop: 'advanceCompPayValue', label: '单位', width: '100'},
              {prop: 'advanceEmpPayValue', label: '个人', width: '100'}
            ]
          }
        ],
        setting: {
          export: {
            config: {
              fileName: '异地参保汇总表'
            },
            text: '导出汇总表',
            req: config.remoteInsuranceSummary,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insExternalNonlocalStatisticsPost'
          }
        },
        data: null,
        info: null,
        search: null,
        total: 0,
        showPagebar: true
      }
    }
  },
  created () {
    this.lastData = false
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {adminEmployeeId: this.postData.adminEmployeeId}, {lastData: this.lastData})
  },
  watch: {
    insuranceTypeList (val) {
      this.searchData.insuranceTypeListToString = val.join(',')
    }
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      this.searchData.payStartDate && (this.searchData.payStartDate = new Date(Date.parse(this.searchData.payStartDate) + 3600 * 1000 * 8))
      this.searchData.payEndDate && (this.searchData.payEndDate = new Date(Date.parse(this.searchData.payEndDate) + 3600 * 1000 * 8))
      req('remoteInsuranceSummary', Object.assign({}, this.table.info, options, this.searchData, this.tabsNames,
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
      this.$refs.form.initLayout()
    },
    pick () {
      this.visible = true
    },
    eachForm () {
      for (var key in this.newSearchData) {
        if (this.newSearchData[key]) {
          this.lastData = false
        }
      }
    },
    search (searchData) {
      this.searchData.payEndDate && (this.searchData.payEndDate = moment(this.searchData.payEndDate).format('YYYY-MM-DD'))
      this.searchData.payStartDate && (this.searchData.payStartDate = moment(this.searchData.payStartDate).format('YYYY-MM-DD'))
      this.table.search = Object.assign({}, this.searchData, {adminEmployeeId: this.postData.adminEmployeeId})
    },
    reset () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.insuranceTypeList = []
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
    }
  }
}
</script>
<style lang="scss" scoped>
.flex{
  padding: 10px 0;
  margin-left: 12px;
  font-size: 12px;
  color: #333;
  .el-checkbox-group{
    margin-left: 12px;
  }
  .el-col-2{
    text-align: center;
  }
}
.el-checkbox{
  margin-left: -16px;
  width: 10%;
  /deep/ .el-checkbox__label{
    font-size: 12px;
    color: #333;
  }
}
.el-checkbox+.el-checkbox{
  margin-left:0;
}
</style>
