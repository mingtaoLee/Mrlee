<template>
  <div>
    <i-layout 
      :borderWidth="0" 
      :margin="0" 
      :headerPadding="0" 
      :sectionPadding="0"
      header-key="insUnemplomentTallyPost"
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
        <el-form-item label="是否申领失业金">
          <i-select parameter="WHETHER_TYPE" v-model="searchData.isApplyBenefits"></i-select>
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
              :prop="col.prop"
              :min-width="col.width"
              align="center"
              :sortable="col.sort"
              :formatter="tableScope.formatter"
              :label="col.label"
              ></el-table-column>
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
export default {
  data () {
    return {
      isSort: null,
      newSearchData: {},
      loading: true,
      tableLoading: true,
      table: {
        title: '',
        columns: [
          { prop: 'employeeCode', label: '工号', sort: false, width: '100' },
          { prop: 'fullName', label: '姓名', width: '150' },
          { prop: 'accountName', label: '参保户头', width: '150' },
          { prop: 'accountCode', label: '户头代码', width: '200' },
          { prop: 'employeeStatus', label: '员工状态', width: '100', display: {dict: 'EMPLOYEE_STATUS'} },
          { prop: 'orgUnitName', label: '组织', sort: false, width: '200' },
          { prop: 'orgUnitCode', label: '组织代码', width: '200' },
          { prop: 'dimissionDate', label: '离职日期', width: '150', display: {date: 'default'} },
          { prop: 'isApplyBenefits', label: '是否申领失业金', width: '150', display: {dict: 'WHETHER_TYPE'} },
          { prop: 'transactDate', label: '办理日期', width: '150', display: {date: 'default'} }
        ],
        setting: {
          export: {
            config: {
              fileName: '失业保险台账'
            },
            text: '导出失业台账',
            req: config.iafBillsUnemploymentSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insUnemplomentExportPost'
          }
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      // 高级搜索数据
      searchData: {
        employeeCode: '',
        fullName: '',
        accountName: '',
        accountCode: '',
        employeeStatus: '',
        orgUnitName: '',
        orgUnitCode: '',
        isApplyBenefits: ''
      }
    }
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {unemploymentTally: true})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('iafBillsUnemploymentSearch', Object.assign({}, options, this.searchData, {unemploymentTally: true}))
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
    resetInputs () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.form.resetForm()
    },
    search (searchData) {
      this.table.search = Object.assign({}, this.searchData, {unemploymentTally: true})
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
        unemploymentTally: true
      }
      req('iafBillsSearch', submitData).then(data => {
        this.table.data = data.data
        this.table.total = data.total
        this.table.info = data.info
      })
    },
    initLayout () {
      this.$refs.form.initLayout()
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
