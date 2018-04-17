<template>
  <div>
    <i-layout
      header-key = "insInsuredHpfundIncreasePost"
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
            <el-form-item label="申请地域:">
              <i-select-area v-model="searchData.applyArea" ref="selectArea"></i-select-area>
            </el-form-item>
            <el-form-item label="银行类型:">
              <i-select parameter="BANK_TYPE" v-model="searchData.cardType"></i-select>
            </el-form-item>
            <el-form-item label="增员原因:">
              <i-select parameter="IAF_ADD_REASON" v-model="searchData.applyReason"></i-select>
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
                v-if="col.show"
                :key="idx"
                :prop="col.prop"
                :min-width="col.width"
                :formatter="tableScope.formatter"
                :label="col.label"
                align="center"
              ></el-table-column>
            </el-table>
          </template>
        </i-table>
        <el-pagination
          v-show="pageVisible"
          @current-change="pageChange"
          class="center"
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
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
import iafSearch from 'components/iaf/search/iaf-search.vue'
import screen from 'components/iaf/fund/screen.vue'
import req, {config} from 'api/iaf/insurance-manage'
import ILayout from 'components/common/i-layout'
import ISelectArea from 'components/common/i-select-area'
// import { windowOpen } from 'utils'
import iafSearchMixin from 'mixins/compensation/iaf-search-mixin'

export default {
  components: {
    ITable,
    IForm,
    iafSearch,
    screen,
    ISelectArea,
    ILayout
  },
  mixins: [iafSearchMixin],
  data () {
    return {
      newSearchData: {},
      tableLoading: true,
      searchData: {
        applyReason: '',
        // positionName: '',
        // workingMonths: '',
        // age: '',
        increaseDate: '',
        applyArea: '',
        cardType: '',
        domicileType: '',
        increaseDateStart: '',
        increaseDateEnd: ''
      },
      increaseState: true, // 增员申请标识
      lastData: false,
      deleteArr: [],
      checkGroup: [],
      isIndeterminate: true,
      checkAll: false,
      loading: true,
      table: {
        title: '',     // 标题【可选】
        columns: [         // 表头【必填】
          { prop: 'employeeCode', label: '工号', show: true, width: '100' },
          { prop: 'fullName', label: '姓名', show: true, width: '100' },
          { prop: 'orgUnitName', label: '组织', show: true, width: '150' },
          { prop: 'personnelGroupName', label: '人事范围', show: true, width: '150' },
          { prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'} },
          { prop: 'positionName', label: '职位', show: true, width: '200' },
          { prop: 'hireDate', label: '入职日期', show: true, width: '150', display: {date: 'default'} },
          { prop: 'workingMonths', label: '司龄(月)', show: true, width: '100' },
          { prop: 'idNumber', label: '身份证号码', show: true, width: '200' },
          { prop: 'gender', label: '性别', show: true, width: '100', display: {dict: 'GENDER'} },
          { prop: 'age', label: '年龄', show: true, width: '100' },
          { prop: 'domicileType', label: '员工户口性质', show: true, width: '100', display: {dict: 'DOMICILE_TYPE'} },
          {prop: 'domicileGrade', label: '员工户口级别', show: true, width: '100', display: {dict: 'DOMICILE_LEVE'}},
          {prop: 'householdCode', label: '户头户口性质', show: true, width: '100', display: {dict: 'IAF_ACCOUNT_TYPE'}},
          { prop: 'cardType', label: '银行类型', show: true, width: '100', display: {dict: 'BANK_TYPE'} },
          { prop: 'cardId', label: '银行卡号', show: true, width: '200' },
          { prop: 'cardNumber', label: '一类建行卡号', show: true, width: '200' },
          { prop: 'empHpfundAccount', label: '公积金账号', show: true, width: '200' },
          { prop: 'mobile', label: '联系电话', show: true, width: '150' },
          { prop: 'accountCode', label: '户头代码', show: true, width: '200' },
          { prop: 'accountName', label: '户头名称', show: true, width: '100' },
          { prop: 'applyArea', label: '申请地域', show: true, width: '100' },
          { prop: 'applyReason', label: '原因', show: true, width: '100', display: {dict: 'IAF_ADD_REASON'} },
          {prop: 'remark', label: '备注提示', show: true, width: '100'},
          {prop: 'insuredStatus', label: '参保状态', show: true, width: '100', display: {dict: 'IAF_INSURED_STATUS'}},
          { prop: 'compPayBase', label: '公积金公司缴纳基数', show: true, width: '200' },
          { prop: 'empPayBase', label: '公积金个人缴纳基数', show: true, width: '200' },
          { prop: 'paymentMethods', label: '支付方式', show: true, width: '150', display: {dict: 'IAF_PAYMENT_TYPE'} },
          // { prop: 'salaryTotal', label: '工资总额', show: true, width: '150' },
          { prop: 'increaseDate', label: '申请日期', show: true, width: '150', display: {date: 'default'} },
          {prop: 'lastUpdateBy', label: '操作者', show: true, width: '100'},
          {prop: 'lastUpdateDate', label: '操作时间', show: true, width: '150', display: { date: 'default' }}
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          toolbar: [
            // {text: '增员挂靠', func: () => { windowOpen('flow.html#/flow/iafAddMemberFlow?processType=iafAddMemberFlow') }},
            {text: '删除', type: 'danger', func: this.deleteRows, key: 'insInsuredHpfundIncreaseDelete'}
          ],     // 工具栏【可选】
          export: {
            config: {
              fileName: '公积金增员表',
              sync: {
                all: false
              }
            },
            req: config.fundQueryAddSuccessSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredHpfundIncreaseExportPost'
          },
          import: [
            {
              text: '导入',
              business: 'iaf-hpfundIncreaseImport',
              show: () => ({empty: false}),
              key: 'insInsuredHpfundIncreaseImportPost'
            },
            {
              text: '调整基数',
              business: 'iaf-fundAddSuccessAdjustEmpBase',
              show: () => ({empty: false}),
              key: 'insInsuredHpfundIncreaseImportPost'
            }
          ]
        },
        data: null,   // 占位符，用于挂载数据【必填】
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      visible: false
    }
  },
  created () {
    this.lastData = false
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, increaseState: true})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('fundQueryAddSuccessSearch', Object.assign({}, options, this.newSearchData,
              {lastData: this.lastData, increaseState: true}
            )
         )
        .then(res => {
          Object.keys(res).map(key => (this.table[key] = res[key]))
          this.tableLoading = false
          this.loading = false
        })
        .catch(err => {
          this.tableLoading = false
          this.loading = false
          console.log(err)
        })
    },
    initLayout () {
      this.$refs.form && this.$refs.form.initLayout()
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    // 显示最新信息
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, increaseState: true})
    },
    // 显示所有信息
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, increaseState: true})
    },
    search (searchData) {
      this.newSearchData = searchData
      this.table.search = Object.assign({}, searchData, {lastData: this.lastData, increaseState: true})
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.form.resetForm()
      this.$refs.selectArea.deleteSelected()
      this.lastData = false
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
          req('hpfundIncreased', this.deleteArr).then(data => {
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
.el-checkbox-group{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  line-height: 5px;
}
.el-checkbox{
  width: 25%;
}
.el-checkbox+.el-checkbox{
  margin-left: 0px;
}
</style>
