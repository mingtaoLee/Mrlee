<template>
  <div>
    <i-layout
      :borderWidth="0"
      :margin="0"
      :headerPadding="0"
      :sectionPadding="0"
      header-key="insInsuredCommercialIncreaseGet"
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
      </el-form-item>
      <el-form-item label="年龄:">
        <el-input v-model="searchData.age"></el-input>
      </el-form-item> -->
      <el-form-item label="户口性质:">
        <i-select clearable v-model="searchData.domicileType" parameter="DOMICILE_TYPE"></i-select>
      </el-form-item>
      <el-form-item label="原因:">
        <i-select clearable v-model="searchData.changingReason" parameter="IAF_ADD_REASON"></i-select>
      </el-form-item>
      <el-form-item label="申请地域:">
        <!-- <el-input v-model="searchData.areaCode"></el-input> -->
        <i-select-area v-model="searchData.areaCode" ref="selectArea"></i-select-area>
      </el-form-item>
      <el-form-item label="人员类型:">
        <i-select clearable v-model="searchData.employeeType" parameter="EMPLOYEE_TYPE"></i-select>
      </el-form-item>
      <el-form-item label="工伤参保状态:">
        <i-select clearable v-model="searchData.injuryInsuredStatus" parameter="IAF_INSURED_STATUS"></i-select>
      </el-form-item>
      <!-- <el-form-item label="商业险参保状态:">
        <i-select clearable v-model="searchData.cmlInsuredStatus" parameter="IAF_INSURED_STATUS"></i-select>
      </el-form-item> -->
      <el-form-item label="申请开始日期:">
        <el-date-picker
            v-model="searchData.increaseStratDate"
            :picker-options="increaseStartDateOptions"
            @change="handleDateChange(searchData.increaseStratDate, 'searchData', 'increaseStratDate', 'string')"
            type="date"
            placeholder="选择日期:">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="申请结束日期:">
        <el-date-picker
            v-model="searchData.increaseEndDate"
            :picker-options="increaseEndDateOptions"
            @change="handleDateChange(searchData.increaseEndDate, 'searchData', 'increaseEndDate', 'string')"
            type="date"
            placeholder="选择日期:">
          </el-date-picker>
      </el-form-item>
    </iaf-search>
    <div slot="section" class="mt15">
      <i-table
        :table="table"
        ref="table"
        @pageSizeChange="addHandleSizeChange"
        @pageIndexChange="addHandleCurrentChange"
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
                :prop="item.prop"
                :label="item.label"
                align="center"
                :min-width="item.width"
                :formatter="tableScope.formatter"
                v-if="item.show"
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
import ISelect from 'components/common/i-select/i-select.vue'
import ITable from 'components/common/i-table'
import orgDialog from '@/mixins/orgDialog'
import IafSearch from 'components/iaf/search/iaf-search'
import screen from 'components/iaf/fund/screen'
import req, {config} from 'api/iaf/insurance-manage'
import ILayout from 'components/common/i-layout'
import access from 'mixins/access'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
import ISelectArea from 'components/common/i-select-area'
export default {
  data () {
    return {
      visible: false,
      deleteArr: [],
      lastData: false,
      cmlInsuredStatus: '', // 增员标识
      newSearchData: {},
      tableLoading: true,
      loading: true,
      // increaseDate: '',
      searchData: {
        // positionName: '',
        // seniority: '',
        // age: '',
        domicileType: '',
        increaseStratDate: '',
        increaseEndDate: '',
        areaCode: '',
        changingReason: '',
        employeeType: '',
        injuryInsuredStatus: ''
      },
      // 增员申请列表
      table: {
        title: '',
        columns: [
          {prop: 'orgUnitName', label: '组织', show: true, width: '200'},
          {prop: 'personnelGroupName', label: '人事范围', show: true, width: '100'},
          {prop: 'employeeStatus', label: '员工状态', show: true, width: '100', display: {dict: 'EMPLOYEE_STATUS'}},
          {prop: 'positionName', label: '职位', show: true, width: '200'},
          {prop: 'hireDate', label: '入职日期', show: true, width: '200', display: {date: 'default'}},
          {prop: 'seniority', label: '司龄(月)', show: true, width: '100'},
          {prop: 'idNumber', label: '身份证号', show: true, width: '200'},
          {prop: 'gender', label: '性别', show: true, width: '100', display: {dict: 'GENDER'}},
          {prop: 'age', label: '年龄', show: true, width: '100'},
          {prop: 'domicileType', label: '户口性质', show: true, width: '100', display: {dict: 'DOMICILE_TYPE'}},
          {prop: 'employeeType', label: '人员类型', show: true, width: '100', display: {dict: 'EMPLOYEE_TYPE'}},
          {prop: 'insuranceCompanyName', label: '保险公司名称', show: true, width: '100'},
          {prop: 'accountName', label: '户头名称', show: true, width: '200'},
          {prop: 'areaCode', label: '申请地域', show: true, width: '150'},
          {prop: 'changingReason', label: '变更原因', show: true, width: '150', display: {dict: 'IAF_REASONS_FOR_BUSINESS_RISK_CHANGE'}},
          {prop: 'injuryInsuredStatus', label: '工伤参保状态', show: true, width: '150', display: {dict: 'IAF_INJURY_STATUS'}},
          {prop: 'cmlInsuredStatus', label: '商业险参保状态', show: true, width: '150', display: {dict: 'IAF_INSURED_STATUS'}},
          {prop: 'increaseDate', label: '申请日期', show: true, width: '200', display: { date: 'default' }}
        ],
        setting: {
          toolbar: [
            {text: '删除', type: 'danger', func: this.tableDeleteBtn, key: 'insInsuredCommercialIncreaseDelete'}
          ],
          export: {
            config: {
              fileName: '商业险增员表'
            },
            req: config.insuredAddSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'insInsuredCommercialIncreaseExportGet'
          },
          import: {
            business: 'Iaf-CommercialRecordPlus',
            show: () => ({empty: false}),
            key: 'insInsuredCommercialIncreaseImportPost'
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
    this.cmlInsuredStatus = '02'
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus})
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('insuredAddSearch', Object.assign({}, options, this.searchData,
              {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus}
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
    selectionChange (row) {
      this.deleteArr = row.map(item => {
        return item.commercialRecordId
      })
    },
    // ****增员列表****
    addHandleSizeChange (options) {
      this.fetch(options)
    },
    addHandleCurrentChange (options) {
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
    resetSearchData () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
      this.increaseDate = ''
      this.$refs.form.resetForm()
      this.lastData = false
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
    initLayout () {
      this.$refs.form.initLayout()
    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    showNewMsg () {
      this.lastData = true
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus})
      // this.fetch(this.table.info)
      // this.search()
    },
    showAllMsg () {
      this.lastData = false
      this.table.search = Object.assign({}, this.searchData, {lastData: this.lastData, cmlInsuredStatus: this.cmlInsuredStatus})
      // this.fetch(this.table.info)
      // this.search()
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
  watch: {
    increaseDate () {
      // this.searchData.increaseStratDate = this.increaseDate[0]
      // this.searchData.increaseEndDate = this.increaseDate[0]
    }
  },
  components: {
    IForm,
    IafSearch,
    ITable,
    ISelect,
    screen,
    ILayout,
    ISelectArea
  },
  mixins: [orgDialog, access, IafSearchMixin]
}
</script>
<style lang="scss" scoped>

</style>
