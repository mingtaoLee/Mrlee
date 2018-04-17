<template>
  <div>
    <i-layout 
      :borderWidth="0" 
      :margin="0" 
      :headerPadding="0" 
      :sectionPadding="0"
      header-key="insMedicalTallyPost"
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
            :min-width="col.width"
            align="center"
            :formatter="tableScope.formatter"
            :prop="col.prop"
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
          { prop: 'hospitalzeDate', label: '就医时间', sort: false, width: '150', display: {date: 'default'} },
          { prop: 'reimbursementDate', label: '费用报销时间', width: '150', display: {date: 'default'} },
          { prop: 'reimbursementStatus', label: '费用报销状态', width: '150', display: {dict: 'IAF_EXPENSE_ACCOUNT_STATUS'} },
          { prop: 'reimbursementValue', label: '费用报销金额', width: '150' }
        ],
        setting: {
          toolbar: [
            {text: '医疗保险申报', func: this.addInfo}
          ],
          export: {
            config: {
              fileName: '医疗保险台账'
            },
            text: '导出医疗台账',
            req: config.iafBillsMedicalSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insMedicalExportPost'
          }
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      loading: true,
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
      req('iafBillsMedicalSearch', Object.assign({}, options, this.searchData, {maternityTally: true})).then(res => {
        Object.keys(res).map(key => {
          this.table[key] = res[key]
        })
        this.tableLoading = false
        this.loading = false
      })
      .catch(err => {
        console.log(err)
        this.tableLoading = false
        this.loading = false
      })
    },
    exportMedicalInsurancBook () {

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
      this.table.search = Object.assign({}, this.searchData, {maternityTally: true})
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
        maternityTally: true
      }
      req('iafBillsSearch', submitData).then(data => {
        this.table.data = data.data
        this.table.total = data.total
        this.table.info = data.info
      })
    },
    addInfo () {
      windowOpen('flow.html#/flow/iafMedicalFlow?processType=iafMedicalFlow')
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
    this.table.search = Object.assign({}, this.searchData, {maternityTally: true})
  }
}
</script>
<style lang="scss" scoped>

</style>
