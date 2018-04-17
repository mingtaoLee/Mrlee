<template>
  <i-layout 
    :headerPadding="0" 
    :borderWidth="0" 
    :margin="0"  
    :sectionPadding="0"  
    :titlePadding="3"
    header-key="externalMessagePost"
    v-loading="loading"
    :element-loading-text="$loadingText"
  >
    <template slot="header">
      <i-form @reset="resetInputs" @search="search" ref="form">
        <el-form-item label="人事范围代码:">
          <el-input v-model="searchData.personnelGroupCode"></el-input>
        </el-form-item>
        <el-form-item label="人事范围:">
          <el-input v-model="searchData.personnelGroupName"></el-input>
        </el-form-item>
        <el-form-item label="组织:">
          <el-input v-model="searchData.personnelGroupName"></el-input>
        </el-form-item>
        <el-form-item label="缴纳类型:">
          <i-select clearable v-model="searchData.personalArea"  parameter="dict"></i-select>
        </el-form-item>
        <el-form-item label="补缴人数:">
          <el-input v-model="searchData.orgUnitId"></el-input>
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
            @selection-change="handleChange"
            :border="$$.table.border"
            :stripe="$$.table.stripe"
            :data="tableScope.clone"
            v-loading="loading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              v-for="(col, idx) of tableScope.columns"
              :key="idx"
              :prop="col.prop"
              :min-width="col.width"
              align="center"
              :label="col.label"
            >
              <el-table-column
                v-for="(item, index) in col.children"
                :width="item.width"
                align="center"
                :prop="item.prop"
                :label="item.label"
                :key="index"
              ></el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <apap-dialog ref="apapDialog"
        @cancel="cancel"
        @confirm="confirm"
        @close="closeDialog"
        @open="openDialog"
        :requestCheck="requestCheck"
        :visible="dialogShow"
        :formData="dialogFormData"
        :tableData="dialogTableData"
      ></apap-dialog>
    </div>
  </i-layout>
