<template>
  <div>
    <i-process-flow
      @fillin = "fillIn"
      processType="iafHpfundApplicationFlow"
    >
      <div slot="applicationForm" class="content-follow">
        <h2 class="info-title">用款申请单（户头管理员）</h2>
        <div class="info-content">
          <div class="inline-form">
            <el-form
              label-width="100px" 
              class="demo-form-inline"
              :inline="true"
              :model="formData"
              :rules="rules"
            >
              <el-form-item label="收款单位" prop="chargeUnit" v-if="showMap.chargeUnit">
                <el-input v-model="formData.chargeUnit" :disabled="disabledMap.chargeUnit"></el-input>
              </el-form-item>
              <el-form-item label="关联单位" prop="relationUnit" v-if="showMap.relationUnit">
                <el-input v-model="formData.relationUnit" :disabled="disabledMap.relationUnit"></el-input>
              </el-form-item>
              <el-form-item label="账号" prop="account" v-if="showMap.account">
                <el-input v-model="formData.account" :disabled="disabledMap.account"></el-input>
              </el-form-item>
              <el-form-item label="开户银行" prop="accountOpeningBank" v-if="showMap.accountOpeningBank">
                <el-input v-model="formData.accountOpeningBank" :disabled="disabledMap.accountOpeningBank"></el-input>
              </el-form-item>
              <el-form-item label="金额（大写）" v-if="showMap.moneyCharacter">
                <el-input v-model="formData.moneyCharacter" :disabled="disabledMap.moneyCharacter"></el-input>
              </el-form-item>
              <el-form-item label="金额" prop="moneyNumber" v-if="showMap.moneyNumber">
                <el-input v-model.number="formData.moneyNumber" :disabled="disabledMap.moneyNumber"></el-input>
              </el-form-item>
              <el-form-item label="用途" v-if="showMap.purpose">
                <el-input v-model="formData.purpose" :disabled="disabledMap.purpose"></el-input>
              </el-form-item>
              <el-form-item label="方式" v-if="showMap.approach">
                <el-select v-model="formData.approach" :disabled="disabledMap.approach">
                  <el-option label="转账" value="转账"></el-option>
                  <el-option label="现金" value="现金"></el-option>
                  <el-option label="电汇" value="电汇"></el-option>
                  <el-option label="信汇" value="信汇"></el-option>
                  <el-option label="票汇" value="票汇"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </i-process-flow>
  </div>
</template>

<script>

import IProcessFlow from 'components/common/i-process-flow'
import processMixin from 'mixins/process'

export default {
  name: 'FundPayment',
  mixins: [processMixin],
  components: {
    IProcessFlow
  },
  data () {
    return {
      formData: {
        chargeUnit: '', // 收款单位
        relationUnit: '', // 关联单位
        account: '', // 收款帐号
        accountOpeningBank: '', // 开户银行
        moneyCharacter: '', // 金额（大写）
        moneyNumber: '', // 金额（数字）
        purpose: '', // 用途
        approach: '' // 方式
      },
      rules: {
        chargeUnit: [{ required: true, message: '请输入收款单位' }],
        relationUnit: [{ required: true, message: '请输入付款单位' }],
        account: [{ required: true, message: '请输入收款帐号' }],
        accountOpeningBank: [{ required: true, message: '请输入付款账号' }],
        moneyNumber: [
          { required: true, message: '请输入数字金额' },
          { type: 'number', message: '请输入数字金额' }
        ]
      }
    }
  },
  computed: {
    idNumber () {
      return this.$store.state.user.info.idNumber
    }
  },
  methods: {
    postFlow () {
      return Object.assign(
        {},
        this.formData,
        { idNumber: this.idNumber },
        { operateType: 'insuranceCreateFlow' }
      )
    },
    fillIn (data) {
      Object.assign(this.formData, data)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form-item /deep/ .el-form-item__content{
    width: 193px;
  }
</style>
