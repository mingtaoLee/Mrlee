<template>
  <div>
    <i-process-flow
      @fillin="fillIn"
      processType="iafMedicalFlow"
    >
        <div class="module" slot="baseInformation">
          <h2>基本信息</h2>
          <!-- 基本信息 -->
          <el-form :model="basicData" :rules="basicMsgChecked" :inline="true" label-width="100px">
            <el-form-item label="工号" prop="employeeCode" v-if="showMap.employeeCode">
              <template v-if="showInput">
                <el-input
                  @click.native="handleIconClick" 
                  v-model="basicData.employeeCode"
                  :disabled="disabledMap.employeeCode"
                  readonly
                >
                  <i slot="suffix" class="el-input__icon el-icon-menu" v-if="!disabledMap.employeeCode"></i>
                </el-input>
                <i-personnel-select 
                  v-if="!disabledMap.employeeCode"
                  @confirm="handleConfirm" 
                  :isShow.sync="isShow" 
                  :multiple="false" 
                ></i-personnel-select>
              </template>
              <span v-else>{{basicData.employeeCode}}</span>
            </el-form-item>
            <el-form-item label="姓名" v-if="showMap.fullName">
              <el-input v-model="basicData.fullName" :disabled="disabledMap.fullName" readonly></el-input>
            </el-form-item>
            <el-form-item label="性别" v-if="showMap.gender">
              <i-select
                v-model="basicData.gender"
                :disabled="disabledMap.gender"
                placeholder="请选择"
                parameter="GENDER"
              ></i-select>
            </el-form-item>
            <el-form-item label="出生日期" v-if="showMap.birthDate">
              <el-date-picker 
                class="dateInput" 
                type="date" 
                v-model="basicData.birthDate" 
                :disabled="disabledMap.birthDate" 
                readonly
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="身份证号" v-if="showMap.idNumber">
              <el-input  v-model="basicData.idNumber" :disabled="disabledMap.idNumber" readonly ></el-input>
            </el-form-item>
            <el-form-item label="人事范围" v-if="showMap.personnelGroupName">
              <el-input  v-model="basicData.personnelGroupName" :disabled="disabledMap.personnelGroupName" readonly></el-input>
            </el-form-item>
            <el-form-item label="部门" v-if="showMap.orgUnitName">
              <el-input  v-model="basicData.orgUnitName" :disabled="disabledMap.orgUnitName" readonly></el-input>
            </el-form-item>
            <el-form-item label="岗位" v-if="showMap.positionName">
              <el-input  v-model="basicData.positionName" :disabled="disabledMap.positionName" readonly></el-input>
            </el-form-item>
            <el-form-item label="联系地址" v-if="showMap.domicilePlace">
              <el-input  v-model="basicData.domicilePlace" :disabled="disabledMap.domicilePlace" readonly></el-input>
            </el-form-item>
            <el-form-item label="联系电话" v-if="showMap.mobile">
              <el-input  v-model="basicData.mobile" :disabled="disabledMap.mobile" readonly></el-input>
            </el-form-item>
            <el-form-item label="参保户头" v-if="showMap.medicareAccountName">
              <el-input  v-model="basicData.medicareAccountName" :disabled="disabledMap.medicareAccountName" readonly></el-input>
            </el-form-item>
            <el-form-item label="户头代码"  prop="accountCode">
              <el-input :readonly="true" v-model="basicData.accountCode" :disabled="disabledMap.accountId"></el-input>
            </el-form-item>
            <el-form-item label="参保城市" v-if="showMap.insuranceAreaId">
              <el-input  v-model="basicData.insuranceAreaId" :disabled="disabledMap.insuranceAreaId" readonly></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="module" slot="medicalDeclaration">
          <h2>医疗申报说明</h2>
          <el-form :inline="true" :model="medicaExplain" :rules="medicalReportChecked" label-width="100px">
            <el-form-item label="申报人" prop="applicant" v-if="showMap.applicant">
              <el-input v-model="medicaExplain.applicant" :disabled="disabledMap.applicant"></el-input>
            </el-form-item>
            <el-form-item label="就医医院名称" v-if="showMap.hospitalName">
              <el-input v-model="medicaExplain.hospitalName" :disabled="disabledMap.hospitalName"></el-input>
            </el-form-item>
            <el-form-item label="病区" v-if="showMap.illnessRegion">
              <el-input v-model="medicaExplain.illnessRegion" :disabled="disabledMap.illnessRegion"></el-input>
            </el-form-item>
            <el-form-item label="住院号" v-if="showMap.admissioNumber">
              <el-input v-model="medicaExplain.admissioNumber" :disabled="disabledMap.admissioNumber"></el-input>
            </el-form-item>
            <el-form-item label="住院时间" v-if="showMap.inHospitalDate">
              <el-date-picker
                v-if="showMap.insuranceAreaId"
                type="date"
                placeholder="住院时间"
                v-model="medicaExplain.inHospitalDate"
                :disabled="disabledMap.inHospitalDate" 
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出院时间" v-if="showMap.outHospitalDate">
              <el-date-picker
                type="date"
                placeholder="出院时间"
                v-model="medicaExplain.outHospitalDate"
                :disabled="disabledMap.outHospitalDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="入院诊断" prop="isHospitalDiagnosis" v-if="showMap.isHospitalDiagnosis">
              <el-input v-model="medicaExplain.isHospitalDiagnosis" :disabled="disabledMap.isHospitalDiagnosis"></el-input>
            </el-form-item>
            <el-form-item label="出院诊断" v-if="showMap.outHospitalDiagnosis">
              <el-input v-model="medicaExplain.outHospitalDiagnosis" :disabled="disabledMap.outHospitalDiagnosis"></el-input>
            </el-form-item>
            <el-form-item label="银行结算账号" prop="bankSettlementAccount" v-if="showMap.bankSettlementAccount">
              <el-input v-model="medicaExplain.bankSettlementAccount" :disabled="disabledMap.bankSettlementAccount"></el-input>
            </el-form-item>
            <el-form-item label="实际医疗费用" prop="actualMedicalExpenses" v-if="showMap.actualMedicalExpenses">
              <el-input v-model="medicaExplain.actualMedicalExpenses" :disabled="disabledMap.actualMedicalExpenses"></el-input>
            </el-form-item>
            <el-form-item label="医院级别" prop="hospitalLevel" v-if="showMap.hospitalLevel">
              <el-input v-model="medicaExplain.hospitalLevel" :disabled="disabledMap.hospitalLevel"></el-input>
            </el-form-item>
            <el-form-item label="床号" v-if="showMap.bedNumber">
              <el-input v-model="medicaExplain.bedNumber" :disabled="disabledMap.bedNumber"></el-input>
            </el-form-item>
            <el-form-item label="社会保障卡号" prop="SocialSecurityCardNumber" v-if="showMap.SocialSecurityCardNumber">
              <el-input v-model="medicaExplain.SocialSecurityCardNumber" :disabled="disabledMap.SocialSecurityCardNumber"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="module" slot="foreignEmergency">
          <h2>异地急诊请填写</h2>
          <el-form :inline="true" :model="otherData" label-width="100px">
            <el-form-item label="前往异地的时间" v-if="showMap.differentPlacesTime">
              <!-- <el-input v-model="otherData.differentPlacesTime" :disabled="disabledMap.differentPlacesTime"></el-input> -->
              <el-date-picker v-model="otherData.differentPlacesTime" :disabled="disabledMap.differentPlacesTime" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="前往异地的原因" v-if="showMap.differentPlacesReason">
              <el-input v-model="otherData.differentPlacesReason" :disabled="disabledMap.differentPlacesReason"></el-input>
            </el-form-item>
          </el-form>
          <div>
            备注：正常情况发生医疗事故必须刷医保卡，异地就医的符合线下申请报销的情况才能APP申请报销。
          </div>
        </div>
        <div class="module" slot="costReimbursement">
          <h2>费用报销情况</h2>
          <el-form :model="otherData" :rules="elseChecked" :inline="true" label-width="100px">
            <el-form-item label="费用报销时间" v-if="showMap.reimbursementDate">
              <el-date-picker v-model="otherData.reimbursementDate" class="dateInput" :disabled="disabledMap.reimbursementDate" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="费用报销状态" prop="reimbursementStatus" v-if="showMap.reimbursementStatus">
              <i-select v-model="otherData.reimbursementStatus" parameter="IAF_EXPENSE_ACCOUNT_STATUS" :disabled="disabledMap.reimbursementStatus"></i-select>
            </el-form-item>
            <el-form-item label="报销费用金额" v-if="showMap.reimbursementValue">
              <el-input v-model="otherData.reimbursementValue" :disabled="disabledMap.reimbursementValue"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </i-process-flow>
  </div>
