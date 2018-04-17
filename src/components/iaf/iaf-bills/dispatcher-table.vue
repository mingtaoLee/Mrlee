<template>
  <div>
    <i-layout 
      :borderWidth="0" 
      :margin="0" 
      :headerPadding="0" 
      :sectionPadding="0"
      header-key="externalUpdateIafBaseTallyT"
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
        <el-form-item label="人事范围代码">
          <el-input v-model="searchData.personnelGroupCode"></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称">
          <el-input v-model="searchData.personnelGroupName"></el-input>
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
              @selection-change="getDeleteRow"
              :border="$$.table.border"
              :stripe="$$.table.stripe"
              :data="tableScope.clone"
              v-loading="tableScope.loading"
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
export default {
  data () {
    return {
      isSort: null,
      loading: true,
      table: {
        title: '',
        columns: [
          { prop: 'employeeCode', label: '工号', sort: false, width: '100' },
          { prop: 'fullName', label: '姓名', width: '150' },
          { prop: 'accountName', label: '参保户头', width: '100' },
          { prop: 'accountCode', label: '户头代码', width: '100' },
          { prop: 'employeeStatus', label: '员工状态', width: '100', display: {dict: 'EMPLOYEE_STATUS'} },
          { prop: 'personnelGroupCode', label: '人事范围代码', width: '100' },
          { prop: 'personnelGroupName', label: '人事范围名称', width: '100' },
          { prop: 'orgUnitName', label: '组织', width: '100' },
          { prop: 'orgUnitCode', label: '组织代码', width: '100' },
          { prop: '', label: '职务', width: '100' },
          { prop: 'increaseDate', label: '调基申请时间', width: '200' },
          { prop: 'insuranceType', label: '保险类别', width: '150', display: {dict: 'INSURANCE_TYPE'} },
          { prop: 'empPayBaseBefore', label: '调整前个人基数', width: '200' },
          { prop: 'compPayBaseBefore', label: '调整前单位基数', width: '150' },
          { prop: 'empPayBaseAfter', label: '申请调整后个人基数', width: '150' },
          { prop: 'compPayBaseAfter', label: '申请调整后单位基数', width: '150' },
          { prop: 'salaryTotalBefore', label: '调整前薪资总额', width: '150' },
          { prop: 'salaryTotalAfter', label: '调整后薪资总额', width: '150' }
        ],
        setting: {
          export: {
            config: {
              fileName: '调基台账'
            },
            text: '导出调基台账',
            req: config.updateIafBaseTally,
            key: 'externalUpdateIafBaseTallyD'
          },
          import: {
            business: 'iaf-hpfundIncreaseImport',
            key: 'externalUpdateIafBaseTallyDr',
            show: () => ({empty: false})
          },
          toolbar: [
            {
              text: '删除',
              type: 'danger',
              key: 'externalUpdateIafBaseTallyDell',
              func: this.deleteRows
            }
          ]
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      searchData: {
        employeeCode: '',
        fullName: '',
        accountName: '',
        accountCode: '',
        employeeStatus: '',
        personnelGroupCode: '',
        personnelGroupName: '',
        orgUnitName: '',
        orgUnitCode: ''
      }
    }
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData)
  },
  methods: {
    fetch (options = {}) {
      req('updateIafBaseTally', Object.assign({}, options, this.searchData))
        .then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
        })
        .catch(err => console.log(err))
        .finally(() => {
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
      this.table.search = Object.assign({}, this.searchData)
    },
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    // 选中checkbox
    getDeleteRow (row) {
      this.deleteArr = row.map(item => {
        return item.hpfundRecordId
      })
    },
     // 删除多行
    deleteRows () {
      if (this.deleteArr.length === 0) {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      } else {
        this.$confirm('确认删除？').then(() => {
          req('fundQueryDelete', this.deleteArr).then(data => {
            if (data === true) {
              this.$message({
                type: 'info',
                message: '删除成功'
              })
              this.fetch(this.table.info)
            }
          })
        }).catch(() => {})
      }
    },
    searchHandleCurrentChange (options) {
      this.fetch(options)
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
