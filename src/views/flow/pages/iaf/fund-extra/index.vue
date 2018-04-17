<template>
  <div>
    <i-process-flow
      @fillin="fillIn"
      processType="iafReservedFundExtractFlow"
    >
      <div slot="extractionFundApplication" class="content-follow">
        <h2 class="info-title">公积金提取申请</h2>
        <div class="info-content">
          <el-form :model="formData" :inline="true" label-width="100px" :rules="formDataCheck">
            <!-- <el-form-item label="工号">
              <el-input @blur="getBasicMsg" v-model="formData.employeeCode"></el-input>
            </el-form-item> -->
            <el-form-item label="工号" prop="employeeCode" v-if="showMap.employeeCode">
              <!-- -->
              <template v-if="showInput">
                <el-input 
                  @click.native="handleIconClick" 
                  readonly
                  v-model="formData.employeeCode" 
                  :disabled="disabledMap.employeeCode"
                >
                  <!--  -->
                  <i slot="suffix" class="el-input__icon el-icon-menu" v-if="!disabledMap.employeeCode"></i>
                </el-input>
                <i-personnel-select 
                  v-if="!disabledMap.employeeCode"
                  @confirm="handleConfirm" 
                  :isShow.sync="fundShow" 
                  :multiple="false" 
                ></i-personnel-select>
              </template>
              <span v-else>{{formData.employeeCode}}</span>
            </el-form-item>
            <el-form-item label="姓名" v-if="showMap.fullName">
              <el-input v-model="formData.fullName" :disabled="disabledMap.employeeCode"></el-input>
            </el-form-item>
            <el-form-item label="身份证" v-if="showMap.idNumber">
              <el-input v-model="formData.idNumber" :disabled="disabledMap.idNumber"></el-input>
            </el-form-item>
            <el-form-item label="提取类型" prop="extractType" v-if="showMap.extractType">
              <el-select v-model="formData.extractType" placeholder="请选择" :disabled="disabledMap.extractType">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="现户头" v-if="showMap.hpfundAccountName">
              <el-input v-model="formData.hpfundAccountName" :disabled="disabledMap.hpfundAccountName"></el-input>
            </el-form-item>
            <el-form-item label="其他说明" v-if="showMap.declare" class="other">
              <el-input
                class="textarea-width"
                type="textarea"
                placeholder="请输入内容"
                v-model="formData.declare"
                :disabled="disabledMap.declare"
                :rows="3"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="accountExtractingInformation" class="content-follow">
        <h2 class="info-title">提取账户信息</h2>
        <div class="info-content">
          <el-form :model="formData" label-width="100px" :inline="true" :rules="formDataCheck">
            <el-form-item label="开户行" prop="openingBank" v-if="showMap.openingBank">
              <el-input v-model="formData.openingBank" :disabled="disabledMap.openingBank"></el-input>
            </el-form-item>
            <el-form-item label="账户类型" v-if="showMap.accountType">
              <el-input v-model="formData.accountType" :disabled="disabledMap.accountType"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="accountNumber" v-if="showMap.accountNumber">
              <el-input v-model="formData.accountNumber" :disabled="disabledMap.accountNumber"></el-input>
            </el-form-item>
            <el-form-item label="相关附件">
              <a href="#">公积金提取须知.xls</a>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </i-process-flow>
    <!-- <i-personnel-select ref="iPersonnelSelect" :isShow.sync="isShow"></i-personnel-select> -->
  </div>
</template>

<script>

import IProcessFlow from 'components/common/i-process-flow'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import processMixin from 'mixins/process'
import req from 'api/iaf/iaf-flow'

export default {
  name: 'FundPayment',
  mixins: [processMixin],
  data () {
    return {
      formDataCheck: {
        employeeCode: [{ required: 'true', message: '请输入工号' }],
        extractType: [{ required: 'true', message: '请选择提取类型', trigger: 'change' }],
        openingBank: [{ required: 'true', message: '请输入开户行' }],
        accountNumber: [{ required: 'true', message: '请输入账号' }]
      },
      // 显示人员工号弹出框
      fundShow: false,
      showInput: true,
      options: [
        {value: '0', label: '销户提取'},
        {value: '1', label: '租房提取'},
        {value: '2', label: '使用提取'}
      ],
      personnels: '',
      isShow: false,
      formData: {
        fullName: '',
        employeeCode: '',
        extractType: '',
        idNumber: '',
        hpfundAccountName: '',
        declare: '',
        openingBank: '',
        accountNumber: '',
        accountType: ''
      },
      flowData: {
        operateType: 'insuranceCreateFlow'
      }
    }
  },
  components: {
    IProcessFlow,
    iPersonnelSelect
  },
  methods: {
    handleConfirm (selected) {
      req('fundExtractGetBasicMsg', {employeeCode: selected[0].employeeCode}).then(data => {
        this.formData.fullName = data.fullName
        this.formData.idNumber = data.idNumber
        this.formData.hpfundAccountName = data.hpfundAccountName
        this.formData.employeeCode = data.employeeCode
      })
    },
    // 弹出框的显示
    handleIconClick () {
      this.fundShow = !this.fundShow
    },
    postFlow () {
      return Object.assign({}, this.formData, this.flowData)
    },
    fillIn (data) {
      this.formData = data
    }
  }
}
</script>
<style lang="scss" scoped>
  .inline-form{
    width: 715px;
  }
  .block-form{
    width: 350px;
    a{
      color: blue;
    }
  }
  .textarea-width{
    width:500px;
  }
 .el-form-item /deep/ .el-form-item__content{
    width: 193px;
  }
  .other{
    display: block;
  }
</style>