</template>
<script>
import ITable from 'components/common/i-table'
import ITableOperator from 'components/common/i-table-operator'
import IForm from 'components/common/i-form/i-form.vue'
import ApapDialog from './dialog/apap-dialog.vue'
import ISelect from 'components/common/i-select/i-select.vue'
import req, {config} from 'api/iaf/social-security'
import moment from 'moment'
import ILayout from 'components/common/i-layout'
export default {
  name: 'SummaryTable',
  components: {
    ITable,
    ITableOperator,
    IForm,
    ISelect,
    ApapDialog,
    ILayout
  },
  data () {
    return {
      deleteArr: [],
      dialogShow: false,
      requestCheck: '', // 请求接口标识
      updateReq: null,
      loading: false,
      table: {
        title: '',
        columns: [
          {prop: 'personalArea', label: '人事范围代码', width: '150'},
          {prop: 'orgUnitId', label: '人事范围', width: '150'},
          {prop: 'orgUnitName', label: '组织', width: '200'},
          {prop: 'payMonth', label: '缴纳月份', width: '200'},
          {prop: 'employeeCode', label: '缴纳类型', width: '150'},
          {prop: 'fullName', label: '补缴人数', width: '150'},
          {label: '养老',
            children: [
              {prop: 'endowmentCompPayValue', label: '户头', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '户头代码', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          },
          {label: '失业',
            children: [
              {prop: 'endowmentCompPayValue', label: '户头', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '户头代码', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          },
          {label: '工伤',
            children: [
              {prop: 'endowmentCompPayValue', label: '户头', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '户头代码', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          },
          {label: '生育',
            children: [
              {prop: 'endowmentCompPayValue', label: '户头', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '户头代码', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          },
          {label: '医疗',
            children: [
              {prop: 'endowmentCompPayValue', label: '户头', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '户头代码', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          },
          {label: '住房公积金',
            children: [
              {prop: 'endowmentCompPayValue', label: '户头', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '户头代码', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          },
          {label: '大病医疗',
            children: [
              {prop: 'endowmentCompPayValue', label: '户头', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '户头代码', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          },
          {label: '补充工伤',
            children: [
              {prop: 'endowmentCompPayValue', label: '户头', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '户头代码', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          },
          {label: '七险一金合计',
            children: [
              {prop: 'endowmentCompPayValue', label: '单位部分', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人部分', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '单位滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '个人滞纳金', width: '100'},
              {prop: 'endowmentEmpPayValue', label: '补缴人数', width: '100'}
            ]
          }
        ],
        setting: {
          export: {
            config: {
              fileName: '补预退汇总表'
            },
            req: config.apapSearch,        // api 配置信息（参数名以自身业务为准）【必填】
            key: 'externalMessagePost'
          }
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true,
        multiple: true
      },
      // 高级搜索
      searchData: {
        employeeCode: '',
        fullName: '',
        orgUnitName: '',
        orgUnitId: '',
        personalArea: '',
        payMonth: '',
        paymentType: ''
      },
      // 弹出框表单数据
      dialogFormData: {
        employeeCode: '',
        fullName: '',
        // accountCode: '',
        personalArea: '',
        orgUnitCode: '',
        orgUnitName: '',
        payMonth: '',
        paymentType: '',
        empTotal: 0,
        comTotal: 0
      },
      // 弹出框table数据
      dialogTableData: {
        // 养老保险
        endowmentRecordId: null,
        endowmentEmpPayValue: '',
        endowmentCompPayValue: '',
        // 医疗保险
        medicareRecordId: null,
        medicareEmpPayValue: '',
        medicareCompPayValue: '',
        // 失业保险
        unemploymentRecordId: null,
        unemploymentEmpPayValue: '',
        unemploymentCompPayValue: '',
        // 工伤保险
        employmentInjuryRecordId: null,
        employmentInjuryEmpPayValue: '',
        employmentInjuryCompPayValue: '',
        // 生育保险
        maternityRecordId: null,
        maternityEmpPayValue: '',
        maternityCompPayValue: '',
        // 公积金
        hpfundRecordId: null,
        hpfundEmpPayValue: '',
        hpfundCompPayValue: '',
        // 滞纳金
        lateFeeRecordId: null,
        lateFeeEmpPayValue: '',
        lateFeeCompPayValue: ''
      }
    }
  },
  mounted () {
    this.loading = false
    this.table.search = {}
  },
  methods: {
    fetch (options = {}) {
      // 当前页面暂未开发,先注释
      // req('apapSearch', Object.assign({}, options, this.searchData))
      //   .then(res => {
      //     Object.keys(res).map(key => {
      //       this.table[key] = res[key]
      //     })
      //      this.loading = false
      //   })
      //   .catch(err => {
        //   console.log(err)
        //   this.loading = false
        // })
    },
    initLayout () {
      this.$refs.form.initLayout()
    },
    closeDialog () {
      this.dialogShow = false
    },
    openDialog () {
      this.$refs.apapDialog.resetForm()
      this.dialogShow = true
    },
    confirm (data) {
      data.payMonth = moment(data.payMonth).format('YYYY-MM-DD HH:mm:SS')
      if (this.requestCheck === 'add') {
        req('apapAdd', data).then(data => {
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
        })
      } else if (this.requestCheck === 'update') {
        req('apapUpdate', data).then(data => {
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
        })
      }
      this.dialogShow = false
    },
    cancel () {
      this.dialogShow = false
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    search () {
      this.fetch(this.table.info)
    },
    // 修改记录
    editRow (row) {
      this.requestCheck = 'update'
      Object.assign(this.dialogTableData, row)
      Object.assign(this.dialogFormData, row)
      // this.dialogTableData = row
      // this.dialogFormData = row
      this.dialogShow = true
    },
    // 删除一行
    deleteRow (row) {
      this.deleteArr = []
      this.deleteArr.push(row.endowmentRecordId)
      this.deleteArr.push(row.medicareRecordId)
      this.deleteArr.push(row.unemploymentRecordId)
      this.deleteArr.push(row.employmentInjuryRecordId)
      this.deleteArr.push(row.maternityRecordId)
      this.deleteArr.push(row.hpfundRecordId)
      this.deleteArr.push(row.lateFeeRecordId)
      this.$confirm('确认删除？').then(() => {
        req('apapRequestDelete', this.deleteArr).then(data => {
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
    },
    // 增加记录
    addRecord () {
      this.requestCheck = 'add'
      this.dialogShow = true
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
          req('apapRequestDelete', this.deleteArr).then(data => {
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
    handleChange (val) {
      this.deleteArr = val.map(item => {
        return item.endowmentRecordId || null
      }).concat(val.map(item => {
        return item.medicareRecordId || null
      })).concat(val.map(item => {
        return item.unemploymentRecordId || null
      })).concat(val.map(item => {
        return item.employmentInjuryRecordId || null
      })).concat(val.map(item => {
        return item.maternityRecordId || null
      })).concat(val.map(item => {
        return item.hpfundRecordId || null
      })).concat(val.map(item => {
        return item.lateFeeRecordId || null
      }))
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
