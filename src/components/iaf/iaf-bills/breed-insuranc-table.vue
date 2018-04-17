<template>
  <div>
    <i-layout 
      :borderWidth="0" 
      :margin="0" 
      :headerPadding="0" 
      :sectionPadding="0"
      header-key="insProExportPost"
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
        class="table-padding"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
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
  props: {
    tabsNames: Object
  },
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
          { prop: 'accountCode', label: '户头代码', width: '150' },
          { prop: 'employeeStatus', label: '员工状态', width: '150', display: {dict: 'EMPLOYEE_STATUS'} },
          { prop: 'orgUnitName', label: '组织', width: '150' },
          { prop: 'orgUnitCode', label: '组织代码', sort: false, width: '150' },
          { prop: 'procreationDate', label: '生育时间', width: '150', display: {date: 'default'} },
          { prop: 'proReimbursementDate', label: '费用报销时间', width: '150', display: {date: 'default'} },
          { prop: 'proReimbursementStatus', label: '费用报销状态', width: '150', display: {dict: 'IAF_EXPENSE_ACCOUNT_STATUS'} },
          { prop: 'proReimbursementValue', label: '费用报销金额', width: '150' }
        ],
        setting: {
          toolbar: [
            {text: '生育保险申报', func: this.addInfo}
          ],
          export: {
            config: {
              fileName: '生育保险台账'
            },
            text: '导出生育台账',
            req: config.iafBillsBreedSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insProExportPost'
          }
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      // 表单监听对象
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
      req('iafBillsBreedSearch', Object.assign({}, options, this.searchData, {procreationTally: true}))
        .then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
            this.tableLoading = false
            this.loading = false
          })
        })
        .catch(err => {
          console.log(err)
          this.tableLoading = false
          this.loading = false
        })
    },
    exportBreedInsurancBook () {

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
      this.table.search = Object.assign({}, this.searchData, {procreationTally: true})
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
        procreationTally: true
      }
      req('iafBillsSearch', submitData).then(data => {
        this.table.data = data.data
        this.table.total = data.total
        this.table.info = data.info
      })
    },
    addInfo () {
      windowOpen('flow.html#/flow/iafProcreationFlow?processType=iafProcreationFlow')
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
    this.table.search = Object.assign({}, this.searchData, {procreationTally: true})
  }
}
</script>
<style lang="scss" scoped>
</style>
