<template>
  <div>
    <i-layout 
      :borderWidth="0" 
      :margin="0" 
      :headerPadding="0" 
      :sectionPadding="0"
      header-key="insRetiredTallyPost"
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
              @sort-change="tableSort"
              v-loading="tableLoading"
              :element-loading-text="$loadingText"
            >
              <el-table-column type="selection" :fixed="true">
              </el-table-column>
              <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :sortable="col.sort"
              :prop="col.prop"
              :min-width="col.width"
              align="center"
              :formatter="tableScope.formatter"
              :label="col.label"
              :fixed="col.isFixes">
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
import ISelect from 'components/common/i-select/i-select.vue'
import IafSearch from 'components/iaf/search/iaf-search'
import req, {config} from 'api/iaf/external-data'
import ILayout from 'components/common/i-layout'
import IForm from 'components/common/i-form/i-form.vue'
import {windowOpen} from '@/utils'
export default {
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
          { prop: 'orgUnitName', label: '组织', width: '100' },
          { prop: 'orgUnitCode', label: '组织代码', width: '100' },
          { prop: 'retiredDate', label: '退休时间', width: '100', display: {date: 'default'} },
          { prop: 'endowmentInsuranceStatus', label: '养老保险办理情况', sort: false, width: '200', display: {dict: 'RETIRED_PENSION_STATUS'} },
          { prop: 'endowmentTransactDate', label: '养老退休办理时间', width: '150', display: {date: 'default'} },
          { prop: 'endowmentProvideDate', label: '养老险待遇发放时间', width: '150', display: {date: 'default'} },
          { prop: 'endowmentRetireTreatment', label: '养老退休待遇(元/月)', width: '150' },
          { prop: 'medicalInsuranceStatus', label: '医疗保险办理情况', width: '200', display: {dict: 'RETIRED_MEDICAL_STATUS'} },
          { prop: 'medicalTransactDate', label: '医保退休办理时间', width: '150', display: {date: 'default'} },
          { prop: 'medicalProvideDate', label: '医保待遇发放时间', width: '150', display: {date: 'default'} },
          { prop: 'medicalRetireTreatment', label: '医保退休待遇(元/月)', width: '150' },
          { prop: 'remark', label: '备注' }
        ],
        setting: {
          toolbar: [
            {text: '退休保险申报', func: this.addInfo}
          ],
          export: {
            config: {
              fileName: '退休保险台账'
            },
            text: '导出退休台账',
            req: config.iafBillsRetireSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insRetiredExportPost'
          }
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      conditionOptions: [
        {value: '01', label: '申请中'},
        {value: '02', label: '已完结'}
      ],
      searchData: {
        employeeCode: '',
        fullName: '',
        accountName: '',
        accountCode: '',
        employeeStatus: '',
        orgUnitName: '',
        orgUnitCode: ''
      }
    }
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('iafBillsRetireSearch', Object.assign({}, options, this.searchData, {retiredTally: true}))
        .then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
          this.tableLoading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.tableLoading = false
        })
    },
    getRetireType (key) {
      let type = ''
      this.conditionOptions.forEach(item => {
        item.value === key && (type = item.label)
      })
      return type
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
    search (data) {
      this.table.search = Object.assign({}, this.searchData, {retiredTally: true})
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
        retiredTally: true
      }
      req('iafBillsSearch', submitData).then(data => {
        this.table.data = data.data
        this.table.total = data.total
        this.table.info = data.info
      })
    },
    addInfo () {
      windowOpen('flow.html#/flow/iafRetirementInsuranceApplicationFlow?processType=iafRetirementInsuranceApplicationFlow')
    }
  },
  components: {
    ITable,
    IafSearch,
    ISelect,
    ILayout,
    IForm
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {retiredTally: true})
  }
}
</script>
<style lang="scss" scoped>

</style>
