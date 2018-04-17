<template>
  <div>
    <i-layout
      header-key = "insInsuredHpfundDecreasePost"
      :borderWidth="0"
      :margin="0"
      :headerPadding="0"
      :sectionPadding="0"
      v-loading="loading"
      :element-loading-text="$loadingText"
    >
    <div slot="header">
      <iaf-search 
        ref="form" 
        @resetInputs="resetInputs" 
        :additions="searchData" 
        @search="search"
        :isShowItem="false" 
        @checckStatus= "checkStatusList"
      >
        <template>
          <!-- <el-form-item label="职位:">
            <el-input v-model="searchData.positionName"></el-input>
          </el-form-item>
          <el-form-item label="司龄(月):">
            <el-input v-model="searchData.workingMonths"></el-input>
          </el-form-item>
          <el-form-item label="年龄:">
            <el-input v-model="searchData.age"></el-input>
          </el-form-item> -->
          <el-form-item label="员工户口性质:">
            <i-select clearable v-model="searchData.domicileType" parameter="DOMICILE_TYPE"></i-select>
          </el-form-item>
          <el-form-item label="银行类型:">
            <i-select parameter="BANK_TYPE" v-model="searchData.cardType"></i-select>
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input v-model="searchData.mobile"></el-input>
          </el-form-item>
          <el-form-item label="离职开始时间:">
            <el-date-picker
              type="date"
              v-model="searchData.dimissionDateStart"
              :editable="false"
              :picker-options="dimissionDateStartOptions"
              @change="handleDateChange(searchData.dimissionDateStart, 'searchData', 'dimissionDateStart', 'string')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="离职结束时间:">
            <el-date-picker
              type="date"
              v-model="searchData.dimissionDateEnd" 
              :editable="false"
              :picker-options="dimissionDateEndOptions"
              @change="handleDateChange(searchData.dimissionDateEnd, 'searchData', 'dimissionDateEnd', 'string')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="申请开始时间:">
            <el-date-picker
              type="date"
              v-model="searchData.increaseDateStart"
              :editable="false"
              :picker-options="increaseDateStartOptions"
              @change="handleDateChange(searchData.increaseDateStart, 'searchData', 'increaseDateStart', 'string')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="申请结束时间:">
            <el-date-picker
              type="date"
              v-model="searchData.increaseDateEnd"
              :editable="false"
              :picker-options="increaseDateEndOptions"
              @change="handleDateChange(searchData.increaseDateEnd, 'searchData', 'increaseDateEnd', 'string')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="减员原因:">
              <i-select parameter="IAF_DEDUCE_REASON" v-model="searchData.applyReason"></i-select>
          </el-form-item>
        </template>
      </iaf-search>
    </div>
    <div slot="section" class="mt15">
      <i-table
        @pageSizeChange="searchHandleSizeChange"
        @pageIndexChange="searchHandleCurrentChange"
        @save="getTableData"
        :table="table"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            @selection-change="getDeleteRow"
            @current-change="handleCurrentChange"
            :border="$$.table.border"
            :stripe="$$.table.stripe"
            :data="tableScope.clone"
            v-loading="tableLoading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, idx) of tableScope.columns || []"
              :key="idx"
              :prop="col.prop"
              v-if="col.show"
              align="center"
              :sortable="col.sort"
              :min-width="col.width"
              :formatter="tableScope.formatter"
              :label="col.label"
            ></el-table-column>
          </el-table>
        </template>
      </i-table>
      <el-pagination
        v-show="pageVisible"
        @current-change="pageChange"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        class="center"
      ></el-pagination>
    </div>
    <screen v-model="visible" :columns="table.columns" @receiveColumns="receiveColumns">
      <template slot="checked">
        <el-checkbox checked disabled>工号</el-checkbox>
        <el-checkbox checked disabled>姓名</el-checkbox>
      </template>
    </screen>
    </i-layout>
  </div>
