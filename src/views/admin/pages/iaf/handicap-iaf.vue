<template>
  <i-layout>
    <div slot="header" header-key="insExternalHandicappedGet">
      <i-form @reset="resetInputs" @search="search">
        <el-form-item label="姓名:">
          <el-input v-model="formData.payerName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:">
          <el-input v-model="formData.payerIdNumber"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input v-model="formData.payerPhone"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="formData.payerGender" placeholder="请选择性别">
            <el-option label="男" key="男" value="男"></el-option>
            <el-option label="女" key="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴纳月份:" placeholder="请选择月份">
          <el-date-picker 
            type="month" 
            v-model="formData.payMonth" 
            @change="handleDateChange(formData.payMonth, 'formData', 'payMonth', 'string', 'YYYY-MM-DD hh:mm:ss')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="户头代码:">
          <el-input v-model="formData.endowmentAccountCode"></el-input>
        </el-form-item>
      </i-form>
    </div>
    <div slot="section">
      <i-table
        @pageSizeChange="searchHandleSizeChange"
        @pageIndexChange="searchHandleCurrentChange"
        @save="getTableData"
        :table="table"
        ref="table"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            @selection-change="getDeleteArr"
            :data="tableScope.clone"
            v-loading="loading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, idx) of tableScope.columns"
              :prop="col.prop"
              :label="col.label"
              :key="idx"
              :width="col.width"
              align="center"
              :formatter="tableScope.formatter"
            >
              <el-table-column
                v-for="(item, index) of col.children"
                :prop="item.prop"
                :label="item.label"
                :key="index"
                align="center"
                :width="item.width"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <hand-dialog
        @cancel="cancel"
        @confirm="confirm"
        ref="handDialog"
        :formData.sync="dialogFormData"
        :tableData="dialogTableData"
        :visible="dialogShow"
        :editInput="editInput"
        :titleshow="titleshow"
        :requestCheck="requestCheck"
      ></hand-dialog>
      <screen v-model="receiveVisible" :columns="table.columns" @receiveColumns="receiveColumns"></screen>
    </div>
  </i-layout>
