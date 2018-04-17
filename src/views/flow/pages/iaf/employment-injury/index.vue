<template>
  <div class="wrap content-follow">
    <i-process-flow
      @fillin="fillIn"
      processType="iafWorkingInjuryFlow"
    >
      <!-- 基本信息 -->
      <div class="module" slot="essentialInformation">
          <h2>基本信息</h2>
          <el-form :inline="true" label-width="100px" :model="formData" :rules="basicDataChecked">
            <el-form-item label="工号" v-if="showMap.employeeCode" prop="employeeCode">
              <el-input 
                @click.native="handleIconClick" 
                readonly
                v-model="formData.employeeCode" 
                :disabled="disabledMap.employeeCode" 
              >
                <i slot="suffix" v-if="!disabledMap.employeeCode" class="el-input__icon el-icon-menu"></i>
              </el-input>
              <i-personnel-select
                v-if="!disabledMap.employeeCode"
                @confirm="handleConfirm"
                :isShow.sync="isShow" 
                :multiple="false" 
              ></i-personnel-select>
            </el-form-item>
            <el-form-item label="姓名" label-width="100px" v-if="showMap.fullName">
              <el-input :disabled="disabledMap.fullName" v-model="formData.fullName" readonly></el-input>
            </el-form-item>
            <el-form-item label="性别" label-width="100px" v-if="showMap.gender">
              <i-select
                v-model="formData.gender"
                :disabled="disabledMap.gender"
                placeholder="请选择"
                parameter="GENDER"
              ></i-select>
            </el-form-item>
            <el-form-item label="出生年月" label-width="100px" v-if="showMap.birthDay">
              <el-date-picker :disabled="disabledMap.birthDay" class="dateInput" v-model="formData.birthDate" type="date" readonly></el-date-picker>
            </el-form-item>
            <el-form-item label="身份证号码" label-width="100px" v-if="showMap.idNumber">
              <el-input :disabled="disabledMap.idNumber" v-model="formData.idNumber" readonly></el-input>  
            </el-form-item>
            <el-form-item label="人事范围" label-width="100px" v-if="showMap.personnelGroupCode">
              <el-input :disabled="disabledMap.personnelGroupCode" v-model="formData.personnelGroupName" readonly></el-input>
            </el-form-item>
            <el-form-item label="部门" label-width="100px" v-if="showMap.orgUnitName">
              <el-input :disabled="disabledMap.orgUnitName" v-model="formData.orgUnitName" readonly></el-input>
            </el-form-item>
            <el-form-item label="职位" label-width="100px" v-if="showMap.positionName">
              <el-input :disabled="disabledMap.positionName" v-model="formData.positionName" readonly></el-input>
            </el-form-item>
            <el-form-item label="联系地址" label-width="100px" v-if="showMap.domicilePlace">
              <el-input :disabled="disabledMap.domicilePlace" v-model="formData.domicilePlace" readonly></el-input>
            </el-form-item>
            <el-form-item label="联系电话" label-width="100px" v-if="showMap.mobile">
              <el-input :disabled="disabledMap.mobile" v-model="formData.mobile" readonly></el-input>
            </el-form-item>
          </el-form>
      </div>
      <!-- 工伤/工亡申报说明 -->
      <div class="module" slot="workingInjuryDeclaration">
          <h2>工伤/工亡申报说明</h2>
          <el-form :inline="true" :model="formData" label-width="100px" :rules="jobExplainChecked">
            <div class="injury-statues">
              <el-form-item label="工伤/工亡" v-if="showMap.injuryType" class="injury">
                <el-radio-group v-model="formData.injuryType" class="dateInput">
                  <el-radio :disabled="disabledMap.injuryType" label="0">工伤</el-radio>
                  <el-radio :disabled="disabledMap.injuryType" label="1">工亡</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="申报险种" v-if="showMap.declarationType" class="declaration">
                <el-radio-group v-model="formData.declarationType" class="dateInput declaration-box">
                  <el-radio :disabled="disabledMap.declarationType" label="01">工伤险</el-radio>
                  <el-radio :disabled="disabledMap.declarationType" label="02">商业险</el-radio>
                  <el-radio :disabled="disabledMap.declarationType" label="03">补充工伤</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <el-form-item label="参保户头" v-if="showMap.employmentInjuryAccountName">
              <el-input :disabled="disabledMap.employmentInjuryAccountName" v-model="formData.accountName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="户头ID" v-if="showMap.accountId" prop="accountId">
              <el-input :disabled="disabledMap.accountId" v-model="formData.accountId"></el-input>
            </el-form-item> -->
            <el-form-item label="户头代码" v-if="showMap.accountCode" prop="accountCode">
              <el-input :disabled="disabledMap.accountCode" v-model="formData.accountCode"></el-input>
            </el-form-item>
            <el-form-item label="参保城市" v-if="showMap.applyArea">
              <el-input :disabled="disabledMap.applyArea" v-model="formData.applyArea"></el-input>
            </el-form-item>
            <el-form-item label="参保时间" v-if="showMap.effectiveDate">
              <el-date-picker :disabled="disabledMap.effectiveDate" v-model="formData.effectiveDate" class="dateInput" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="工伤时间" prop="injuryDate" v-if="showMap.injuryDate">
              <el-date-picker 
                class="dateInput" 
                type="date"
                v-model="formData.injuryDate" 
                :disabled="disabledMap.injuryDate" 
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="保险公司名称" v-if="showMap.insuranceCompanyName">
              <el-input :disabled="disabledMap.insuranceCompanyName" v-model="formData.insuranceCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="保单号" v-if="showMap.numberOfPolicy">
              <el-input :disabled="disabledMap.numberOfPolicy" v-model="formData.policyCode"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" v-if="showMap.domicilePlace">
              <el-input :disabled="disabledMap.domicilePlace" v-model="formData.domicilePlace"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" v-if="showMap.mobile">
              <el-input :disabled="disabledMap.mobile" v-model="formData.mobile"></el-input>
            </el-form-item>
            <el-form-item label="受伤部位" v-if="showMap.injuryPart" prop="injuryPart">
              <el-input :disabled="disabledMap.injuryPart" v-model="formData.injuryPart"></el-input>
            </el-form-item>
            <el-form-item label="诊断结果1" v-if="showMap.diagnosis1" prop="diagnosis1">
              <el-input :disabled="disabledMap.diagnosis1" v-model="formData.diagnosis1"></el-input>
            </el-form-item>
            <el-form-item label="诊断结果2" v-if="showMap.diagnosis2">
              <el-input :disabled="disabledMap.diagnosis2" v-model="formData.diagnosis2"></el-input>
            </el-form-item>
            <el-form-item label="是否住院" v-if="showMap.isHospital">
              <i-select
                v-model="formData.isHospital"
                placeholder="请选择"
                :disabled="disabledMap.isHospital"
                parameter="WHETHER_TYPE"
              ></i-select>
            </el-form-item>
            <el-form-item label="入院时间" v-if="showMap.inHospitalDate">
              <el-date-picker 
                type="date" 
                class="dateInput" 
                v-model="formData.inHospitalDate"
                :disabled="disabledMap.inHospitalDate" 
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出院时间" v-if="showMap.outHospitalDate">
              <el-date-picker 
                type="date" 
                class="dateInput" 
                v-model="formData.outHospitalDate"
                :disabled="disabledMap.outHospitalDate" 
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="受伤时间、地点、经过" v-if="showMap.injuryProcess" label-width="100px" prop="injuryProcess" class="textareaBox">
              <el-input type="textarea" v-model="formData.injuryProcess" :disabled="disabledMap.injuryProcess"></el-input>
            </el-form-item>
          </el-form>
      </div>
      <!-- 工伤鉴定情况 -->
      <div class="module" slot="injuryIdentification" :model="formData">
          <h2>工伤鉴定情况</h2>
          <el-form 
            label-width="100px" 
            :inline="true" 
            :model="formData"  
            :rules="jobAuthenticateChecked"
          >
            <el-form-item label="工伤状态" v-if="showMap.injuryStatus" prop="injuryStatus">
              <i-select
                v-model="formData.injuryStatus"
                parameter="IAF_INJURY_STATUS"
                clearable 
                placeholder="请选择"
              ></i-select>
            </el-form-item>
            <el-form-item label="是否伤残" v-if="showMap.isDisablity" prop="isDisablity">
              <i-select
                v-model="formData.isDisablity"
                @change="isDisablityEvent"
                placeholder="请选择"
                :disabled="disabledMap.isDisablity"
                parameter="WHETHER_TYPE"
              ></i-select>
            </el-form-item>
            <div v-if="showDisability" class="disability-status">
              <el-form-item label="伤残等级" v-if="showMap.disabilityGrade" prop="disabilityGrade">
                <i-select
                  v-model="formData.disabilityGrade"
                  parameter="DISABILITY_GRADE"
                  clearable 
                  placeholder="请选择"
                ></i-select>
              </el-form-item>
            </div>
            <el-form-item  label="工伤认定时间" v-if="showMap.identifyDate">
              <el-date-picker 
                class="dateInput" 
                type="date"
                v-model="formData.injuryConfirmDate" 
                :disabled="disabledMap.identifyDate" 
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="工伤鉴定时间" v-if="showMap.judgeDate">
              <el-date-picker 
                class="dateInput" 
                type="date"
                v-model="formData.judgeDate" 
                :disabled="disabledMap.judgeDate" 
              ></el-date-picker>
            </el-form-item>
          </el-form>
      </div>
      <!-- 费用报销 -->
      <div class="module" slot="expenseReimbursement">
          <h2>费用报销</h2>
          <el-form :inline="true" :model="formData" label-width="160px">
            <el-form-item label="第一次待遇申报时间" v-if="showMap.firstApplyDate">
              <el-date-picker 
                class="dateInput" 
                type="date"
                v-model="formData.firstApplyDate" 
                :disabled="disabledMap.firstApplyDate" 
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="应报销金额(理论)" v-if="showMap.firstShouldValue">
              <el-input :disabled="disabledMap.firstShouldValue" v-model="formData.firstShouldValue"></el-input>
            </el-form-item>
            <el-form-item label="一次性伤残补助金" v-if="showMap.firstRealSubsidy">
              <el-input :disabled="disabledMap.firstRealSubsidy" v-model="formData.firstRealSubsidy"></el-input>
            </el-form-item>
            <el-form-item  label="医疗费" v-if="showMap.firstRealExpenses">
              <el-input :disabled="disabledMap.firstRealExpenses" v-model="formData.firstRealExpenses"></el-input>
            </el-form-item>
            <el-form-item label="第一次待遇申报合计" v-if="showMap.firstRealTotal">
              <!-- <el-input :disabled="disabledMap.firstRealTotal" v-model="formData.firstRealTotal"></el-input> -->
              <el-input v-model="formData.firstRealTotal" disabled></el-input>
            </el-form-item>
            <el-form-item label=" "></el-form-item>
            <el-form-item label="第二次待遇申报时间" v-if="showMap.secondApplyDate">
              <el-date-picker :disabled="disabledMap.secondApplyDate" v-model="formData.secondApplyDate" class="dateInput" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="应报销金额" v-if="showMap.secondShouldValue">
              <el-input :disabled="disabledMap.secondShouldValue" v-model="formData.secondShouldValue"></el-input>
            </el-form-item>
            <el-form-item label="一次性伤残补助金" v-if="showMap.secondRealSubsidy">
              <el-input :disabled="disabledMap.secondRealSubsidy" v-model="formData.secondRealSubsidy"></el-input>
            </el-form-item>
            <el-form-item label="医疗费" v-if="showMap.secondRealExpenses">
              <el-input :disabled="disabledMap.secondRealExpenses" v-model="formData.secondRealExpenses"></el-input>
            </el-form-item>
            <el-form-item label="第二次待遇申报合计" v-if="showMap.secondRealTotal">
              <!-- <el-input :disabled="disabledMap.secondRealTotal" v-model="formData.secondRealTotal"></el-input> -->
              <el-input v-model="formData.secondRealTotal" disabled></el-input>
            </el-form-item>
            <el-form-item label=" "></el-form-item>
            <el-form-item label="工亡到账金额" v-if="showMap.transferredValue">
              <el-input :disabled="disabledMap.transferredValue" v-model="formData.transferredValue"></el-input>
            </el-form-item>
            <el-form-item label="是否完结" v-if="showMap.isCompleted">
              <i-select
                v-model="formData.isCompleted"
                placeholder="请选择"
                :disabled="disabledMap.isCompleted"
                parameter="WHETHER_TYPE"
              ></i-select>
            </el-form-item>
          </el-form>
      </div>
    </i-process-flow>
  </div>
