<template>
  <div>
    <i-process-flow
      @fillin="fillIn"
      processType="iafProcreationFlow"
    >
        <!-- 基本信息 -->
        <div class="module" slot="baseInformation">
          <h2>基本信息</h2>
          <el-form 
            label-width="100px"
            :model="basicData" 
            :rules="basicMsgChecked" 
            :inline="true" 
          >
            <el-form-item label="工号" prop="employeeCode" v-if="showMap.employeeCode">
              <!-- -->
              <template v-if="showInput">
                <el-input 
                  @click.native="handleIconClick"
                  v-model="basicData.employeeCode" 
                  :disabled="disabledMap.employeeCode" 
                  readonly
                >
                  <!--  -->
                  <i slot="suffix" class="el-input__icon el-icon-menu" v-if="!disabledMap.employeeCode"></i>
                </el-input>
                <i-personnel-select :isShow.sync="isShow" :multiple="false" @confirm="handleConfirm" v-if="!disabledMap.employeeCode"></i-personnel-select>
              </template>
              <span v-else>{{basicData.employeeCode}}</span>
            </el-form-item>
            <el-form-item label="姓名" v-if="showMap.fullName" label-width="100px">
              <el-input v-model="basicData.fullName" :disabled="disabledMap.fullName" readonly></el-input>
            </el-form-item>
            <el-form-item label="性别" v-if="showMap.gender" label-width="100px">
              <el-input v-model="sex" :disabled="disabledMap.gender" readonly></el-input>
            </el-form-item>
            <el-form-item label="人事范围" v-if="showMap.personnelGroupName" label-width="100px">
              <el-input v-model="basicData.personnelGroupName" :disabled="disabledMap.personnelGroupName" readonly></el-input>
            </el-form-item>
            <el-form-item label="部门" v-if="showMap.orgUnitName" label-width="100px">
              <el-input v-model="basicData.orgUnitName" :disabled="disabledMap.orgUnitName" readonly></el-input>
            </el-form-item>
            <el-form-item label="岗位" v-if="showMap.positionName" label-width="100px">
              <el-input v-model="basicData.positionName" :disabled="disabledMap.positionName" readonly></el-input>
            </el-form-item>
            <el-form-item label="身份证号码" v-if="showMap.idNumber" label-width="100px">
              <el-input v-model="basicData.idNumber" :disabled="disabledMap.idNumber" readonly></el-input>
            </el-form-item>
            <el-form-item label="联系地址" v-if="showMap.domicilePlace" label-width="100px">
              <el-input v-model="basicData.domicilePlace" :disabled="disabledMap.domicilePlace" readonly></el-input>
            </el-form-item>
            <el-form-item label="出生年月" v-if="showMap.birthDate" label-width="100px">
              <el-date-picker 
                class="dateInput" 
                type="date" 
                v-model="basicData.birthDate"
                :disabled="disabledMap.birthDate" 
                readonly></el-date-picker>
            </el-form-item>
            <el-form-item label="联系电话" v-if="showMap.mobile" label-width="100px">
              <el-input v-model="basicData.mobile" :disabled="disabledMap.mobile" readonly></el-input>
            </el-form-item>
            <!-- <el-form-item label="户头ID"  prop="accountId">
              <el-input v-model="basicData.accountId" :disabled="disabledMap.accountId"></el-input>
            </el-form-item> -->
            <el-form-item label="户头代码"  prop="accountCode">
              <el-input v-model="basicData.accountCode" :disabled="disabledMap.accountCode"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="module" slot="procreationDeclaration">
          <h2>生育申报说明</h2>
          <el-form :inline="true" label-width="100px" :rules="bearChecked" :model="detailData">
            <el-form-item label="申报人" prop="applicantId" v-if="showMap.applicantId">
              <el-input v-model="detailData.applicantId" :disabled="disabledMap.applicantId"></el-input>
            </el-form-item>
            <el-form-item label="出生年月" v-if="showMap.birthDate">
              <el-date-picker 
                class="dateInput" 
                type="date" 
                v-model="detailData.birthDate" 
                :disabled="disabledMap.birthDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="参保户头" v-if="showMap.maternityAccountName">
              <el-input v-model="detailData.maternityAccountName" :disabled="disabledMap.maternityAccountName"></el-input>
            </el-form-item>
            <el-form-item label="参保城市" v-if="showMap.applyArea">
              <el-input v-model="detailData.applyArea" :disabled="disabledMap.applyArea"></el-input>
            </el-form-item>
            <el-form-item label="参保时间" v-if="showMap.effectiveDate">
              <el-date-picker 
                class="dateInput" 
                type="date" 
                v-model="detailData.effectiveDate" 
                :disabled="disabledMap.effectiveDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="生育/流产时间" v-if="showMap.procreationDate">
              <el-date-picker 
                class="dateInput" 
                type="date" 
                v-model="detailData.procreationDate" 
                :disabled="disabledMap.procreationDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="社会保障卡号" prop="securityNumber" v-if="showMap.securityNumber">
              <el-input v-model="detailData.securityNumber" :disabled="disabledMap.securityNumber"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="module" slot="costReimbursement">
          <h2>费用报销情况</h2>
          <el-form :inline="true" label-width="100px" :model="costData" :rules="costCheck">
            <el-form-item label="费用报销时间" v-if="showMap.reimbursementate">
              <el-date-picker 
                class="dateInput" 
                type="date"
                v-model="costData.reimbursementDate"
                :disabled="disabledMap.reimbursementate"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="费用报销状态" prop="reimbursementStatus" v-if="showMap.reimbursementStatus">
              <i-select
                v-model="costData.reimbursementStatus"
                placeholder="请选择"
                :disabled="disabledMap.reimbursementStatus"
                parameter="IAF_EXPENSE_ACCOUNT_STATUS"
              ></i-select>
            </el-form-item>
            <el-form-item label="费用报销金额" v-if="showMap.reimbursemenVtalue">
              <el-input v-model="costData.reimbursementValue" :disabled="disabledMap.reimbursemenVtalue"></el-input>
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
import processMixin from 'mixins/process'
import iafBaseInfoMixin from 'mixins/compensation/iaf-base-info'

