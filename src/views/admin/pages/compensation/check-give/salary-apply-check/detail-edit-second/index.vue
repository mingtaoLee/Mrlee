<template>
  <el-form>
    <el-form-item label="薪资组" label-width="90px">
      <el-input  v-model="accountData.groupName" :disabled="true"></el-input>
    </el-form-item>

    <el-form-item label="公司" label-width="90px">
      <el-input  v-model="accountData.companyName" :disabled="true"></el-input>
    </el-form-item>

    <el-form-item label="基本户" label-width="90px">
      <el-input  v-model="accountData.basicAccount" :disabled="true"></el-input>
    </el-form-item>

    <el-form-item label="支付账户" label-width="90px">
      <el-select v-model="accountData.payAccount" placeholder="请选择" @change="change">
          <el-option
          v-for="item in payAccountData"
          :key="item.payAccount"
          :value="item.payAccount"
          :label="item.payAccount"
          >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="支付主体" label-width="90px">
      <el-input  v-model="accountData.paymentCompanyName" :disabled="true"></el-input>
    </el-form-item>

    <el-form-item label="支付银行类别" label-width="90px">
      <el-input  v-model="payBankLabel" :disabled="true"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import req from 'api/compensation/check-give/salaryApplyCheck'
import { getDict } from 'utils/index'
export default {
  props: {
    payrollAuditRecordId: String,
    companyAccountId: String,
    paymentCompanyName: String
  },
  data () {
    return {
      accountData: {
        groupId: '',
        companyAccountIdOld: '',
        companyAccountId: '',
        companyName: '',
        paymentCompanyName: '',
        companyCode: '',
        payrollAuditRecordId: '',
        groupName: '',
        payAccount: '',
        basicAccount: '',
        payBankType: '',
        paymentCompanyCode: ''
      },
      payAccountData: [],
      payBankLabel: '',
      payBankData: {}
    }
  },
  created () {
    this.fetch({payrollAuditRecordId: this.payrollAuditRecordId})
    this.accountData.companyAccountIdOld = this.companyAccountId
    this.accountData.paymentCompanyName = this.paymentCompanyName
  },
  methods: {
    // 得到页面信息
    fetch (options = {}) {
      req('getPayAccout', options)
      .then(res => {
        Object.keys(res).map(key => {
          this.accountData[key] = res[key]
        })
        // 得到支付账户选择器
        this.applyAccout({companyCode: this.accountData.companyCode})
        this.getType()
      })
    },
    applyAccout (data) {
      req('getCompanyPayAccount', data)
      .then(res => {
        this.payAccountData = res
      })
    },
    change () {
      for (let key = 0; key < this.payAccountData.length; key++) {
        if (this.payAccountData[key].payAccount === this.accountData.payAccount) {
          this.accountData.companyAccountId = this.payAccountData[key].companyAccountId
        }
      }
    },
    getType () {
      getDict('BANK_TYPE').then(data => {
        let payBankValue = this.accountData.payBankType
        this.payBankData = data.filter(function (key) {
          return key.value === payBankValue
        })
        this.payBankLabel = this.payBankData[0].label
      })
    }
  }
}
</script>