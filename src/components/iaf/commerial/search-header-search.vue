<template>
  <div>
    <i-layout
      :borderWidth="0"
      :margin="0"
      :headerPadding="0"
      :sectionPadding="0"
      header-key="insInsuredCommercialGet"
      v-loading="loading"
      :element-loading-text="$loadingText"
    >
      <iaf-search
        @checckStatus= "checkStatusList"
        @search="search"
        @resetInputs="resetSearchData"
        ref="form"
        access-key="insInsuredCommercialGet"
        slot="header"
        :additions="searchData"
      >
        <!-- <el-form-item label="职位:">
          <el-input v-model="searchData.positionName"></el-input>
        </el-form-item>
        <el-form-item label="司龄(月):">
          <el-input v-model="searchData.seniority"></el-input>
        </el-form-item>
        <el-form-item label="年龄:">
          <el-input type="number" v-model="searchData.age"></el-input>
        </el-form-item> -->
        <el-form-item label="户口性质:">
          <i-select clearable v-model="searchData.domicileType" parameter="DOMICILE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="人员类型：">
          <i-select clearable v-model="searchData.employeeType" parameter="EMPLOYEE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="参保开始日期：">
          <el-date-picker 
          v-model="searchData.insuredStratDate"
          :picker-options="increaseStartDayOptions"
          @change="handleDateChange(searchData.insuredStratDate, 'searchData', 'insuredStratDate', 'string')" 
          type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="参保结束日期：">
          <el-date-picker 
          v-model="searchData.insuredEndDate"
          :picker-options="increaseEndDayOptions"
          @change="handleDateChange(searchData.insuredEndDate, 'searchData', 'insuredEndDate', 'string')" 
          type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="不参保类型：">
          <i-select clearable v-model="searchData.notInsuredType" parameter="NO_INSURED_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="变更类型：">
          <i-select clearable v-model="searchData.changingType" parameter="IAF_COMMERCIAL_CHANGING_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="工伤险参保状态：">
          <i-select clearable v-model="searchData.injuryInsuredStatus" parameter="IAF_INSURED_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="商业险参保状态：">
          <i-select clearable v-model="searchData.cmlInsuredStatus" parameter="IAF_INSURED_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="商业险保单号：">
          <el-input v-model="searchData.policyCode"></el-input>
        </el-form-item>
        <el-form-item label="保单生效日期起：">
          <el-date-picker 
          v-model="searchData.effectiveStartDate"
          :picker-options="checkStartDayOptions"
          @change="handleDateChange(searchData.effectiveStartDate, 'searchData', 'effectiveStartDate', 'string')" 
          type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="保单生效日期止：">
          <el-date-picker 
          v-model="searchData.effectiveEndDate"
          :picker-options="checkEndDayOptions"
          @change="handleDateChange(searchData.effectiveEndDate, 'searchData', 'effectiveEndDate', 'string')" 
          type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="保单失效日期起：">
          <el-date-picker 
          v-model="searchData.uneffectiveStartDate"
          :picker-options="checkOverStartDayOptions"
          @change="handleDateChange(searchData.uneffectiveStartDate, 'searchData', 'uneffectiveStartDate', 'string')" 
          type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="保单失效日期止：">
          <el-date-picker 
          v-model="searchData.uneffectiveEndDate"
          :picker-options="checkOverEndtDayOptions"
          @change="handleDateChange(searchData.uneffectiveEndDate, 'searchData', 'uneffectiveEndDate', 'string')" 
          type="date"></el-date-picker>
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
              :border="$$.table.border"
              :stripe="$$.table.stripe"
              :data="tableScope.clone"
              v-loading="tableLoading"
              :element-loading-text="$loadingText"
            >
              <el-table-column type="selection" :fixed="true"></el-table-column>
              <el-table-column min-width="100" align="center" prop="employeeCode" label="工号"></el-table-column>
              <el-table-column min-width="100" align="center" prop="fullName" label="姓名"></el-table-column>
              <el-table-column
                v-for="(item,index) in tableScope.columns"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                align="center"
                :min-width="item.width"
                :formatter="tableScope.formatter"
                v-if="item.show"
              ></el-table-column>
            </el-table>
          </template>
        </i-table>
        <screen v-model="visible" :columns="table.columns" @receiveColumns="receiveColumns"></screen>
      </div>
    </i-layout>
  </div>