</template>

<script>

import IProcessFlow from 'components/common/i-process-flow'
import BasicMsgForm from 'views/flow/pages/iaf/components/basic-form/basic-msg-form'
import processMixin from 'mixins/process'
import req from 'api/iaf/iaf-flow'
import iafBaseInfoMixin from 'mixins/compensation/iaf-base-info'

export default {
  components: {
    IProcessFlow,
    BasicMsgForm
  },
  mixins: [processMixin, iafBaseInfoMixin],
  data () {
     // 是否是数字校验
    let checkNumber = (rule, value, callback) => {
      if (value !== '') {
        if (isNaN(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      // 显示人员工号弹出框
      isShow: false,
      showInput: true,
      // 基本信息
      basicData: {
        employeeCode: '',
        employeeId: '',
        accountId: '',
        fullName: '',
        gender: '',
        birthDate: '',
        idNumber: '',
        personnelGroupName: '',
        orgUnitName: '',
        positionName: '',
        domicilePlace: '',
        mobile: '',
        medicareAccountName: '',
        InsuranceAreaId: ''
      },
      // 医疗申报说明
      medicaExplain: {
        applicant: '',
        hospitalName: '',
        illnessRegion: '',
        admissioNumber: '',
        inHospitalDate: '',
        outHospitalDate: '',
        isHospitalDiagnosis: '',
        outHospitalDiagnosis: '',
        bankSettlementAccount: '',
        actualMedicalExpenses: '',
        hospitalLevel: '',
        bedNumber: '',
        SocialSecurityCardNumber: ''
      },
      // 其他数据
      otherData: {
        differentPlacesTime: '',
        differentPlacesReason: '',
        reimbursementDate: '',
        reimbursementStatus: '',
        reimbursementValue: ''
      },
      flowData: {
        operateType: 'insuranceCreateFlow'
      },
      basicMsgChecked: {
        employeeCode: [{ required: true, message: '请输入工号', trigger: 'change' }],
        accountId: [{ required: true, message: '请输入头ID', trigger: 'blur' }]
      },
      medicalReportChecked: {
        applicant: [{ required: true, message: '请输入申报人', trigger: 'blur' }],
        isHospitalDiagnosis: [{ required: true, message: '请输入入院诊断', trigger: 'blur' }],
        BankSettlementAccoun: [{ required: true, message: '请输入银行结算账号', trigger: 'blur' }],
        ActualMedicalExpenses: [{ required: true, message: '请输入实际医疗费用', trigger: 'blur' }],
        hospitalLevel: [{ required: true, message: '请输入医院级别', trigger: 'blur' }],
        SocialSecurityCardNumber: [{ required: true, message: '请输入社保障卡号', trigger: 'blur' }],
        bankSettlementAccount: [
          {required: true, message: '请输入银行结算账号', trigger: 'change'},
          {validator: checkNumber, trigger: 'change'}
        ],
        actualMedicalExpenses: [
          {required: true, message: '请输入实际医疗费用', trigger: 'change'},
          {validator: checkNumber, trigger: 'change'}
        ]
      },
      elseChecked: {
        reimbursementStatus: [{required: true, message: '请输入费用报销状态', trigger: 'change'}]
      }
    }
  },
  methods: {
    // 获取员工基本信息
    handleConfirm (selected) {
      // 获取基本信息
      req('iafMedicalMsg', {employeeCode: selected[0].employeeCode}).then(data => {
        let _data = data
        // 通过工号获取员工编号
        req('iafGetEmployeeId', {employeeCode: selected[0].employeeCode}).then(data => {
          this.basicData = Object.assign({}, this.basicData, _data)
          this.basicData.employeeId = data
        })
      })
    },
    postFlow () {
      return Object.assign(this.basicData, this.medicaExplain, this.otherData, this.flowData)
    },
    fillIn (data) {
      for (let key in data) {
        this.basicData[key] = data[key]
        this.medicaExplain[key] = data[key]
        this.otherData[key] = data[key]
      }
    },
    // 弹出框的显示
    handleIconClick () {
      this.isShow = !this.isShow
    }
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
  .el-form--inline /deep/ .el-form-item__content{
    width: 193px;
  }
</style>

