<template>
  <i-layout 
    :headerPadding="0" 
    :borderWidth="0" 
    :margin="0"  
    :sectionPadding="0"  
    :titlePadding="3"
    header-key="backUpsPost"
    v-loading="loading"
    :element-loading-text="$loadingText"
  >
    <template slot="header">
      <i-form @reset="resetInputs" @search="search" ref="form">
        <el-form-item label="工号:">
          <el-input v-model="searchData.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="searchData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="组织:">
          <el-input v-model="searchData.orgUnitName"></el-input>
        </el-form-item>
        <el-form-item label="人事范围:">
          <el-input v-model="searchData.personnelGroupName"></el-input>
        </el-form-item>
        <el-form-item label="补退开始日期:">
          <el-date-picker
            type="month"
            v-model="searchData.payStartMonth"
            placeholder="选择日期"
            :picker-options="payStartMonthOptions"
            @change="handleDateChange(searchData.payStartMonth, 'searchData', 'payStartMonth', 'string')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="补退结束日期:">
          <el-date-picker
            type="month"
            v-model="searchData.payEndMonth"
            placeholder="选择日期"
            :picker-options="payEndMonthOptions"
            @change="handleDateChange(searchData.payEndMonth, 'searchData', 'payEndMonth', 'string')"
          ></el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <div slot="section" class="mt15">
      <i-table
        @pageSizeChange="addHandleSizeChange"
        @pageIndexChange="addHandleCurrentChange"
        :table="table"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            v-loading="tableLoading"
            :element-loading-text="$loadingText"
            @selection-change="handleChange"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, idx) of tableScope.columns"
              :key="idx"
              :prop="col.prop"
              :min-width="col.width"
              align="center"
              :label="col.label"
              :formatter="tableScope.formatter"
            >
              <el-table-column
                v-for="(item, index) in col.children"
                :width="item.width"
                align="center"
                :prop="item.prop"
                :label="item.label"
                :key="index"
                :formatter="tableScope.formatter"
              ></el-table-column>
                <!-- <el-table-column
                  v-if="colScope.prop === 'filloutindividual'"
                  label="养老"
                  align="left"
                  width="100"
                  prop="oldageShouldsendFilloutindividual"
                  :formatter="tableScope.formatter"
                ></el-table-column> -->
            </el-table-column>
            <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <apap-dialog
        @cancel="closeDialog"
        @confirm="confirm"
        ref="apapDialog"
        :title="dialogTitle"
        :isDialogShow="dialogShow"
        :isEdit="isEdit"
        :dialogForm.sync="dialogFormData"
        :tableData="tableData"
      ></apap-dialog>
    </div>
  </i-layout>
