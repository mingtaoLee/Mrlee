<template>
  <div>
    <i-layout 
      :borderWidth="0" 
      :margin="0" 
      :headerPadding="0" 
      :sectionPadding="0"
      header-key="insInjuryTallyPost"
      v-loading="loading"
      :element-loading-text="$loadingText"
    >
      <i-form ref="form" slot="header" @reset="resetInputs" @search="search">
        <el-form-item label="工号">
          <el-input v-model="searchData.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="参保户头">
          <el-input v-model="searchData.accountName"></el-input>
        </el-form-item>
        <el-form-item label="户头代码">
          <el-input v-model="searchData.accountCode"></el-input>
        </el-form-item>
        <!-- <el-form-item label="参保类型">
          <el-input v-model="searchData.insuranceType"></el-input>
        </el-form-item> -->
        <el-form-item label="员工状态">
          <i-select parameter="EMPLOYEE_STATUS" v-model="searchData.employeeStatus"></i-select>
        </el-form-item>
        <el-form-item label="组织">
          <el-input v-model="searchData.orgUnitName"></el-input>
        </el-form-item>
        <el-form-item label="组织代码">
          <el-input v-model="searchData.orgUnitCode"></el-input>
        </el-form-item>
      </i-form>
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
            <el-table-column type="selection" :fixed="true">
            </el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :sortable="col.sort"
              :min-width="col.width"
              :formatter="tableScope.formatter"
              :prop="col.prop"
              :label="col.label"
              :fixed="col.isFixes"
            >
              <el-table-column
                v-if="col.children"
                v-for="(item, key) of col.children"
                :key="key"
                :prop="item.prop"
                :min-width="item.width"
                :formatter="tableScope.formatter"
                :label="item.label"
              ></el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      </div>
    </i-layout>
  </div>
</template>
<script>
import ITable from 'components/common/i-table'
import ISelect from 'components/common/i-select/i-select'
import IafSearch from 'components/iaf/search/iaf-search'
import req, {config} from 'api/iaf/external-data'
import ILayout from 'components/common/i-layout'
import IForm from 'components/common/i-form/i-form.vue'
// import moment from 'moment'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
import {windowOpen} from '@/utils'
export default {
  name: 'JobInjuredInsuranceTable',
  props: {
    tabsNames: Object
  },
  mixins: [IafSearchMixin],
  data () {
    return {
      isSort: null,
      loading: true,
      tableLoading: true,
      table: {
        title: '',
        columns: [
          { prop: 'employeeCode', label: '工号', sort: false, width: '100' },
          { prop: 'fullName', label: '姓名', width: '150' },
          { prop: 'accountName', label: '参保户头', width: '100' },
          { prop: 'accountCode', label: '户头代码', width: '100' },
          { prop: 'employeeStatus', label: '员工状态', width: '100', display: {dict: 'EMPLOYEE_STATUS'} },
          { prop: 'declarationType', label: '申报险种', width: '100', display: { dict: 'WORK_RELATED_INSURANCE' } },
          { prop: 'orgUnitName', label: '组织', width: '100' },
          { prop: 'orgUnitCode', label: '组织代码', width: '100' },
          { prop: 'injuryDate', label: '工伤时间', width: '150', display: {date: 'default'} },
          { prop: 'injuryPart', label: '受伤部位', sort: false, width: '150' },
          { prop: 'injuryProcess', label: '受伤时间，地点，经过', width: '200' },
          { prop: 'isHospitalized', label: '是否住院', width: '100', display: { dict: 'WHETHER_TYPE' } },
          { prop: 'injuryStatus', label: '工伤状态', width: '100', display: {dict: 'IAF_INJURY_STATUS'} },
          { prop: 'judgeDate', label: '工伤认定时间', width: '150', display: {date: 'default'} },
          { prop: 'isInjury', label: '是否伤残', width: '100', display: { dict: 'WHETHER_TYPE' } },
          { prop: 'judgeDate', label: '工伤鉴定时间', width: '150', display: {date: 'default'} },
          { prop: 'disabilityGrade', label: '伤残等级', width: '100', display: {dict: 'DISABILITY_GRADE'} },
          { prop: 'firstApplyDate', label: '第一次待遇申报时间', width: '200', display: {date: 'default'} },
          { prop: 'firstShouldValue', label: '应报销金额', width: '150' },
          { label: '实际报销金额',
            prop: 'firstReal',
            children: [
              { prop: 'firstRealSubsidy', label: '一次性伤残补助金额', width: '150' },
              { prop: 'firstRealExpenses', label: '医疗费', width: '150' },
              { prop: 'firstRealTotal', label: '合计', width: '150' }
            ]
          },
          { prop: 'secondApplyDate', label: '第二次待遇申报时间', width: '180', display: {date: 'yyyy-MM-dd'} },
          { prop: 'secondShouldValue', label: '应报销金额', width: '150' },
          { label: '实际报销金额',
            prop: 'secondReal',
            children: [
              { prop: 'secondRealSubsidy', label: '一次性伤残补助金额', width: '150' },
              { prop: 'secondRealExpenses', label: '医疗费', width: '150' },
              { prop: 'secondRealTotal', label: '合计', width: '150' }
            ]
          },
          { prop: 'transferredValue', label: '工亡到账金额', width: '150' },
          { prop: 'isCompleted', label: '是否完结', width: '100', display: { dict: 'WHETHER_TYPE' } },
          { prop: 'lastUpdateBy', label: '经办', width: '100' }
        ],
        setting: {
          toolbar: [
            {text: '工伤保险申报', func: this.addInfo}
          ],
          export: {
            config: {
              fileName: '工伤保险台账'
            },
            text: '导出工伤台账',
            req: config.iafBillsInjueredSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInjuryExportPost'
          }
        },
        data: null,
        info: null,
        total: 0,
        search: {},
        multiple: true,
        showPagebar: true
      },
      searchData: {
        employeeCode: '',
        fullName: '',
        accountName: '',
        accountCode: '',
        insuranceType: '',
        employeeStatus: '',
        orgUnitName: '',
        orgUnitCode: ''
      }
    }
  },
  mounted () {
    this.getMultipleColumns()
    this.table.search = Object.assign({}, this.searchData, {injuryTally: true})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('iafBillsInjueredSearch', Object.assign({}, options, this.searchData, {injuryTally: true}))
        .then(res => {
          this.getMultipleData(res.data)
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
    initLayout () {
      this.$refs.form.initLayout()
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.form.resetForm()
    },
    search (searchData) {
      this.table.search = Object.assign({}, this.searchData, {injuryTally: true})
    },
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    searchHandleCurrentChange (options) {
      this.fetch(options)
    },
    tableSort (row) {
      if (row.order === 'ascending') {
        this.isSort = true
      } else if (row.order === 'descending') {
        this.isSort = false
      }
      let submitData = {
        orderByProperty: row.prop,
        orderStrategy: this.isSort,
        injuryTally: true
      }
      req('iafBillsSearch', submitData).then(data => {
        this.table.data = data.data
        this.table.total = data.total
        this.table.info = data.info
      })
    },
    addInfo () {
      windowOpen('flow.html#/flow/iafWorkingInjuryFlow?processType=iafWorkingInjuryFlow')
    }
  },
  components: {
    ITable,
    IafSearch,
    ISelect,
    ILayout,
    IForm
  }
}
</script>
<style lang="scss" scoped>

</style>