</template>
<script>
import orgDialog from '@/mixins/orgDialog'
import ITable from 'components/common/i-table'
import ISelect from 'components/common/i-select/i-select.vue'
import IafSearch from 'components/iaf/search/iaf-search'
import screen from 'components/iaf/fund/screen'
import req, {config} from 'api/iaf/insurance-manage'
import ILayout from 'components/common/i-layout'
import access from 'mixins/access'
import moment from 'moment'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
export default {
  data () {
    return {
      visible: false,
      newSearchData: {},
      // cmlInsuredDate: '',
      lastData: false,
      loading: true,
      tableLoading: true,
      searchData: {
        // positionName: '',
        // seniority: '',
        insuredStratDate: '',
        insuredEndDate: '',
        employeeType: '',
        domicileType: '',
        // age: '',
        notInsuredType: '',
        changingType: '',
        injuryInsuredStatus: '',
        cmlInsuredStatus: '',
        numberOfPolicy: '',
        uneffectiveStartDate: '',
        uneffectiveEndDate: '',
        effectiveStartDate: '',
        effectiveEndDate: ''
      },
      // 查询列表
      table: {
        title: '',
        columns: [
          {prop: 'orgUnitName', label: '组织', show: true, width: '200'},
          {prop: 'personnelGroupName', label: '人事范围', show: true, width: '150'},
          {prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'}},
          {prop: 'positionName', label: '职位', show: true, width: '200'},
          {prop: 'hireDate', label: '入职日期', show: true, width: '150', display: {date: 'default'}},
          {prop: 'seniority', label: '司龄(月)', show: true, width: '100'},
          {prop: 'idNumber', label: '身份证号', show: true, width: '200'},
          {prop: 'gender', label: '性别', show: true, width: '100', display: {dict: 'GENDER'}},
          {prop: 'age', label: '年龄', show: true, width: '100'},
          {prop: 'domicileType', label: '户口性质', show: true, width: '100', display: {dict: 'DOMICILE_TYPE'}},
          {prop: 'employeeType', label: '人员类型', show: true, width: '100', display: {dict: 'EMPLOYEE_TYPE'}},
          {prop: 'accountName', label: '户头名称', show: true, width: '200'},
          {prop: 'insuranceCompanyName', label: '保险公司名称', show: true, width: '200'},
          {prop: 'cmlInsuredDate', label: '商业险参保日期', show: true, width: '150', display: {date: 'default'}},
          {prop: 'changingType', label: '变更类型', show: true, width: '100', display: {dict: 'IAF_COMMERCIAL_CHANGING_TYPE'}},
          {prop: 'changingReason', label: '变更原因', show: true, width: '100', display: {dict: 'IAF_REASONS_FOR_BUSINESS_RISK_CHANGE'}},
          {prop: 'injuryInsuredStatus', label: '工伤险参保状态', show: true, width: '150', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'notInsuredType', label: '不参保类型', show: true, width: '150', display: {dict: 'NO_INSURED_TYPE'}},
          {prop: 'policyCode', label: '商业险保单号', show: true, width: '150'},
          {prop: 'cmlInsuredStatus', label: '商业险参保状态', show: true, width: '150', display: {dict: 'IAF_INSURED_STATUS'}},
          // {prop: 'numberOfPolicy', label: '商业险保单号', show: true, width: '200'},
          {prop: 'effectiveDate', label: '保单生效日期', show: true, width: '150', display: {date: 'default'}},
          {prop: 'uneffectiveDate', label: '保单失效日期', show: true, width: '150', display: {date: 'default'}},
          {prop: 'selfInsuredDate', label: '人员生效时间', show: true, width: '150'},
          {prop: 'selfUninsuredDate', label: '人员失效时间', show: true, width: '150'},
          {prop: 'isOnRisk', label: '是否出险', show: true, width: '150', display: { dict: 'WHETHER_TYPE' }},
          {prop: 'reimbursementStatus', label: '报销状态', show: true, width: '150', display: {dict: 'IAF_EXPENSE_ACCOUNT_STATUS'}},
          {prop: 'policyMoney', label: '金额', show: true, width: '100'},
          {prop: 'userId', label: '操作者工号', show: true, width: '100'},
          {prop: 'lastUpdateBy', label: '操作者', show: true, width: '100'},
          {prop: 'lastUpdateDate', label: '操作时间', show: true, width: '150', display: {date: 'default'}}
        ],
        setting: {
          toolbar: [
            // {text: '发送增员申请通知', func: this.searchSndAddInfo, key: 'insInsuredCommercialNotificationPost'}
            // {text: '查看最新状态信息', func: this.showNewMsg},
            // {text: '查看所有状态信息', func: this.showAllMsg},
            // {text: '筛选', func: this.pick}
          ],
          export: {
            config: {
              fileName: '商业险参保查询表'
            },
            key: 'insInsuredCommercialExportGet',
            req: config.insuredSearch       // api 配置信息（参数名以自身业务为准）【必填】
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
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('insuredSearch', Object.assign({}, options, this.searchData,
              {lastData: this.lastData}
            )
         )
        .then(res => {
          res.data.forEach(dataVal => {
            if (dataVal.selfInsuredDate) {
              dataVal.selfInsuredDate = moment(dataVal.selfInsuredDate).format('YYYY-MM-DD') || ''
            }
            if (dataVal.selfUninsuredDate) {
              dataVal.selfUninsuredDate = moment(dataVal.selfUninsuredDate).format('YYYY-MM-DD') || ''
            }
          })
          Object.keys(res).map(key => (this.table[key] = res[key]))
          this.tableLoading = false
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.tableLoading = false
          this.loading = false
        })
    },
    // 每页显示的条数改变时
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    // 页数改变时
    searchHandleCurrentChange (options) {
      this.fetch(options)
    },
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: true})
    },
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: false})
    },
    eachForm () {
      for (var key in this.newSearchData) {
        if (this.newSearchData[key]) {
          this.lastData = false
        }
      }
    },
    FormatDate () {

    },
    search (commonSearchData) {
      this.searchData.hireStartDate && (this.searchData.hireStartDate = moment(this.searchData.hireStartDate).format('YYYY-MM-DD'))
      this.searchData.hireEndDate && (this.searchData.hireEndDate = moment(this.searchData.hireEndDate).format('YYYY-MM-DD'))
      this.searchData.insuredStratDate && (this.searchData.insuredStratDate = moment(this.searchData.insuredStratDate).format('YYYY-MM-DD'))
      this.searchData.insuredEndDate && (this.searchData.insuredEndDate = moment(this.searchData.insuredEndDate).format('YYYY-MM-DD'))
      this.searchData.uneffectiveStartDate && (this.searchData.uneffectiveStartDate = moment(this.searchData.uneffectiveStartDate).format('YYYY-MM-DD'))
      this.searchData.uneffectiveEndDate && (this.searchData.uneffectiveEndDate = moment(this.searchData.uneffectiveEndDate).format('YYYY-MM-DD'))
      this.searchData.effectiveStartDate && (this.searchData.effectiveStartDate = moment(this.searchData.effectiveStartDate).format('YYYY-MM-DD'))
      this.searchData.effectiveEndDate && (this.searchData.effectiveEndDate = moment(this.searchData.effectiveEndDate).format('YYYY-MM-DD'))
      this.table.search = Object.assign({}, this.searchData, commonSearchData, {lastData: this.lastData})
    },
    resetSearchData () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.cmlInsuredDate = ''
      this.$refs.form.resetForm()
      this.lastData = false
    },
    setTabsSearchForm () {
      this.$refs.form.initLayout()
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    pick () {
      this.visible = true
    },
    initLayout () {
      this.$refs.form.initLayout()
    },
    checkStatusList (val) {
      if (val === 'checkNewStatus') {
        this.showNewMsg()
      } else {
        this.showAllMsg()
      }
    }
  },
  components: {
    IafSearch,
    ITable,
    ISelect,
    screen,
    ILayout
  },
  mixins: [orgDialog, access, IafSearchMixin]
}
</script>
<style lang="scss" scoped>

</style>
