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
    <template slot="header" header-key="insExternalBehalfPost">
        <i-form @search="search(searchData)" @reset="reset" ref="form" @handleCollapse="handleCollapse">
          <el-form-item label="工号">
            <el-input v-model="searchData.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchData.fullName"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="searchData.idNumber"></el-input>
          </el-form-item>
          <el-form-item label="险种(多选)">
            <i-select parameter="INSURANCE_TYPE" v-model="insuranceTypeList" :multiple="true"></i-select>
          </el-form-item>
          <el-form-item label="人事范围">
            <el-input v-model="searchData.personnelGroupName"></el-input>
          </el-form-item>
          <el-form-item label="薪资组">
            <el-input v-model="searchData.groupName"></el-input>
          </el-form-item>
          <el-form-item label="实参户头">
            <el-input v-model="searchData.accountName"></el-input>
          </el-form-item>
          <el-form-item label="应参户头">
            <el-input v-model="searchData.defaultAccountName"></el-input>
          </el-form-item>
          <el-form-item label="公司代码">
            <el-input v-model="searchData.personnelGroupName"></el-input>
          </el-form-item>
          <el-form-item label="缴纳月份起">
            <el-date-picker v-model="searchData.payStartDate" type="month" format="yyyy-MM"></el-date-picker>
          </el-form-item>
          <el-form-item label="缴纳月份止">
            <el-date-picker v-model="searchData.payEndDate" type="month" format="yyyy-MM"></el-date-picker>
          </el-form-item>
        </i-form>
    </template>
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
                    v-if="item.children"
                    v-for="(col, idx) in item.children"
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
export default {
  name: 'InsuranceAdvance',
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
      tableLoading: true,
      lastData: false,
      tabsNames: {
        affiliate: false,
        advance: true
      },
      insuranceTypeList: [],
      showInsuranceType: false,
      loading: true,
      searchData: {
        employeeCode: '',
        fullName: '',
        idNumber: '',
        personnelGroupName: '',
        payStartDate: '',
        insuranceTypeListToString: '',
        payEndDate: ''
      },
      postData: {
        exportId: '',
        payMonth: '',
        groupName: '',
        insuranceType: '',
        defaultCompanyName: '',
        defaultCompanyCode: '',
        orgUnitName: '',
        costCenterName: '',
        profitCenterName: '',
        defaultAccountName: '',
        defaultAccountCode: '',
        accountName: '',
        accountCode: '',
        compPayValue: '',
        empPayValue: '',
        local: false,
        orderByProperty: '',
        orderStrategy: '',
        adminEmployeeId: this.$store.state.user.info.empEmployeeId || '8a8ea06a5faf744d015faf7dc1f90010'
      },
      table: {
        columns: [
          {prop: 'insuranceType', label: '险种', show: true, width: '100', display: {dict: 'INSURANCE_TYPE'}},
          {prop: 'employeeCode', label: '工号', show: true, width: '100'},
          {prop: 'fullName', label: '员工姓名', show: true, width: '100'},
          {prop: 'idNumber', label: '身份证号', show: true, width: '100'},
          {prop: 'accountName', label: '实参户头', show: true, width: '150'},
          {prop: 'accountCode', label: '实参户头代码', show: true, width: '150'},
          {prop: 'payMonth', label: '缴费月份', show: true, width: '150', display: { date: 'default' }},
          {prop: 'compPayValue', label: '单位费用', show: true, width: '100'},
          {prop: 'empPayValue', label: '个人费用', show: true, width: '100'},
          {prop: 'compSupplyPayValue', label: '单位补缴', show: true, width: '150'},
          {prop: 'empSupplyPayValue', label: '个人补缴', show: true, width: '150'},
          {prop: 'compPenalty', label: '单位滞纳金', show: true, width: '150'},
          {prop: 'selfPenalty', label: '个人滞纳金', show: true, width: '150'},
          {prop: 'compSummery', label: '单位合计', show: true, width: '150'},
          {prop: 'selfSummery', label: '个人合计', show: true, width: '100'},
          {prop: 'personnelGroupName', label: '对应人事范围', show: true, width: '150'},
          {prop: 'companyCode', label: '对应公司代码', show: true, width: '150'},
          {prop: 'groupName', label: '薪资组', show: true, width: '100'},
          {prop: 'defaultAccountName', label: '应参户头', show: true, width: '150'},
          {prop: 'defaultAccountCode', label: '应参户头代码', show: true, width: '150'}
        ],
        setting: {
          export: {
            config: {
              fileName: '社保代垫明细表'
            },
            text: '导出代垫明细表',
            req: config.advanceInsurance,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insPaddedDetailsExportPost'
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
  created () {
    this.lastData = false
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, this.tabsNames, {adminEmployeeId: this.postData.adminEmployeeId}, {lastData: this.lastData})
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
      req('advanceInsurance', Object.assign({}, options, this.searchData, this.tabsNames, {adminEmployeeId: this.postData.adminEmployeeId}, {lastData: this.lastData}))
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
    search () {
      this.table.search = Object.assign({}, this.searchData, this.tabsNames, {adminEmployeeId: this.postData.adminEmployeeId})
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
