<template>
    <i-layout header-key="insHandicappedGet">
      <div slot="header">
        <i-form @reset="resetInputs" @search="search">
          <el-form-item label="工号:">
            <el-input v-model="searchData.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名:">
            <el-input v-model="searchData.fullName"></el-input>
          </el-form-item>
          <el-form-item label="身份证:">
            <el-input v-model="searchData.idNumber"></el-input>
          </el-form-item>
          <el-form-item label="组织">
            <i-select-tree
              dataKey="org"
              nodeKey="orgUnitId"
              v-model="searchData.orgUnitId">
            </i-select-tree>
          </el-form-item>
          <!-- <el-form-item label="组织:">
            <el-input v-model="searchData.orgUnitName"></el-input>
          </el-form-item> -->
        </i-form>
      </div>
      <div slot="section">
        <i-table
          @pageSizeChange="searchHandleSizeChange"
          @pageIndexChange="searchHandleCurrentChange"
          :table="table"
          ref="table"
          @save="getTableData"
        >
          <template slot="table" slot-scope="tableScope">
            <slot name="toolbar">
              <div class="compute-month" v-if="accessMap.insCalculation">
                <el-form>
                  <el-form-item>
                    <el-col>
                      <el-date-picker 
                        placeholder="计算社保月份" 
                        type="month" 
                        v-model="searchData.payMonth" 
                        @change="search"
                      ></el-date-picker>
                    </el-col>
                  </el-form-item>
                </el-form>
              </div>
            </slot>
            <el-table
              :data="tableScope.clone"
              v-loading="loading"
              :element-loading-text="$loadingText"
            >
              <el-table-column type="selection" :fixed="true"></el-table-column>
              <el-table-column
                v-for="(col, idx) in table.columns"
                :prop="col.prop"
                :label="col.label"
                :key="idx"
                align="center"
                :formatter="tableScope.formatter"
                :width="col.width"
              >
                <el-table-column
                  v-for="(item, index) in col.children"
                  :prop="item.prop"
                  :label="item.label"
                  :key="index"
                  align="center"
                  :width="item.width"
                >
                </el-table-column>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>
