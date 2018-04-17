<template>
  <div>
    <i-layout
      header-key="insInsuredInsuranceDecreaseGet"
      :borderWidth="0"
      :margin="0"
      :headerPadding="0"
      :sectionPadding="0"
      v-loading='loading'
    >
      <iaf-search 
        @search="search" 
        @resetInputs="resetInputs" 
        @checckStatus= "checkStatusList"
        slot="header"
        :isShowItem="false" 
        ref="searchForm" 
        :additions="searchData" 
      >
        <!-- <el-form-item label="工伤状态">
          <i-select v-model="searchData.industrialInjuryStatus" parameter="IAF_INJURY_STATUS"></i-select>
        </el-form-item> -->
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
        <el-form-item label="户头代码">
          <el-input v-model="searchData.accountCode"></el-input>
        </el-form-item>
        <el-form-item label="减员原因">
          <i-select v-model="searchData.applyReason" parameter="IAF_DEDUCE_REASON"></i-select>
        </el-form-item>
        <el-form-item label="离职开始时间">
          <el-date-picker 
            type="date" 
            v-model="searchData.dimissionStartTime" 
            :editable="false"
            :picker-options="dimissionStartTimeOptions"
            @change="handleDateChange(searchData.dimissionStartTime, 'searchData', 'dimissionStartTime', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="离职结束时间">
          <el-date-picker 
            type="date" 
            v-model="searchData.dimissionEndTime" 
            :editable="false"
            :picker-options="dimissionEndTimeOptions"
            @change="handleDateChange(searchData.dimissionEndTime, 'searchData', 'dimissionEndTime', 'string')"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="是否申领失业金">
          <i-select clearable v-model="searchData.isUnempBenefits" parameter="WHETHER_TYPE"></i-select>
        </el-form-item> -->
        <el-form-item label="减员开始时间">
          <el-date-picker 
            type="date" 
            v-model="searchData.attritionStartDate" 
            :editable="false"
            :picker-options="attritionStartDateOptions"
            @change="handleDateChange(searchData.attritionStartDate, 'searchData', 'attritionStartDate', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="减员结束时间">
          <el-date-picker 
            type="date" 
            v-model="searchData.attritionEndDate" 
            :editable="false"
            :picker-options="attritionEndDateOptions"
            @change="handleDateChange(searchData.attritionEndDate, 'searchData', 'attritionEndDate', 'string')"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="生育申报状态">
          <i-select clearable v-model="searchData.birthDeclarationStatus" parameter="IAF_BIRTH_STATUS"></i-select>
        </el-form-item> -->
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
              @selection-change="deleteRow"
              :border="$$.table.border"
              :stripe="$$.table.stripe"
              :data="tableScope.clone"
              v-loading="tableLoading"
              :element-loading-text="$loadingText"
            >
              <el-table-column type="selection" :fixed="true" ></el-table-column>
              <el-table-column
                v-for="(col, idx) of table.columns || []"
                v-if="col.show"
                :key="idx"
                :prop="col.prop"
                :formatter="tableScope.formatter"
                :sortable="col.sort"
                :min-width="col.width"
                :label="col.label"
                align="center"
              ></el-table-column>
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
// import {windowOpen} from 'utils'
export default {
  name: 'DeleteTabPage',
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
      // dimissionTime: '',
      // attritionDate: '',
      lastData: false,
      loading: true,
      visible: false,
      searchData: {
        // positionName: '',
        // seniority: '',
        // age: '',
        dimissionStartTime: '',
        dimissionEndTime: '',
        attritionStartDate: '',
        attritionEndDate: '',
        insuranceType: '',
        accountCode: '',
        domicileType: '',
        applyReason: ''
        // isUnempBenefits: '',
        // birthDeclarationStatus: '',
        // industrialInjuryStatus: ''
      },
      table: {
        title: '',
        columns: [
          {prop: 'employeeCode', label: '工号', show: true},
          {prop: 'fullName', label: '姓名', show: true},
          {prop: 'orgUnitName', label: '组织', show: true, sort: false, width: '150'},
          {prop: 'personnelGroupName', label: '人事范围', show: true, sort: false, width: '150'},
          {prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'}},
          {prop: 'positionName', label: '职位', show: true, width: '200'},
          {prop: 'hireDate', label: '入职日期', show: true, width: '150', display: {date: 'default'}},
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
          {prop: 'paymentMethods', label: '支付方式', show: true, width: '150', display: {dict: 'IAF_PAYMENT_TYPE'}},
          {prop: 'insuredStatus', label: '参保状态', show: true, width: '100', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'applyReason', label: '减员原因', show: true, width: '100', display: {dict: 'IAF_DEDUCE_REASON'}},
          {prop: 'dimissionTime', label: '离职时间', show: true, width: '100', display: {date: 'default'}},
          {prop: 'attritionDate', label: '减员时间', show: true, width: '150', display: {date: 'default'}},
          // {prop: 'isUnempBenefits', label: '是否申领失业金', show: true, width: '150', display: {dict: 'WHETHER_TYPE'}},
          // {prop: 'industrialInjuryStatus', label: '工伤状态', show: true, width: '100', display: {dict: 'IAF_INJURY_STATUS'}},
          // {prop: 'birthDeclarationStatus', label: '生育申报状态', show: true, width: '150', display: {dict: 'IAF_BIRTH_STATUS'}},
          {prop: 'remark', label: '备注提示', show: true, width: '100'},
          {prop: 'decreaseDate', label: '申请时间', show: true, width: '150', display: {date: 'default'}},
          {prop: 'lastUpdateBy', label: '操作者', show: true, width: '100'},
          {prop: 'lastUpdateDate', label: '操作时间', show: true, width: '150', display: { date: 'default' }}
        ],
        setting: {
          toolbar: [
            // {text: '导入减员成功记录', func: this.test},
            // {text: '查看最新状态信息', func: this.showNewMsg},
            // {text: '查看所有状态信息', func: this.showAllMsg},
            // {text: '筛选', func: this.pick},
            // {text: '减员申请', func: () => { windowOpen('flow.html#/flow/iafDecreaseMemberFlow?processType=iafDecreaseMemberFlow') }},
            {text: '删除', func: this.deleteRows, type: 'danger', key: 'insInsuredInsuranceDecreaseDelete'}
          ],
          export: {
            config: {
              fileName: '社保减员表',
              sync: {
                all: false
              }
            },
            req: config.socialDeleteSuccessInsurance,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredInsuranceDecreaseExportGet'
          },
          import: {
            business: 'iaf-insuredRecordDecreaseSuccessful',
            show: () => ({empty: false}),
            key: 'insInsuredInsuranceDecreaseImportPost'
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
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, decreaseState: true})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('socialDeleteSuccessInsurance', Object.assign({}, options, this.newSearchData,
              {lastData: this.lastData, decreaseState: true}
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
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, decreaseState: true})
    },
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, decreaseState: true})
    },
    search (searchData) {
      this.newSearchData = searchData
      this.table.search = Object.assign({}, searchData, {lastData: this.lastData, decreaseState: true})
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.searchForm.resetForm()
      this.attritionDate = ''
      this.dimissionTime = ''
      this.lastData = false
    },
    deleteRows () {
      for (var key in this.searchData) {
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
        this.$confirm('确定删除？').then(() => {
          req('socialSecurityInsuranceDecreasedDelete', this.deleteArr).then(data => {
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
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
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
