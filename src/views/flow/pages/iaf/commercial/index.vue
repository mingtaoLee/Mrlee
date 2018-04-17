<template>
  <div>
    <i-process-flow
      processType="iafAddCommerceFlow"
      @fillin="fillIn"
    >
      <div slot="commercialDescription">
        <div class="module">
          <h2>商业保险说明</h2>
          <i-table 
            :table="table"
          >
            <template slot="table" slot-scope="tableScope">
              <el-table
                @row-click="rowClickHandler(tableScope, $event)"
                border
                :data="tableScope.clone"
              >
                <el-table-column
                  v-for="(col, idx) of table.columns"
                  align="center"
                  :formatter="tableScope.formatter"
                  :key="idx"
                  :width="col.width"
                  :prop="col.prop"
                  :label="col.label"
                >
                  <template slot-scope="scope">
                    <i-table-cell
                      @change="changeData"
                      :row="scope.row"
                      :col="col.prop"
                      :table="tableScope"
                    ></i-table-cell>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-process-flow>
    <el-dialog
      title="增加记录"
      width="55%"
      :visible.sync="dialogVisible"
    >
      <el-form label-width="120px" :inline="true" :model="addFormData">
        <el-form-item label="工号">
          <el-input @blur="getEmpMsg" v-model="addFormData.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="addFormData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="出生年月">
          <el-date-picker class="dateInput" type="date" v-model="addFormData.birthDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="addFormData.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="变更类型">
          <el-input v-model="addFormData.changingType"></el-input>
        </el-form-item>
        <el-form-item label="人事范围">
          <el-input v-model="addFormData.personalArea"></el-input>
        </el-form-item>
        <el-form-item label="改变原因">
          <el-input v-model="addFormData.changingReason"></el-input>
        </el-form-item>
        <el-form-item label="工伤险参保状态">
          <el-input v-model="addFormData.injuryInsuredStatus"></el-input>
        </el-form-item>
        <el-form-item label="商业险参保状态">
          <el-input v-model="addFormData.cmlInsuredStatus"></el-input>
        </el-form-item>
        <el-form-item label="商业险保单号">
          <el-input v-model="addFormData.numberOfPolicy"></el-input>
        </el-form-item>
        <el-form-item label="保单开始时间">
          <el-date-picker class="dateInput" type="date" v-model="addFormData.effectiveDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="保单结束时间">
          <el-date-picker class="dateInput" type="date" v-model="addFormData.uneffectiveDate"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="confirm" type="primary" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import IProcessFlow from 'components/common/i-process-flow'
import ITable from 'components/common/i-table'
import ITableCell from 'components/common/i-table-cell'
import processMixin from 'mixins/process'
import req from 'api/iaf/iaf-flow'

export default {
  components: {
    IProcessFlow,
    ITable,
    ITableCell
  },
  data () {
    return {
      dialogVisible: false,
      addArr: [], // 保存table数据的数组
      idNumberString: '', // 保存idnumber数组字符串
      addFormData: {
        employeeId: '',
        employeeCode: '',
        fullName: '',
        birthDate: '',
        idNumber: '',
        changingType: '',
        personalArea: '',
        changingReason: '',
        injuryInsuredStatus: '',
        cmlInsuredStatus: '',
        numberOfPolicy: '',
        effectiveDate: '',
        uneffectiveDate: ''
      },
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号', width: '100' },
          { prop: 'fullName', label: '姓名', width: '150' },
          { prop: 'birthDate', label: '出生年月', width: '150', display: { date: 'short' } },
          { prop: 'idNumber', label: '身份证号', width: '200' },
          { prop: 'changingType', label: '变更类型', width: '100' },
          { prop: 'personalArea', label: '人事范围', width: '100' },
          { prop: 'changingReason', label: '变更原因', width: '100' },
          { prop: 'injuryInsuredStatus', label: '工伤参保状态', width: '150' },
          { prop: 'cmlInsuredStatus', label: '商业险参保状态', width: '150' },
          { prop: 'numberOfPolicy', label: '商业险保单号', width: '150' },
          { prop: 'effectiveDate', label: '保单开始时间', width: '150', display: { date: 'short' } },
          { prop: 'uneffectiveDate', label: '保单结束时间', width: '150', display: { date: 'short' } }
        ],
        setting: {
          toolbar: [
            {text: '导入'},
            {text: '增加', func: this.addRecord},
            {text: '删除'}
          ]
        },
        editable: true,
        data: null
      }
    }
  },
  mixins: [processMixin],
  methods: {
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },
    addRecord () {
      this.dialogVisible = true
    },
    cancel () {
      this.dialogVisible = false
    },
    confirm () {
      let idNumberArr = []
      // 点击确定时
      this.addArr.push(Object.assign({}, this.addFormData, {operateType: 'insuranceCreateFlow'}))
      this.table.data = this.addArr
      idNumberArr = this.addArr.map(item => {
        return item.idNumber
      })
      this.dialogVisible = false
      this.idNumberString = idNumberArr.toString()
      // 循环请求，拿到员工employeeId保存在对象数组中
      for (let i = 0; i < this.addArr.length; i++) {
        req('iafCommercialEmployeeId', {employeeCode: this.addArr[i].employeeCode}).then(data => {
          this.addArr[i].employeeId = data
        })
      }
    },
    // 员工失去焦点时获得表单信息
    getEmpMsg () {
      req('iafCommercial', {employeeCode: this.addFormData.employeeCode}).then(data => {
        this.addFormData = Object.assign({}, this.addFormData, data)
      })
    },
    postFlow () {
      // for (let i = 0; i < this.addArr.length; i++) {
      //   this.addArr.birthDate = this.addArr[i].birthDate.getTime()
      //   this.addArr.effectiveDate = this.addArr[i].effectiveDate.getTime()
      //   this.addArr.uneffectiveDate = this.addArr[i].uneffectiveDate.getTime()
      // }
      return {
        operateType: 'insuranceCreateFlow',
        idNumber: this.idNumberString,
        insCommercialList: this.addArr
      }
    },
    fillIn (data) {
      this.idNumberString = data.idNumber
      this.addArr = data.insCommercialList
      this.table.data = data.insCommercialList
    }
  },
  updated () {

  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
  .module{
    min-width: 850px;
    border-bottom: 1px solid #e5e5e5;
    margin: 20px;
    h2{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0;
      margin-bottom: 20px;
    }
  }
  .emp-msg{
    font-size: 14px;
    font-weight:bold;
    padding-left:20px;
  }
  .el-row{
    margin-bottom:20px !important;
  }
  .dateInput{
    width:185px;
  }
</style>