</template>
<script>
import ITableOperator from 'components/common/i-table-operator'
import ApapDialog from './dialog/apap-dialog.vue'
import req, {config} from 'api/iaf/social-security'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
// import moment from 'moment'
export default {
  name: 'ReturnTable',
  components: {
    ITableOperator,
    ApapDialog
  },
  mixins: [IafSearchMixin],
  data () {
    return {
      deleteArr: [],
      // 控制zero-dialog
      dialogShow: false,
      dialogTitle: '',
      tableLoading: true,
      isEdit: false,
      loading: true,
      tableData: {
        otherInsuranceList: []
      },
      requestCheck: '', // 请求接口标识
      table: {
        title: '',
        columns: [
          {prop: 'employeeCode', label: '工号', width: '150'},
          {prop: 'fullName', label: '姓名', width: '150'},
          {prop: 'orgUnitName', label: '组织', width: '200'},
          {prop: 'personnelGroupName', label: '人事范围', width: '100'},
          {prop: 'payMonth', label: '补退日期', width: '150', display: {date: 'short'}},
          {label: '个人补退',
            prop: 'filloutindividual',
            children: [
              {prop: 'oldageShouldsendFilloutindividual', label: '养老', width: '100'},
              {prop: 'healthinsuranceShouldsendFilloutindividual', label: '医疗', width: '100'},
              {prop: 'workinjuryShouldsendFilloutindividual', label: '工伤', width: '100'},
              {prop: 'fertilityShouldsendFilloutindividual', label: '生育', width: '100'},
              {prop: 'outofworkShouldsendFilloutindividual', label: '失业', width: '100'},
              {prop: 'providentfundShouldsendFilloutindividual', label: '公积金', width: '100'},
              {prop: 'supplementarymedicaltreatmentCompanytopayCompanytoundertake', label: '大病补医保', width: '100'},
              {prop: 'supplementaryinjuryCompanytopayCompanypayment', label: '补充工伤', width: '100'}
            ]
          },
          {label: '公司补退',
            prop: 'companytofillout',
            children: [
              {prop: 'oldageCompanyreceivableCompanytofillout', label: '养老', width: '100'},
              {prop: 'healthinsuranceCompanyreceivableCompanytofillout', label: '医疗', width: '100'},
              {prop: 'workinjuryCompanyreceivableCompanytofillout', label: '工伤', width: '100'},
              {prop: 'fertilityCompanyreceivableCompanytofillout', label: '生育', width: '100'},
              {prop: 'outofworkCompanyreceivableCompanytofillout', label: '失业', width: '100'},
              {prop: 'providentfundCompanyreceivableCompanytofillout', label: '公积金', width: '100'},
              {prop: 'supplementarymedicaltreatmentWithholdingPersonalpayment', label: '大病补医保', width: '100'},
              {prop: 'supplementaryinjuryCompanytopayCompanytoundertake', label: '补充工伤', width: '100'}
            ]
          },
          {label: '养老户头代码', prop: 'oldageAccountCode', width: '100'},
          {label: '失业户头代码', prop: 'outofworkAccountCode', width: '200'},
          {label: '生育户头代码', prop: 'fertilityAccountCode', width: '150'},
          {label: '工伤户头代码', prop: 'workinjuryAccountCode', width: '200'},
          {label: '医疗户头代码', prop: 'healthinsuranceAccountCode', width: '200'},
          {label: '公积金户头代码', prop: 'providentfundAccountCode', width: '200'},
          {label: '大病补医保户头代码', prop: 'supplementarymedicaltreatmentAccountCode', width: '200'},
          {label: '补充工伤户头代码', prop: 'supplementaryinjuryAccountCode', width: '200'}
        ],
        setting: {
          toolbar: [
            {
              text: '新增',
              key: 'backUpPost',
              func: this.addRecord
            },
            {
              text: '删除',
              key: 'backUpDeletesDelete',
              func: this.deleteRecord
            }
          ],
          import: {
            business: 'iaf-insBackUpImport',
            key: 'importInsBackUpRecordPost',
            show: () => ({empty: false})
          },
          export: {
            config: {
              fileName: '补退表'
            },
            key: 'backUpBackUpsPost',
            req: config.backUps
          },
          operator: [
            {
              text: '修改',
              key: 'backUpOtherRecordIdPost',
              func: this.editRow
            },
            {
              text: '删除',
              key: 'deletesPost',
              func: this.deleteRow
            }
          ]
        },
        data: [],
        info: null,
        total: 0,
        multiple: true,
        search: null,
        showPagebar: true
      },
      // 高级搜索
      searchData: {
        employeeCode: '',
        fullName: '',
        orgUnitName: '',
        personnelGroupName: '',
        payStartMonth: '',
        payEndMonth: ''
      },
      // 弹出框表单数据
      dialogFormData: {
        employeeCode: '',
        fullName: '',
        orgUnitName: '',
        personnelGroupName: '',
        payMonth: ''
      }
    }
  },
  created () {
    this.getMultipleColumns()
  },
  mounted () {
    this.table.search = Object.assign({}, this.searchData)
  },
  methods: {
    fetch (options = {}) {
      this.tableLoading = true
      req('backUps', Object.assign({}, options, this.searchData))
        .then(res => {
          Object.keys(res).map(key => {
            this.getMultipleData(res.data)
            this.table[key] = res[key]
          })
          this.loading = false
          this.tableLoading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.tableLoading = false
        })
    },
    initLayout () {
      this.$refs.form.initLayout()
    },
    closeDialog () {
      this.dialogShow = false
    },
    openDialog () {
      this.initApapDialog()
      // this.$refs.apapDialog.resetForm()
      this.dialogShow = true
    },
    confirm (data) {
      let submitData = Object.assign({}, this.dialogFormData)
      submitData.otherInsuranceList = data.map(item => {
        item && delete item._id
        return item
      })
      if (this.requestCheck === 'add') {
        req('backUp', submitData)
        .then(data => {
          if (data === true) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.fetch(this.table.info)
            this.closeDialog()
          } else {
            this.$message({
              type: 'error',
              message: '新增失败'
            })
          }
          this.$refs.apapDialog.toolbar[1].loading = false
        })
        .catch(() => (this.$refs.apapDialog.toolbar[1].loading = false))
      } else if (this.requestCheck === 'update') {
        req('backU', submitData)
        .then(data => {
          if (data === true) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.fetch(this.table.info)
            this.closeDialog()
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          }
          this.$refs.apapDialog.toolbar[1].loading = false
        })
        .catch(() => (this.$refs.apapDialog.toolbar[1].loading = false))
      }
      // this.dialogShow = false
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    search () {
      // this.searchData.payStartMonth && (this.searchData.payStartMonth = moment(this.searchData.payStartMonth).format('YYYY-MM-DD'))
      // this.searchData.payEndMonth && (this.searchData.payEndMonth = moment(this.searchData.payEndMonth).format('YYYY-MM-DD'))
      this.table.search = Object.assign({}, this.searchData)
    },
    // 修改记录
    editRow (row) {
      req('getTableList', {backUpRecordId: row.otherRecordId})
      .then(data => {
        this.openDialog()
        this.tableData.otherInsuranceList = data.otherInsuranceList
        this.requestCheck = 'update'
        this.isEdit = false
        data.payMonth = new Date(data.payMonth)
        Object.assign(this.dialogFormData, data, {otherRecordId: row.otherRecordId})
        this.dialogTitle = '修改补退信息'
      })
    },
    // 初始化apap-dialog
    initApapDialog () {
      this.isEdit = false
      this.dialogTitle = ''
      for (let key in this.dialogFormData) {
        this.dialogFormData[key] = ''
      }
      this.tableData.otherInsuranceList = []
    },
    // 删除一行
    deleteRow (row) {
      // {employeeCode: row.employeeCode, payMonth: new Date(row.payMonth)}
      this.$confirm('确认删除？').then(() => {
        req('deletes', [row.otherRecordId]).then(data => {
          if (data > 0) {
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
      })
    },
    // 增加记录
    addRecord () {
      this.requestCheck = 'add'
      this.openDialog()
      this.dialogTitle = '新增补退信息'
    },
    // 批量删除记录
    deleteRecord () {
      if (this.deleteArr.length === 0) {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      } else {
        this.$confirm('确认删除？').then(() => {
          req('deletes', this.deleteArr).then(data => {
            if (data > 0) {
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
        })
      }
    },
    handleChange (val) {
      this.deleteArr = val.map(item => {
        return item.otherRecordId
        // return {employeeCode: item.employeeCode, payMonth: item.payMonth}
      })
    },
    addHandleSizeChange (options) {
      this.fetch(options)
    },
    addHandleCurrentChange (options) {
      this.fetch(options)
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-font{
  font-size:16px;
  position:relative;
  top:-5px;
  font-weight:bold;
}
.content-card{
  padding:10px;
}
</style>