export default {
  components: {
    IProcessFlow,
    BasicMsgForm
  },
  data () {
    return {
      costCheck: {
        reimbursementStatus: [{ required: 'true', message: '请输入费用报销状态', trigger: 'blur' }],
        // accountId: [{ required: 'true', message: '请输入户头ID', trigger: 'blur' }]
        accountCode: [{ required: 'true', message: '请输入户头ID', trigger: 'blur' }]
      },
      bearChecked: {
        applicantId: [{ required: 'true', message: '请输入申请人', trigger: 'blur' }],
        securityNumber: [{ required: 'true', message: '请输入社会保障卡号', trigger: 'blur' }]
      },
      basicMsgChecked: {
        employeeCode: [{ required: 'true', message: '请输入工号', trigger: 'change' }]
      },
       // 显示人员工号弹出框
      isShow: false,
      showInput: true,
      sex: '',
      // 基本信息表单数据
      basicData: {
        fullName: '',
        employeeId: '',
        employeeCode: '',
        gender: '',
        personnelGroupCode: '',
        orgUorgUnitName: '',
        positionName: '',
        idNumber: '',
        domicilePlace: '',
        birthDay: '',
        // accountId: '',
        accountCode: '',
        mobile: ''
      },
      // 生育申报说明
      detailData: {
        applicantId: '',
        birthDate: '',
        maternityAccountName: '',
        applyArea: '',
        effectiveDate: '',
        procreationDate: '',
        securityNumber: ''
      },
      costData: {
        reimbursementate: '',
        reimbursementStatus: '',
        reimbursemenVtalue: ''
      },
      flowData: {
        operateType: 'insuranceCreateFlow'
      }
    }
  },
  mixins: [processMixin, iafBaseInfoMixin],
  methods: {
    // 获取员工基本信息
    handleConfirm (selected) {
      req('iafMaternityBasicData', {employeeCode: selected[0].employeeCode}).then(data => {
        // data为员工基本信息
        let _data = data
        req('iafGetEmpId', {employeeCode: selected[0].employeeCode}).then(data => {
          // data为员工编号
          this.basicData = Object.assign({}, this.basicData, _data)
          this.detailData.applyArea = _data.applyArea
          this.detailData.effectiveDate = _data.effectiveDate
          this.basicData.employeeId = data
          this.basicData.gender = _data.gender
          this.$d('GENDER', this.basicData.gender).then(label => {
            this.sex = label
          })
        })
      })
    },
    postFlow () {
      return Object.assign({}, this.basicData, this.detailData, this.costData, this.flowData)
    },
    fillIn (data) {
      for (let key in data) {
        this.basicData[key] = data[key]
        this.detailData[key] = data[key]
        this.costData[key] = data[key]
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