</template>
<script>
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form.vue'
import Screen from 'components/iaf/fund/screen'
import HandDialog from 'components/iaf/handicap-iaf/hand-dialog'
import ILayout from 'components/common/i-layout'
import req, { config } from 'api/iaf/external-data'
import ITableOperator from 'components/common/i-table-operator'
import moment from 'moment'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
export default {
  name: 'HangicapIaf',
  components: {
    ITable,
    IForm,
    Screen,
    ILayout,
    ITableOperator,
    HandDialog
  },
  mixins: [IafSearchMixin],
  data () {
    return {
      flag: false,
      monthEidt: '',
      dialogShow: false,
      lastData: true,
      receiveVisible: false,
      editInput: false,
      loading: false,
      titleshow: false,
      requestCheck: '',
      formLabelWidth: '120px',
      deleteArr: [],
      // 高级查询表单数据
      formData: {
        payerName: '',
        payerIdNumber: '',
        payerPhone: '',
        payerGender: '',
        payMonth: '',
        endowmentAccountCode: ''
      },
      // 弹窗表单数据
      dialogFormData: {
        payerName: '',
        payerGender: '',
        payerIdNumber: '',
        payerPhone: '',
        payMonth: '',
        prepareMonthly: new Date(),
        allottedDate: new Date(),
        totalValue: 0,
        iafHandicappedRecordNewDtoList: []
      },
      dialogTableData: [],
      table: {
        columns: [
          {prop: 'payerName', label: '姓名', width: '150'},
          {prop: 'payerGender', label: '性别', width: '100'},
          {prop: 'payerIdNumber', label: '身份证号码', width: '200'},
          {prop: 'payerPhone', label: '联系电话', width: '150'},
          {prop: 'payMonth', label: '缴纳月份', width: '150'},
          {label: '养老保险',
            prop: 'endowment',
            children: [
              {prop: 'endowmentAccountCode', label: '户头代码', width: '200'},
              {prop: 'endowmentEmpPayValue', label: '个人（元）', width: '100'},
              {prop: 'endowmentCompPayValue', label: '公司（元）', width: '100'}
            ]
          },
          {label: '医疗保险',
            prop: 'medicare',
            children: [
              {prop: 'medicareAccountCode', label: '户头代码', width: '200'},
              {prop: 'medicareEmpPayValue', label: '个人（元）', width: '100'},
              {prop: 'medicareCompPayValue', label: '公司（元）', width: '100'}
            ]
          },
          {label: '失业保险',
            prop: 'unemployment',
            children: [
              {prop: 'unemploymentAccountCode', label: '户头代码', width: '200'},
              {prop: 'unemploymentEmpPayValue', label: '个人（元）', width: '100'},
              {prop: 'unemploymentCompPayValue', label: '公司（元）', width: '100'}
            ]
          },
          {label: '工伤保险',
            prop: 'employmentInjury',
            children: [
              {prop: 'employmentInjuryAccountCode', label: '户头代码', width: '200'},
              {prop: 'employmentInjuryEmpPayValue', label: '个人（元）', width: '100'},
              {prop: 'employmentInjuryCompPayValue', label: '公司（元）', width: '100'}
            ]
          },
          {label: '生育保险',
            prop: 'maternity',
            children: [
              {prop: 'maternityAccountCode', label: '户头代码', width: '200'},
              {prop: 'maternityEmpPayValue', label: '个人（元）', width: '100'},
              {prop: 'maternityCompPayValue', label: '公司（元）', width: '100'}
            ]
          },
          {label: '住房公积金',
            prop: 'hpfund',
            children: [
              {prop: 'hpfundAccountCode', label: '户头代码', width: '200'},
              {prop: 'hpfundEmpPayValue', label: '个人（元）', width: '100'},
              {prop: 'hpfundCompPayValue', label: '公司（元）', width: '100'}
            ]
          },
          {label: '补充工伤保险',
            prop: 'businessInsurance',
            children: [
              {prop: 'businessAccountCode', label: '户头代码', width: '200'},
              {prop: 'businessEmpPayValue', label: '个人（元）', width: '100'},
              {prop: 'businessCompPayValue', label: '公司（元）', width: '100'}
            ]
          },
          {label: '补充大病医疗',
            prop: 'seriousIllness',
            children: [
              {prop: 'seriousIllnessAccountCode', label: '户头代码', width: '200'},
              {prop: 'seriousIllnessEmpPayValue', label: '个人（元）', width: '100'},
              {prop: 'seriousIllnessCompPayValue', label: '公司（元）', width: '100'}
            ]
          },
          {prop: 'totalValue', label: '合计', width: '100'},
          {prop: 'prepareMonthly', label: '建账年月', width: '150'},
          {prop: 'allottedDate', label: '划拨日期', width: '150'},
          {prop: 'lastUpdateBy', label: '操作者', width: '150'},
          {prop: 'lastUpdateDate', label: '操作时间', width: '200'}
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          toolbar: [
            {text: '新增', func: this.add, key: 'insExternaHandicappedPost'},
            {text: '删除', func: this.deleteRows, key: 'insHandicappedDelete'}
          ],
          operator: [
            {text: '删除', func: this.deleteRow, key: 'insHandicappedDel'},
            {text: '修改', func: this.editRow, key: 'insExternalHandicappedPut'}
          ],
          import: {
            business: 'iaf-handicappedAddSuccessful',
            show: () => ({empty: false}),
            key: 'insHandicappedIncreasePost'
          },
          export: {
            config: {
              fileName: '残疾人五险一金表'
            },
            key: 'insExternalHandicapped',
            req: config.handSearchs
          }
        },
        info: null,
        multiple: true,
        total: 0,
        showPagebar: true,
        search: null,
        data: []
      }
    }
  },
  mounted () {
    this.getMultipleColumns()
    this.loading = true
    this.table.search = Object.assign({}, this.formData)
  },
  methods: {
    fetch (options = {}) {
      this.loading = true
      req('handSearchs', Object.assign({}, options, this.formData))
        .then(res => {
          this.getMultipleData(res.data)
          Object.assign(this.table, res)
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    search () {
      this.table.search = Object.assign({}, this.formData)
    },
    resetInputs () {
      for (let key in this.formData) {
        this.formData[key] = ''
      }
    },
    getDeleteArr (data) {
      this.deleteArr = Object.values(data).map(item => {
        return Object.keys(item).reduce((items, key) => {
          if (key.includes('RecordId') && !!item[key]) {
            items.push(item[key])
          }
          return items
        }, [])
      }).toString().split(',')
    },
    // 多行删除
    deleteRows () {
      if (this.deleteArr.length === 0) {
        this.$message({
          type: 'info',
          message: '请至少选择一条记录'
        })
      } else {
        this.$confirm('确定删除？').then(() => {
          req('handDelete', this.deleteArr).then(data => {
            if (data === true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.fetch(this.table.info)
            }
          })
        })
      }
    },
    searchHandleSizeChange (options) {
      this.fetch(options)
    },
    searchHandleCurrentChange (options) {
      this.fetch(options)
    },
    // 单行删除
    deleteRow (row) {
      let ids = Object.keys(row).reduce((item, key) => {
        if (key.includes('RecordId') && !!row[key]) {
          item.push(row[key])
        }
        return item
      }, [])
      this.$confirm('确定删除？').then(() => {
        req('handDelete', ids).then(data => {
          if (data === true) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.fetch(this.table.info)
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      })
    },
    editRow (row) {
      this.requestCheck = 'update'
      this.editInput = true
      this.dialogShow = true
      req('findIafHandicappedRecords', {payerIdNumber: row.payerIdNumber, payMonth: moment(row.payMonth).format('YYYY-MM-DD')}).then(res => {
        this.monthEidt = res.payMonth
        let sum = 0
        for (let i = 0; i < res.iafHandicappedRecordNewDtoList.length; i++) {
          sum += res.iafHandicappedRecordNewDtoList[i].empPayValue + res.iafHandicappedRecordNewDtoList[i].compPayValue
        }
        res.totalValue = sum
        this.dialogFormData = Object.assign({}, res)
        this.titleshow = true
        this.dialogTableData = res.iafHandicappedRecordNewDtoList
        // this.$refs.handDialog.handlerTableData(res.iafHandicappedRecordNewDtoList)
      })
    },
    add () {
      this.requestCheck = 'add'
      this.editInput = false
      this.dialogShow = true
      this.titleshow = false
      Object.keys(this.dialogFormData).forEach(key => {
        this.dialogFormData[key] = ''
        this.dialogFormData.prepareMonthly = new Date()
        this.dialogFormData.allottedDate = new Date()
      })
      this.dialogTableData = []
      // Object.keys(this.dialogTableData).forEach(key => {
      //   this.dialogTableData[key] = ''
      // })
    },
    closeDialog () {
      this.dialogShow = false
    },
    confirm (data) {
      this.flag = !(moment(this.monthEidt).format('YYYY-MM') === moment(data.payMonth).format('YYYY-MM'))
      data.payMonth = moment(data.payMonth).format('YYYY-MM-DD')
      data.prepareMonthly = moment(data.prepareMonthly).format('YYYY-MM-DD')
      data.allottedDate = moment(data.allottedDate).format('YYYY-MM-DD')
      if (this.requestCheck === 'add') {
        req('handAdd', data).then(data => {
          if (data === true) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.fetch(this.table.info)
          } else {
            this.$message({
              type: 'error',
              message: '新增失败'
            })
          }
          this.dialogShow = false
          this.$refs.handDialog.toolbar[1].loading = false
        })
        .catch(() => (this.$refs.handDialog.toolbar[1].loading = false))
      } else if (this.requestCheck === 'update') {
        req('handUpdate', Object.assign({}, data, {flag: this.flag})).then(data => {
          if (data === true) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.fetch(this.table.info)
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          }
          this.dialogShow = false
          this.$refs.handDialog.toolbar[1].loading = false
        }).catch(error => {
          if (error) this.dialogShow = true
          this.$refs.handDialog.toolbar[1].loading = false
        })
      }
    },
    cancel () {
      this.dialogShow = false
    },
    clickCompany (scope) {

    },
    receiveColumns (columns) {
      this.table.columns = columns
    },
    pick () {
      this.receiveVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
