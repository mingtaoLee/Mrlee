<template>
  <div>
  <i-layout
    :borderWidth="0"
    :margin="0"
    :headerPadding="0"
    :sectionPadding="0"
    header-key="insInsuredCommercialDecreaseGet"
    v-loading="loading"
    :element-loading-text="$loadingText"
  >
    <iaf-search
      access-key="insInsuredCommercialGet"
      slot="header"
      :additions="searchData"
      @search="search"
      @resetInputs="resetSearchData"
      @checckStatus= "checkStatusList"
      ref="form"
    >
        <!-- <el-form-item label="职位:">
          <el-input v-model="searchData.positionName"></el-input>
        </el-form-item>
        <el-form-item label="司龄(月):">
          <el-input v-model="searchData.seniority"></el-input>
        </el-form-item> -->
        <el-form-item label="户口性质:">
          <i-select clearable v-model="searchData.domicileType" parameter="DOMICILE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="人员类型:">
          <i-select clearable v-model="searchData.employeeType" parameter="EMPLOYEE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="减员原因:">
          <i-select clearable v-model="searchData.changingReason" parameter="IAF_ADD_REASON"></i-select>
        </el-form-item>
        <el-form-item label="申请开始时间">
          <el-date-picker
            v-model="searchData.decreasStratDate"
            :picker-options="applyStartDayOptions"
            @change="handleDateChange(searchData.decreasStratDate, 'searchData', 'decreasStratDate', 'string')"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请结束时间">
          <el-date-picker
            v-model="searchData.decreasEndDate"
            :picker-options="applyEndDayOptions"
            @change="handleDateChange(searchData.decreasEndDate, 'searchData', 'decreasEndDate', 'string')"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="年龄:">
          <el-input v-model="searchData.age"></el-input>
        </el-form-item> -->
      </iaf-search>
      <div slot="section" class="mt15">
        <i-table
          :table="table"
          ref="table"
          @pageSizeChange="deleteHandleSizeChange"
          @pageIndexChange="deleteHandleCurrentChange"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table
              @selection-change="selectionChange"
              :border="$$.table.border"
              :stripe="$$.table.stripe"
              :data="tableScope.clone"
              v-loading="tableLoading"
              :element-loading-text="$loadingText"
            >
              <el-table-column type="selection" :fixed="true"></el-table-column>
              <el-table-column min-width="100" align="center" prop="employeeCode" label="工号"></el-table-column>
              <el-table-column min-width="100" align="center" prop="fullName" label="姓名"></el-table-column>
              <el-table-column
                v-for="(item,index) in tableScope.columns"
                :key="index"
                align="center"
                :min-width="item.width"
                :prop="item.prop"
                :label="item.label"
                v-if="item.show"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table>
          </template>
        </i-table>
        <screen v-model="visible" :columns="table.columns" @receiveColumns="receiveColumns"></screen>
      </div>
      </i-layout>
  </div>