</template>
<script>
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form.vue'
import ILayout from 'components/common/i-layout'
import req, {config} from 'api/iaf/social-security'
import moment from 'moment'
import Access from 'mixins/access'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
export default {
  components: {
    ITable,
    IForm,
    ILayout
  },
  data () {
    return {
      countYear: '- -',
      countMonth: '- -',
      countTime: '',
      isSearch: false,
      searchData: {
        orgUnitId: '',
        employeeCode: '',
        fullName: '',
        idNumber: '',
        orgUnitName: '',
        payMonth: moment(new Date()).format('YYYY-MM-DD')
      },
      loading: true,
      table: {
        columns: [
          {prop: 'employeeCode', label: '工号', width: '100'},
          {prop: 'fullName', label: '姓名', width: '100'},
          {prop: 'idNumber', label: '身份证号码', width: '150'},
          {prop: 'personnelGroupCode', label: '人事范围代码', width: '100'},
          {prop: 'personnelGroupName', label: '人事范围名称', width: '150'},
          {prop: 'orgUnitName', label: '组织', width: '100'},
          {prop: 'payMonth', label: '缴纳月份', width: '150'},
          {
            label: '养老保险',
            prop: 'endowment',
            children: [
              {prop: 'endowmentAccountName', label: '户头名称', width: '100'},
              {prop: 'endowmentEmpPay', label: '个人缴纳', width: '100'},
              {prop: 'endowmentCompPay', label: '单位缴纳', width: '100'}
            ]
          },
          {
            label: '医疗保险',
            prop: 'medicare',
            children: [
              {prop: 'medicareAccountName', label: '户头名称', width: '100'},
              {prop: 'medicareEmpPay', label: '个人缴纳', width: '100'},
              {prop: 'medicareCompPay', label: '单位缴纳', width: '100'}
            ]
          },
          {
            label: '失业保险',
            prop: 'unemployment',
            children: [
              {prop: 'unemploymentAccountName', label: '户头名称', width: '100'},
              {prop: 'unemploymentEmpPay', label: '个人缴纳', width: '100'},
              {prop: 'unemploymentCompPay', label: '单位缴纳', width: '100'}
            ]
          },
          {
            label: '工伤保险',
            prop: 'employmentInjury',
            children: [
              {prop: 'employmentInjuryAccountName', label: '户头名称', width: '100'},
              {prop: 'employmentInjuryEmpPay', label: '个人缴纳', width: '100'},
              {prop: 'employmentInjuryCompPay', label: '单位缴纳', width: '100'}
            ]
          },
          {
            label: '生育保险',
            prop: 'maternity',
            children: [
              {prop: 'maternityAccountName', label: '户头名称', width: '100'},
              {prop: 'maternityEmpPay', label: '个人缴纳', width: '100'},
              {prop: 'maternityCompPay', label: '单位缴纳', width: '100'}
            ]
          },
          {
            label: '住房公积金',
            prop: 'hpfund',
            children: [
              {prop: 'hpfundAccountName', label: '户头名称', width: '100'},
              {prop: 'hpfundEmpPay', label: '个人缴纳', width: '100'},
              {prop: 'hpfundCompPay', label: '单位缴纳', width: '100'}
            ]
          },
          {
            label: '大病补医保',
            prop: 'illness',
            children: [
              {prop: 'illnessAccountName', label: '户头名称', width: '100'},
              {prop: 'illnessCompPay', label: '个人缴纳', width: '100'},
              {prop: 'illnessEmpPay', label: '单位缴纳', width: '100'}
            ]
          },
          {
            label: '补充工伤',
            prop: 'supplementaryInjury',
            children: [
              {prop: 'supplementaryInjuryAccountName', label: '户头名称', width: '100'},
              {prop: 'supplementaryInjuryCompPay', label: '个人缴纳', width: '100'},
              {prop: 'supplementaryInjuryEmpPay', label: '单位缴纳', width: '100'}
            ]
          }
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          export: {
            config: {
              fileName: '五险一金计算表',
              sync: {
                all: false
              }
            },
            req: config.iafCompute,
            key: 'insInsuredExportPost'
          }
        },
        data: null,
        info: null,
        total: 0,
        search: {},
        multiple: true,
        showPagebar: true
      }
    }
  },
  mixins: [Access, IafSearchMixin],
  mounted () {
    this.getMultipleColumns()
    this.searchData.payMonth = moment(new Date()).format('YYYY-MM-DD')
    this.table.search = Object.assign({}, this.searchData)
  },
  methods: {
    fetch (options = {}) {
      this.loading = true
      if (!this.searchData.payMonth && this.isSearch) {
        this.searchData.payMonth = moment(new Date()).format('YYYY-MM-DD')
      }
      this.searchData.payMonth && (this.searchData.payMonth = moment(this.searchData.payMonth).format('YYYY-MM-DD'))
      req('iafCompute', Object.assign({}, options, this.searchData)).then(res => {
        this.getMultipleData(res.data)
        Object.assign(this.table, res)
        this.loading = false
      })
      .catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    searchHandleCurrentChange (options) {
      this.fetch(options)
    },
    search () {
      this.isSearch = true
      this.searchData.payMonth = moment(this.searchData.payMonth).format('YYYY-MM-DD')
      this.table.search = Object.assign({}, this.searchData)
    },
    resetInputs () {
      for (let key in this.searchData) {
        key !== 'payMonth' && (this.searchData[key] = '')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .center{
    display: flex;
    justify-content: center;
  }
  .input-width{
    width:60px;
  }
  .content-card{
    padding:10px;
  }
  .compute-month{
    float: right;
    margin-top: -46px;
    width: 120px;
    /deep/ .el-col-push-8{
      bottom: 3px;
    }
    .el-input--mini{
      /deep/ .el-input__inner{
        padding-right: 0px;
        height: 36px;
        line-height: 36px;
        // padding-right: 2px;
        min-width: 120px;
      }
      /deep/ .el-input__icon{
        font-size: 14px;
      }
      /deep/ input::-webkit-input-placeholder{
        color: #333;
        font-size: 12px;
      }
      /deep/ input:-ms-input-placeholder{
        color: #333;
        font-size: 12px;
      }
      /deep/ input::-moz-placeholder{
        color: #333;
        font-size: 12px;
      }
      /deep/ input:-moz-placeholder{
        color: #333;
        font-size: 12px;
      }
    }
  }
</style>