</template>

<script>

import IProcessFlow from 'components/common/i-process-flow'
import BasicMsgForm from 'views/flow/pages/iaf/components/basic-form/basic-msg-form'
import req from 'api/iaf/iaf-flow'

export default {
  components: {
    IProcessFlow,
    BasicMsgForm
  },
  data () {
    return {
      isShow: false,
      showDisability: true,
      jobAuthenticateChecked: {
        injuryStatus: [{ required: true, message: '请输入工伤状态', trigger: 'change' }],
        isDisablity: [{ required: true, message: '请选择是否伤残', trigger: 'blur' }],
        disabilityGrade: [{ required: true, message: '请输入伤残等级', trigger: 'blur' }]
      },
      jobExplainChecked: {
        injuryDate: [{ type: 'date', required: true, message: '请输入工伤时间', trigger: 'blur' }],
        injuryPart: [{ required: true, message: '请输入受伤部位', trigger: 'blur' }],
        diagnosis1: [{ required: true, message: '请输入诊断结果', trigger: 'blur' }],
        // accountId: [{ required: true, message: '请输入户头ID', trigger: 'blur' }],
        accountCode: [{ required: true, message: '请输入户头ID', trigger: 'blur' }],
        injuryProcess: [{ required: true, message: '请输入受伤时间，地点，经过', trigger: 'blur' }]
      },
      basicDataChecked: {
        employeeCode: [{ required: true, message: '请输入工号', trigger: 'change' }]
      },
      operateType: 'insuranceCreateFlow',
      // 表单信息
      formData: {
        // 基本信息
        fullName: '',
        employeeCode: '',
        gender: '',
        birthDate: '',
        orgUnitName: '',
        idNumber: '',
        personnelGroupName: '',
        department: '',
        name: '',
        domicilePlace: '',
        mobile: '',
        // 工伤/工亡申报说明
        injuryType: '0',
        declarationType: '01',
        accountName: '',
        applyArea: '',
        // accountId: '',
        accountCode: '',
        effectiveDate: '',
        injuryDate: '',
        insuranceCompanyName: '',
        policyCode: '',
        injuryPart: '',
        diagnosis1: '',
        diagnosis2: '',
        isHospital: '',
        inHospitalDate: '',
        outHospitalDate: '',
        injuryProcess: '',
        // 工伤鉴定情况
        injuryStatus: '',
        isDisablity: '',
        disabilityGrade: '',
        injuryConfirmDate: '',
        judgeDate: '',
        // 费用报销
        firstApplyDate: '',
        firstShouldValue: '',
        firstRealSubsidy: '',
        firstRealExpenses: '',
        firstRealTotal: 0,
        secondApplyDate: '',
        secondShouldValue: '',
        secondRealSubsidy: '',
        secondRealExpenses: '',
        secondRealTotal: 0,
        transferredValue: '',
        positionName: '',
        isCompleted: ''
      },
      flowData: {
        operateType: 'insuranceCreateFlow'
      }
    }
  },
  watch: {
    formData: {
      handler () {
        this.formData.firstRealTotal =
          // parseFloat(Number(this.formData.firstShouldValue)) +
          parseFloat(Number(this.formData.firstRealSubsidy)) +
          parseFloat(Number(this.formData.firstRealExpenses))
        this.formData.secondRealTotal =
          // parseFloat(Number(this.formData.secondShouldValue)) +
          parseFloat(Number(this.formData.secondRealSubsidy)) +
          parseFloat(Number(this.formData.secondRealExpenses))
      },
      deep: true
    }
  },
  methods: {
    handleIconClick () {
      this.isShow = !this.isShow
    },
    handleConfirm (selected) {
      this.formData.employeeCode = selected[0].employeeCode
      this.getEmployeeMsg()
    },
    // 通过工号获取员工基本信息
    getEmployeeMsg () {
      req('iafJobBasicMsg', {employeeCode: this.formData.employeeCode}).then(data => {
        // 时间戳转换成标准时间格式
        data.birthDate = new Date(data.birthDate)
        this.formData = Object.assign({}, this.formData, data)
        this.formData.injuryType = '0'
        this.formData.declarationType = '01'
      })
    },
    postFlow () {
      // console.log(this.formData.accountId)
      return Object.assign({}, this.formData, this.flowData, {idNumber: this.$store.state.user.info.idNumber, isDisability: this.showDisability})
    },
    fillIn (data) {
      for (let key in data) {
        this.formData[key] = data[key]
      }
      this.showDisability = data.isDisability
      this.formData.injuryDate && (this.formData.injuryDate = new Date(this.formData.injuryDate))
    },
    isDisablityEvent (val) {
      console.log(val)
      if (val === 'Y') {
        this.showDisability = true
      } else if (val === 'N') {
        this.formData.disabilityGrade = ''
        this.showDisability = false
      }
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
      margin-bottom: 20px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0;
    }
    .injury-statues {
      display: flex;
    }
    .declaration, .injury{
      flex: 1;
    }
    .declaration-box {
      width: 300px;
    }
    .disability-status {
      display: inline-block;
    }
  }
  .el-form--inline /deep/ .el-form-item__content{
    width: 193px;
  }
  .emp-msg{
    font-size: 14px;
    font-weight:bold;
    padding-left:20px;
  }
  .el-row{
    margin-bottom:20px !important;
  }
  .textareaBox{
    display: block !important;
    /deep/ .el-form-item__label{
      line-height: 20px;
    }
    /deep/ .el-form-item__content{
      width:80%;
    }
  }
</style>