</template>
<script>
import IForm from 'components/common/i-form/i-form.vue'
import ITable from 'components/common/i-table'
import ISelect from 'components/common/i-select/i-select.vue'
import orgDialog from '@/mixins/orgDialog'
import IafSearch from 'components/iaf/search/iaf-search'
import screen from 'components/iaf/fund/screen'
import req, {config} from 'api/iaf/insurance-manage'
import ILayout from 'components/common/i-layout'
import access from 'mixins/access'
import moment from 'moment'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
export default {
  data () {
    return {
      visible: false,
      lastData: false,
      // decreasDate: '',
      cmlInsuredStatus: '',
      loading: true,
      tableLoading: true,
      newSearchData: {},
      deleteArr: [],
      searchData: {
        // seniority: '',
        // age: '',
        decreasStratDate: '',
        decreasEndDate: '',
        changingReason: '',
        domicileType: '',
        // positionName: '',
        employeeType: ''
      },
      // 减员申请列表
      table: {
        columns: [
          // {prop: 'employeeCode', label: '工号', show: true},
          // {prop: 'fullName', label: '姓名', show: true},
          {prop: 'orgUnitName', label: '组织', show: true, width: '200'},
          {prop: 'personnelGroupName', label: '人事范围', show: true, width: '100'},
          {prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'}},
          {prop: 'positionName', label: '职位', show: true, width: '200'},
          {prop: 'hireDate', label: '入职日期', show: true, width: '150', display: {date: 'default'}},
          {prop: 'seniority', label: '司龄(月)', show: true, width: '100'},
          {prop: 'idNumber', label: '身份证号', show: true, width: '200'},
          {prop: 'gender', label: '性别', show: true, width: '100', display: {dict: 'GENDER'}},
          {prop: 'age', label: '年龄', show: true, width: '100'},
          {prop: 'domicileType', label: '户口性质', show: true, width: '100', display: {dict: 'DOMICILE_TYPE'}},
          {prop: 'employeeType', label: '人员类型', show: true, width: '100', display: {dict: 'EMPLOYEE_TYPE'}},
          {prop: 'accountCode', label: '户头代码', show: true, width: '200'},
          {prop: 'accountName', label: '户头名称', show: true, width: '150'},
          {prop: 'changingReason', label: '变更原因', show: true, width: '150', display: {dict: 'IAF_REASONS_FOR_BUSINESS_RISK_CHANGE'}},
          {prop: 'decreasDate', label: '申请时间', show: true, width: '150', display: {date: 'default'}}
        ],
        setting: {
          toolbar: [
            // {text: '导入减员成功记录', func: this.deleteSuccessMsg},
            // {text: '查看最新状态信息', func: this.showNewMsg},
            // {text: '查看所有状态信息', func: this.showAllMsg},
            // {text: '筛选', func: this.pick},
            {text: '删除', type: 'danger', func: this.tableDeleteBtn, key: 'insInsuredCommercialDecreaseDelete'}
          ],
          export: {
            config: {
              fileName: '商业险减员表'
            },
            req: config.insuredDeleteSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredCommercialDecreaseExportGet'
          },
          import: {
            business: 'Iaf-CommercialRecordPlusDelete',
            show: () => ({empty: false}),
            key: 'insInsuredCommercialDecreaseImportPost'
          }
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      }
    }
  },
  created () {
    this.lastData = false
    this.cmlInsuredStatus = '04'
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('insuredDeleteSearch', Object.assign({}, options, this.searchData,
              {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus}
            )
         )
        .then(res => {
          res.data.forEach(dataVal => {
            dataVal.hireDate = moment(dataVal.hireDate).format('YYYY-MM-DD') || ''
            dataVal.decreasDate = moment(dataVal.decreasDate).format('YYYY-MM-DD') || ''
          })
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
     // ****减员列表****
    deleteHandleSizeChange (options) {
      this.fetch(options)
    },
    deleteHandleCurrentChange (options) {
      this.fetch(options)
    },
    tableDeleteBtn () {
      if (this.deleteArr.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条记录'
        })
      } else {
        this.$confirm('确认删除？').then(() => {
          req('addRequestDelete', this.deleteArr).then(data => {
            if (data === true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.search()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {})
      }
    },
    selectionChange (val) {
      this.deleteArr = val.map(item => {
        return item.commercialRecordId
      })
    },
    resetSearchData () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.decreasDate = ''
      this.$refs.form.resetForm()
      this.lastData = false
    },
    initLayout () {
      this.$refs.form.initLayout()
    },
    eachForm () {
      for (var key in this.newSearchData) {
        if (this.newSearchData[key]) {
          this.lastData = false
        }
      }
    },
    search (commonSearchData) {
      this.table.search = Object.assign({}, this.searchData, commonSearchData, {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus})
    },
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus})
      // this.fetch(this.table.info)
    },
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus})
      // this.fetch(this.table.info)
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    pick () {
      this.visible = true
    },
    checkStatusList (val) {
      if (val === 'checkNewStatus') {
        this.showNewMsg()
      } else {
        this.showAllMsg()
      }
    }
  },
  components: {
    IForm,
    IafSearch,
    ITable,
    ISelect,
    screen,
    ILayout
  },
  mixins: [orgDialog, access, IafSearchMixin]
}
</script>
<style lang="scss" scoped>

</style>
