<template>
    <i-layout
      :borderWidth="0"
      :margin="0"
      :headerPadding="0"
      :sectionPadding="0"
      header-key="insInsuredHpfundPost"
      v-loading="loading"
      :element-loading-text="$loadingText"
    >
    <div slot="header">
      <iaf-search 
        ref="form" 
        @resetInputs="resetInputs" 
        :additions="searchData"
        :isShowItem="false" 
        @search="searchReq" 
        @checckStatus= "checkStatusList"
      >
        <template>
          <!-- <el-form-item label="司龄(月):">
            <el-input v-model="searchData.workingMonths"></el-input>
          </el-form-item>
          <el-form-item label="年龄:">
            <el-input v-model="searchData.age"></el-input>
          </el-form-item>
          <el-form-item label="职位:">
            <el-input v-model="searchData.positionName"></el-input>
          </el-form-item> -->
          <el-form-item label="员工户口性质:">
            <i-select clearable v-model="searchData.domicileType" parameter="DOMICILE_TYPE"></i-select>
          </el-form-item>
          <el-form-item label="生效开始日期:">
            <el-date-picker
              type="date"
              v-model="searchData.effectiveStartDate"
              placeholder="选择日期"
              :editable="false"
              :picker-options="effectiveStartDateOptions"
              @change="handleDateChange(searchData.effectiveStartDate, 'searchData', 'effectiveStartDate', 'string')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="生效结束日期:">
            <el-date-picker
              type="date"
              v-model="searchData.effectiveEndDate"
              placeholder="选择日期"
              :editable="false"
              :picker-options="effectiveEndDateOptions"
              @change="handleDateChange(searchData.effectiveEndDate, 'searchData', 'effectiveEndDate', 'string')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="失效开始日期:">
            <el-date-picker
              type="date"
              v-model="searchData.uneffectiveStartDate"
              placeholder="选择日期"
              :editable="false"
              :picker-options="uneffectiveStartDateOptions"
              @change="handleDateChange(searchData.uneffectiveStartDate, 'searchData', 'uneffectiveStartDate', 'string')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="失效结束日期:">
            <el-date-picker
              type="date"
              v-model="searchData.uneffectiveEndDate"
              placeholder="选择日期"
              :editable="false"
              :picker-options="uneffectiveEndDateOptions"
              @change="handleDateChange(searchData.uneffectiveEndDate, 'searchData', 'uneffectiveEndDate', 'string')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="银行类型:">
            <i-select parameter="BANK_TYPE" v-model="searchData.cardType"></i-select>
          </el-form-item>
          <el-form-item label="参保状态:">
            <i-select parameter="IAF_INSURED_STATUS" v-model="searchData.insuredStatus"></i-select>
          </el-form-item>
          <el-form-item label="不参保类型:">
            <i-select parameter="NO_INSURED_TYPE" v-model="searchData.notInsuredType"></i-select>
          </el-form-item>
        </template>
      </iaf-search>
    </div>
    <div slot="section" class="mt15">
      <i-table
        :table="table"
        @pageSizeChange="searchHandleSizeChange"
        @pageIndexChange="searchHandleCurrentChange"
        @save="getTableData"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :border="$$.table.border"
            :stripe="$$.table.stripe"
            :data="tableScope.clone"
            @sort-change="sortChange"
            @selection-change="selectionChangeHandler(tableScope, $event)"
            @current-change="handleCurrentChange"
            v-loading="tableLoading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, idx) of tableScope.columns || []"
              v-if="col.show"
              :key="idx"
              :prop="col.prop"
              align="center"
              :formatter="tableScope.formatter"
              :sortable="col.custom"
              :min-width="col.width"
              :label="col.label">
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <el-pagination
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        v-show="pageVisible"
        class="center"
        @current-change="pageChange">
      </el-pagination>
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
import iafSearch from 'components/iaf/search/iaf-search.vue'
import req, {config} from 'api/iaf/insurance-manage'
import Screen from 'components/iaf/fund/screen'
import ILayout from 'components/common/i-layout'
import { windowOpen } from 'utils'
import iafSearchMixin from 'mixins/compensation/iaf-search-mixin'
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
      newSearchData: {},
      // effectiveDate: '',
      // uneffectiveDate: '',
      searchData: {
        // workingMonths: '',
        // age: '',
        // positionName: '',
        cardType: '',
        domicileType: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        uneffectiveStartDate: '',
        uneffectiveEndDate: '',
        insuredStatus: '',
        notInsuredType: ''
      },
      loading: true,
      tableLoading: true,
      lastData: false,
      visible: false,
      activeName: 'third',
      table: {
        title: '',     // 标题【可选】
        columns: [         // 表头【必填】
          {prop: 'employeeCode', label: '工号', show: true, width: '100'},
          {prop: 'fullName', label: '姓名', show: true, width: '100'},
          {prop: 'orgUnitName', label: '组织', custom: false, show: true, width: '150'},
          {prop: 'personnelGroupName', label: '人事范围', custom: false, width: '120', show: true},
          {prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'}},
          {prop: 'positionName', label: '职位', width: '150', show: true},
          {prop: 'hireDate', label: '入职日期', show: true, width: '150', display: {date: 'default'}},
          {prop: 'workingMonths', label: '司龄(月)', show: true, width: '100'},
          {prop: 'idNumber', label: '身份证号', show: true, width: '200'},
          {prop: 'gender', label: '性别', show: true, width: '100', display: {dict: 'GENDER'}},
          {prop: 'age', label: '年龄', show: true, width: '100'},
          {prop: 'domicileType', label: '员工户口性质', show: true, width: '100', display: {dict: 'DOMICILE_TYPE'}},
          {prop: 'domicileGrade', label: '员工户口级别', show: true, width: '100', display: {dict: 'DOMICILE_LEVE'}},
          {prop: 'householdCode', label: '户头户口性质', show: true, width: '100', display: {dict: 'IAF_ACCOUNT_TYPE'}},
          {prop: 'cardType', label: '银行类型', show: true, width: '100', display: {dict: 'BANK_TYPE'}},
          {prop: 'cardId', label: '银行卡号', show: true, width: '200'},
          {prop: 'cardNumber', label: '一类建行卡号', show: true, width: '200'},
          {prop: 'empHpfundAccount', label: '公积金账号', show: true, width: '200'},
          {prop: 'accountCode', label: '户头代码', show: true, width: '200'},
          {prop: 'accountName', label: '户头名称', show: true, width: '100'},
          {prop: 'effectiveDate', label: '生效日期', show: true, width: '150', display: {date: 'default'}},
          {prop: 'uneffectiveDate', label: '失效日期', show: true, width: '150', display: {date: 'default'}},
          {prop: 'paymentMethods', label: '支付方式', show: true, width: '150', display: {dict: 'IAF_PAYMENT_TYPE'}},
          {prop: 'insuredStatus', label: '参保状态', show: true, width: '100', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'notInsuredType', label: '不参保类型', show: true, width: '150', display: {dict: 'NO_INSURED_TYPE'}},
          {prop: 'compPayBase', label: '单位缴纳基数', show: true, width: '150'},
          {prop: 'empPayBase', label: '个人缴纳基数', show: true, width: '150'},
          {prop: 'compPayRatio', label: '单位缴纳比例(%)', show: true, width: '150'},
          {prop: 'empPayRatio', label: '个人缴纳比例(%)', show: true, width: '150'},
          {prop: 'empPaySupplyment', label: '个人补充公积金', show: true, width: '150'},
          {prop: 'lastUpdateBy', label: '操作者', show: true, width: '100'},
          {prop: 'lastUpdateDate', label: '操作时间', show: true, width: '150', display: {date: 'default'}}
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          // toolbar: [
          //   {text: '发送增员申请通知', func: this.sendAddMsg, key: 'insInsuredHpfundNotificationPost'}
          // ],     // 工具栏【可选】
          export: {
            config: {
              fileName: '公积金参保查询表',
              sync: {
                all: false
              }
            },
            req: config.fundQuerySearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredHpfundExport'
          }
        },
        data: null,  // 占位符，用于挂载数据【必填】
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      }
    }
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('fundQuerySearch', Object.assign({}, options, this.newSearchData, {lastData: this.lastData}))
      .then(
        res => {
          this.table = Object.assign(this.table, res)
          this.tableLoading = false
          this.loading = false
        }
      )
      .catch(err => {
        console.log(err)
        this.tableLoading = false
        this.loading = false
      })
    },
    sendAddMsg () {
      windowOpen('/flow.html#/flow/iafAdd', {processType: 'iafAdd'})
    },
    // 查看最新信息
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
    },
    // 查看所有信息
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData})
    },
    searchReq (searchData) {
      this.newSearchData = searchData
      this.table.search = Object.assign({}, searchData, {lastData: this.lastData})
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.form.resetForm()
      this.lastData = false
      this.table.search.lastData = false
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    // 每页显示的条数改变时
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    // 页数改变时
    searchHandleCurrentChange (options) {
      this.fetch(options)
    },
    pick () {
      this.visible = true
    },
    initLayout () {
      this.$refs.form && this.$refs.form.initLayout()
    },
    sortChange (row) {
      let sendSortData = {orderByProperty: row.prop, orderStrategy: this.order}
      if (row.order === 'ascending') {
        sendSortData = {orderByProperty: row.prop, orderStrategy: true}
      } else if (row.order === 'descending') {
        sendSortData = {orderByProperty: row.prop, orderStrategy: false}
      } else if (row.order === null) {
        sendSortData = {orderByProperty: row.prop, orderStrategy: true}
      }
      let submitData = Object.assign({}, this.newSearchData,
        {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }
      )
      req('fundQuerySearch', Object.assign({}, sendSortData, submitData)).then(data => {
        this.table.data = data.data
      })
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