</template>
<script>
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form.vue'
import req, {config} from 'api/iaf/insurance-manage'
import iafSearch from 'components/iaf/search/iaf-search.vue'
import Screen from 'components/iaf/fund/screen'
import ILayout from 'components/common/i-layout'
import iafSearchMixin from 'mixins/compensation/iaf-search-mixin'
// import { windowOpen } from 'utils'
export default {
  components: {
    ITable,
    IForm,
    iafSearch,
    Screen,
    ILayout
  },
  mixins: [iafSearchMixin],
  data () {
    return {
      searchData: {
        cardType: '',
        mobile: '',
        dimissionDateStart: '',
        dimissionDateEnd: '',
        increaseDateStart: '',
        increaseDateEnd: '',
        domicileType: '',
        // age: '',
        // workingMonths: '',
        // positionName: '',
        applyReason: ''
      },
      newSearchData: {},
      tableLoading: true,
      visible: false,
      deleteArr: [],
      lastData: false,
      loading: true,
      decreasingState: true, // 减员申请信息标识
      activeName: 'third',
      table: {
        title: '',     // 标题【可选】
        columns: [         // 表头【必填】
          { prop: 'employeeCode', label: '工号', show: true, width: '100' },
          { prop: 'fullName', label: '姓名', show: true, width: '100' },
          { prop: 'orgUnitName', label: '组织', show: true, width: '150' },
          { prop: 'personnelGroupName', label: '人事范围', sort: false, show: true, width: '150' },
          { prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'} },
          { prop: 'positionName', label: '职位', show: true, width: '200' },
          { prop: 'hireDate', label: '入职日期', display: {date: 'default'}, show: true, width: '150' },
          { prop: 'workingMonths', label: '司龄(月)', show: true, width: '100' },
          { prop: 'idNumber', label: '身份证号', show: true, width: '200' },
          { prop: 'gender', label: '性别', show: true, width: '100', display: {dict: 'GENDER'} },
          { prop: 'age', label: '年龄', show: true, width: '100' },
          { prop: 'domicileType', label: '员工户口性质', show: true, width: '100', display: {dict: 'DOMICILE_TYPE'} },
          {prop: 'domicileGrade', label: '员工户口级别', show: true, width: '100', display: {dict: 'DOMICILE_LEVE'}},
          {prop: 'householdCode', label: '户头户口性质', show: true, width: '100', display: {dict: 'IAF_ACCOUNT_TYPE'}},
          { prop: 'cardType', label: '银行类型', show: true, width: '100', display: {dict: 'BANK_TYPE'} },
          { prop: 'cardId', label: '银行卡号', show: true, width: '200' },
          { prop: 'cardNumber', label: '一类建行卡号', show: true, width: '200' },
          { prop: 'mobile', label: '联系电话', show: true, width: '150' },
          { prop: 'empHpfundAccount', label: '公积金账号', show: true, width: '150' },
          { prop: 'accountCode', label: '户头代码', show: true, width: '200' },
          { prop: 'accountName', label: '户头名称', show: true, width: '100' },
          {prop: 'paymentMethods', label: '支付方式', show: true, width: '150', display: {dict: 'IAF_PAYMENT_TYPE'}},
          {prop: 'insuredStatus', label: '参保状态', show: true, width: '100', display: {dict: 'IAF_INSURED_STATUS'}},
          { prop: 'dimissionDate', label: '离职时间', display: {date: 'default'}, show: true, width: '150' },
          { prop: 'attritionDate', label: '减少时间', display: {date: 'default'}, show: true, width: '150' },
          { prop: 'applyReason', label: '减员原因', show: true, width: '100', display: {dict: 'IAF_DEDUCE_REASON'} },
          { prop: 'remark', label: '备注', show: true, width: '100' },
          { prop: 'increaseDate', label: '申请时间', display: {date: 'default'}, show: true, width: '150' },
          {prop: 'lastUpdateBy', label: '操作者', show: true, width: '100'},
          {prop: 'lastUpdateDate', label: '操作时间', show: true, width: '150', display: { date: 'default' }}
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          toolbar: [
            // {text: '减员申请', func: () => { windowOpen('flow.html#/flow/iafDecreaseMemberFlow?processType=iafDecreaseMemberFlow') }},
            {text: '删除', type: 'danger', func: this.deleteRows, key: 'insInsuredHpfundDecreaseDelete'}
          ],     // 工具栏【可选】
          export: {
            config: {
              fileName: '公积金减员表',
              sync: {
                all: false
              }
            },
            req: config.fundQueryDeleteApplySearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredHpfundDecreaseExportPost'
          },
          import: {
            business: 'iaf-hpfundDecreaseImport',
            show: () => ({empty: false}),
            key: 'insInsuredHpfundDecreaseImportPost'
          }
        },
        data: null,   // 占位符，用于挂载数据【必填】
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
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, decreasingState: true})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('fundQueryDeleteApplySearch', Object.assign({}, options, this.newSearchData,
              {lastData: this.lastData, decreasingState: true}
            )
         )
        .then(res => {
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
    // 最新信息
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, decreasingState: true})
    },
    // 所有信息
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, decreasingState: true})
    },
    initLayout () {
      this.$refs.form && this.$refs.form.initLayout()
    },
    search (searchData) {
      this.newSearchData = searchData
      this.table.search = Object.assign({}, searchData, {lastData: this.lastData, decreasingState: true})
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.form.resetForm()
      this.lastData = false
    },
    receiveColumns (columns) {
      this.table.columns = columns
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
          req('hpfundDecreased', this.deleteArr).then(data => {
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
    // 每页显示的条数改变时
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    // 页数改变时
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
<style scoped>
  .content-card{
    padding: 10px;
  }
</style>
