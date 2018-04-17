<template>
  <i-layout>
    <div slot="header" header-key="insExternalPost">
      <i-form @reset="resetInputs" @search="search">
        <el-form-item label="查看状态">
          <el-select v-model="checkStatuVal" placeholder="请选择" @change="checkStatusList">
             <!-- @change="checkStatusList" -->
            <el-option
                v-for="item in checkType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号:">
          <el-input v-model="searchData.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="searchData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="组织:">
          <el-input v-model="searchData.orgUnitName"></el-input>
        </el-form-item>
        <el-form-item label="缴纳起始月份:">
          <el-date-picker 
            type="month" 
            v-model="searchData.payStartDate"
            :picker-options="payStartDateOptions"
            @change="handleDateChange(searchData.payStartDate, 'searchData', 'payStartDate', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="缴纳终止月份:">
          <el-date-picker 
            type="month" 
            v-model="searchData.payEndDate"
            :picker-options="payEndDateOptions"
            @change="handleDateChange(searchData.payEndDate, 'searchData', 'payEndDate', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号码:">
          <el-input v-model="searchData.idNumber"></el-input>
        </el-form-item>
      </i-form>
    </div>
    <div slot="section">
      <i-table
        :table="table"
        @pageSizeChange="searchHandleSizeChange"
        @pageIndexChange="searchHandleCurrentChange"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            @selection-change="selectionChange"
            @sort-change="sortChange"
            :border="$$.table.border"
            :stripe="$$.table.stripe"
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column min-width="150" align="center" prop="employeeCode" label="工号" :sortable="false"></el-table-column>
            <el-table-column min-width="150" align="center" prop="fullName" label="姓名"></el-table-column>
            <el-table-column
              :sortable="col.sort"
              v-if="col.show"
              v-for="(col, idx) in table.columns"
              :prop="col.prop"
              :label="col.label"
              :key="idx"
              align="center"
              :width="col.width"
              :formatter="tableScope.formatter"
            >
              <el-table-column
                v-if="col.children"
                v-for="(item, index) in col.children"
                :key="index"
                align="center"
                :prop="item.prop"
                :width="item.width"
                :label="item.label"
              ></el-table-column>
            </el-table-column>
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
</template>
<script>
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form.vue'
import req, {config} from 'api/iaf/external-data'
import Screen from 'components/iaf/fund/screen.vue'
import ILayout from 'components/common/i-layout'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
export default {
  components: {
    ITable,
    IForm,
    Screen,
    ILayout
  },
  mixins: [IafSearchMixin],
  data () {
    return {
      checkStatuVal: '',
      checkType: [
        {
          label: '查看最新状态信息',
          value: 'checkNewStatus'
        },
        {
          label: '查看所有状态信息',
          value: 'checkAallStatus'
        }
      ],
      visible: false,
      loading: true,
      deleteArr: [],
      searchData: {
        employeeCode: '',
        fullName: '',
        orgUnitName: '',
        payStartDate: '',
        payEndDate: '',
        idNumber: ''
      },
      lastData: false,
      table: {
        columns: [
          { prop: 'idNumber', label: '身份证号码', show: true, width: '200' },
          { prop: 'orgUnitName', label: '组织', show: true, width: '200' },
          { prop: 'payMonth', label: '缴纳月份', show: true, width: '150' },
          {
            prop: 'endowment',
            label: '养老保险',
            show: true,
            children: [
              { prop: 'endowmentAccountName', label: '户头名称', width: '200' },
              { prop: 'endowmentEmpPayValue', label: '个人缴纳', width: '100' },
              { prop: 'endowmentCompPayValue', label: '单位缴纳', width: '100' }
            ]
          },
          {
            prop: 'medicare',
            label: '医疗保险',
            show: true,
            children: [{ prop: 'medicareAccountName', label: '户头名称', width: '200' },
              { prop: 'medicareEmpPayValue', label: '个人缴纳', width: '100' },
              { prop: 'medicareCompPayValue', label: '单位缴纳', width: '100' }]
          },
          {
            prop: 'unemployment',
            label: '失业保险',
            show: true,
            children: [{ prop: 'unemploymentAccountName', label: '户头名称', width: '200' },
              { prop: 'unemploymentEmpPayValue', label: '个人缴纳', width: '100' },
              { prop: 'unemploymentCompPayValue', label: '单位缴纳', width: '100' }]
          },
          {
            prop: 'injury',
            label: '工伤保险',
            show: true,
            children: [{ prop: 'employmentInjuryAccountName', label: '户头名称', width: '200' },
              { prop: 'employmentInjuryEmpPayValue', label: '个人缴纳', width: '100' },
              { prop: 'employmentInjuryCompPayValue', label: '单位缴纳', width: '100' }]
          },
          {
            prop: 'maternity',
            label: '生育保险',
            show: true,
            children: [{ prop: 'maternityAccountName', label: '户头名称', width: '200' },
              { prop: 'maternityEmpPayValue', label: '个人缴纳', width: '100' },
              { prop: 'maternityCompPayValue', label: '单位缴纳', width: '100' }]
          },
          {
            prop: 'hpfund',
            label: '住房公积金',
            show: true,
            children: [{ prop: 'hpfundAccountName', label: '户头名称', width: '200' },
              { prop: 'hpfundEmpPayValue', label: '个人缴纳', width: '100' },
              { prop: 'hpfundCompPayValue', label: '单位缴纳', width: '100' }]
          },
          {
            prop: 'supplyEmployeeInjury',
            label: '补充工伤',
            show: true,
            children: [{ prop: 'supplyEmployeeInjuryAccountName', label: '户头名称', width: '200' },
              { prop: 'supplyEmployeeInjuryEmpPayValue', label: '个人缴纳', width: '100' },
              { prop: 'supplyEmployeeInjuryCompPayValue', label: '单位缴纳', width: '100' }]
          },
          {
            prop: 'supplyMedicare',
            label: '大病补医保',
            show: true,
            children: [{ prop: 'supplyMedicareAccountName', label: '户头名称', width: '200' },
              { prop: 'supplyMedicareEmpPayValue', label: '个人缴纳', width: '100' },
              { prop: 'supplyMedicareCompPayValue', label: '单位缴纳', width: '100' }]
          }
        ],
        setting: {    // 可编辑表格的相关设置【可选】
          toolbar: [
            // {text: '导入'},
            // {text: '查看最新状态信息', func: this.showNewMsg},
            // {text: '查看所有状态信息', func: this.showAllMsg},
            // {text: '筛选', func: this.pick},
            {text: '删除', func: this.deleteRow, key: 'insExternalExternalDelete'}
          ],     // 工具栏【可选】
          export: {
            config: {
              fileName: '外部缴纳表'
            },
            req: config.externalPaymentSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insIafExternalPost'
          },
          import: {
            business: 'iaf-externalPaymentImport',
            show: () => ({empty: false}),
            key: 'insExternalExternalPost'
          }
        },
        data: null,
        info: null,
        total: 0,
        multiple: true,
        search: null,
        showPagebar: true
      }
    }
  },
  created () {
    this.getMultipleColumns()
    this.lastData = false
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
  },
  methods: {
    fetch (options = {}) {
      this.loading = true
      req('externalPaymentSearch', Object.assign({}, options, this.searchData, {lastData: this.lastData}))
        .then(res => {
          this.getMultipleData(res.data)
          Object.keys(res).map(key => (this.table[key] = res[key]))
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    eachForm () {
      for (var key in this.searchData) {
        if (this.searchData[key]) {
          this.lastData = false
          this.table.search.lastData = false
        }
      }
    },
    search () {
      // console.log(this.checkStatuVal)
      // if (this.checkStatuVal === 'checkNewStatus') {
      //   console.log(222)
      //   this.lastData = true
      //   this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
      // } else if (this.checkStatuVal === 'checkAallStatus') {
      //   console.log(1)
      //   this.lastData = false
      //   this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
      // } else {
      //   console.log(3)
      //   this.lastData = true
      //   this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
      // }
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.payMonth = ''
      this.lastData = false
      this.checkStatuVal = ''
      this.table.search.lastData = false
    },
    // 每页显示的条数改变时
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    // 页数改变时
    searchHandleCurrentChange (options) {
      this.fetch(options)
    },
    sortChange (row) {
      let orderStrategy = null
      if (row.order === 'descending') {
        orderStrategy = false
      } else if (row.order === 'ascending') {
        orderStrategy = true
      }
      let submitDate = {
        orderByProperty: row.prop,
        orderStrategy: orderStrategy,
        lastData: this.lastData
      }
      req('externalPaymentSearch', submitDate).then(data => {
        this.table.data = data.data
        this.table.total = data.total
        this.table.info = data.info
      })
    },
    selectionChange (row) {
      var newDeleteArr = []
      this.deleteArr = row.map(item => {
        return item.externalRecordIds
      })
      this.deleteArr.forEach(data => {
        newDeleteArr = newDeleteArr.concat(data.split(','))
      })
      this.deleteArr = newDeleteArr
    },
    deleteRow () {
      if (this.deleteArr.length === 0) {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      } else {
        this.$confirm('确定删除？').then(() => {
          req('externalPaymentDelete', this.deleteArr).then(data => {
            if (data === true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
            this.search()
          })
        }).catch(() => {})
      }
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    pick () {
      this.visible = true
    },
    showNewMsg () {
      this.lastData = true
      this.table.search.lastData = true
      this.fetch(this.table.info)
      // this.search()
    },
    showAllMsg () {
      this.lastData = false
      this.table.search.lastData = false
      this.fetch(this.table.info)
      // this.search()
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
<style lang="scss" scoped>
</style>
