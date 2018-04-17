<template>
  <div>
    <!-- 社保申报 -->
    <i-process-flow
      processType="iafInsuranceApplicationFlow"
      @fillin="fillIn"
    >
      <div slot="applicationForm">
        <div class="module">
          <h2>用款申请单（保险专员）</h2>
          <el-form
            label-width="100px"
            :inline="true"
            :rules="rules"
            :model="formData"
            ref="form"
          >
            <el-row>
              <el-form-item label="用款单类型" prop="singleType" v-if="showMap.singleType">
                <i-select 
                  class="single-type"
                  :options="singleTypeOptions" 
                  :async="false" 
                  :multiple="true" 
                  v-model="formData.singleType" 
                  :disabled="disabledMap.singleType"
                  :collapse-tags="false"
                ></i-select>
              </el-form-item>
            </el-row>
            <el-form-item label="收款单位全称" prop="chargeUnit" v-if="showMap.chargeUnit">
              <el-input v-model="formData.chargeUnit" :disabled="disabledMap.chargeUnit"></el-input>
            </el-form-item>
            <el-form-item label="付款单位" prop="paymentUnit" v-if="showMap.paymentUnit" :inline-message="true" ref="paymentUnit">
              <remote-select 
                v-model="formData.paymentUnit" 
                :disabled="disabledMap.paymentUnit" 
                dataKey="accountsDataGrant"
                :props="paymentUnitProps"
                :extraParams="paymentUnitExtra"
              ></remote-select>
              <!-- <el-input v-model="formData.paymentUnit" :disabled="disabledMap.paymentUnit"></el-input> -->
            </el-form-item>
            <el-form-item label="收款单位开户行" prop="accountOpeningBank" v-if="showMap.accountOpeningBank">
              <!-- <el-input v-model="formData.accountOpeningBank" :disabled="disabledMap.accountOpeningBank"></el-input> -->
              <i-select v-model="formData.accountOpeningBank" :disabled="disabledMap.accountOpeningBank" parameter="BANK_TYPE"></i-select>
            </el-form-item>
            <el-form-item label="收款账号" prop="chargeAccount" v-if="showMap.chargeAccount">
              <el-input v-model="formData.chargeAccount" :disabled="disabledMap.chargeAccount"></el-input>
            </el-form-item>
            <!-- <el-form-item label="付款账号" prop="paymentAccount" v-if="showMap.paymentAccount">
              <el-input v-model="formData.paymentAccount" :disabled="disabledMap.paymentAccount"></el-input>
            </el-form-item> -->
            <el-form-item label="金额（数字）" prop="moneyNumber" v-if="showMap.moneyNumber">
              <el-input v-model="formData.moneyNumber" :disabled="disabledMap.moneyNumber"></el-input>
            </el-form-item>
            <el-form-item label="金额（大写）" v-if="showMap.moneyCharacter">
              <span>{{formData.moneyCharacter}}</span>
              <!-- <el-input v-model="formData.moneyCharacter" :disabled="true"></el-input> -->
            </el-form-item>
            <el-form-item label="用途" v-if="showMap.purpose">
              <el-input v-model="formData.purpose" :disabled="disabledMap.purpose"></el-input>
            </el-form-item>
            <el-form-item label="方式" v-if="showMap.approach">
              <el-select class="dateInput" v-model="formData.approach" :disabled="disabledMap.approach">
                <el-option label="转账" value="转账"></el-option>
                <el-option label="现金" value="现金"></el-option>
                <el-option label="电汇" value="电汇"></el-option>
                <el-option label="信汇" value="信汇"></el-option>
                <el-option label="票汇" value="票汇"></el-option>
                <el-option label="不付款" value="不付款"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" v-if="showMap.remark">
              <el-input v-model="formData.remark" :disabled="disabledMap.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </i-process-flow>
  </div>
</template>

<script>

import IProcessFlow from 'components/common/i-process-flow'
import processMixin from 'mixins/process'
import ISelect from 'components/common/i-select/i-select'
import RemoteSelect from 'components/compensation/remote-select'
export default {
  name: 'IafPayment',
  components: {
    IProcessFlow,
    ISelect,
    RemoteSelect
  },
  mixins: [processMixin],
  data () {
    return {
      formData: {
        singleType: '', // 用款单类型
        chargeUnit: '', // 收款单位
        paymentUnit: '', // 付款单位
        chargeAccount: '', // 收款帐号
        // paymentAccount: '', // 付款账号
        accountOpeningBank: '', // 收款单位开户行
        moneyCharacter: '', // 金额（大写）
        moneyNumber: '', // 金额（数字）
        purpose: '', // 用途
        remark: '', // 备注
        approach: '' // 方式
      },
      singleTypeOptions: [
        {label: '养老保险', value: '养老保险'},
        {label: '医疗保险', value: '医疗保险'},
        {label: '失业保险', value: '失业保险'},
        {label: '工伤保险', value: '工伤保险'},
        {label: '生育保险', value: '生育保险'},
        {label: '公积金', value: '公积金'},
        {label: '商业险', value: '商业险'},
        {label: '个税', value: '个税'}
      ],
      paymentUnitProps: {
        value: 'accountName',
        label: 'accountName'
      },
      paymentUnitExtra: {
        userId: this.$store.getters.userId
      },
      rules: {
        singleType: [{ required: true, message: '请输入用款单类型' }],
        chargeUnit: [{ required: true, message: '请输入收款单位' }],
        paymentUnit: [{ required: true, message: '请输入付款单位' }],
        chargeAccount: [{ validator: this.bankNumber }],
        // paymentAccount: [{ required: true, message: '请输入付款账号' }],
        moneyNumber: [
          { required: true, message: '请输入金额' },
          { validator: this.checkNumber }
        ]
      }
    }
  },
  watch: {
    '$store.getters.userId' (newVal) {
      console.log(newVal, 'newVal')
      this.paymentUnitExtra.userId = newVal
    }
  },
  methods: {
      // 银行卡号校验
    bankNumber (rule, value, cb) {
      value = value.replace(/\s/g, '')
      if (value === '') {
        cb()
        return false
      }
      var num = /^\d*$/ // 全数字
      if (!num.exec(value)) {
        cb(new Error('银行卡号必须全为数字'))
        return false
      }
      if (value.length < 16 || value.length > 19) {
        cb(new Error('银行卡号长度必须在16到19之间'))
        return false
      }
      // 开头6位
      var strBin =
        '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
      if (strBin.indexOf(value.substring(0, 2)) === -1) {
        cb(new Error('银行卡号开头6位不符合规范'))
        return false
      }
      cb()
      return true
    },
    checkNumber (rule, value, cb, source, options) {
      if (Number.isNaN(Number(value)) || String(value).includes(' ')) return cb('请输入数字')
      if (Number(value) < 0) return cb('请输入正数')
      if (Number(value) > 9999999999.99) return cb('不能大于10位数字')
      if (String(value).indexOf('.') >= 0 && (String(value).length - String(value).indexOf('.')) > 3) {
        this.formData.moneyNumber = String(this.formData.moneyNumber).slice(0, -1)
      }
      this.formData.moneyNumber = Number(this.formData.moneyNumber)
      this.formData.moneyCharacter = this.lowerToUpper(this.formData.moneyNumber)
      return cb()
    },
    // validateData () {
    //   let validateRuler = new Promise((resolve, reject) => {
    //     let validator = new AsyncValidator(this.rules)
    //   })
    // },
    // 金额小写转大写  只接受12位，两位小数
    lowerToUpper (num) {
      let strOutput = ''
      let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
      num += '00'
      let intPos = num.indexOf('.')
      if (intPos >= 0) {
        num = num.substring(0, intPos) + num.substr(intPos + 1, 2)
      }
      strUnit = strUnit.substr(strUnit.length - num.length)
      for (let i = 0; i < num.length; i++) {
        strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1)
      }
      return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, '零元')
    },
    postFlow () {
      return Object.assign(
        {},
        this.formData,
        { operateType: 'insuranceCreateFlow' },
        { idNumber: this.$store.state.user.info.idNumber }
      )
    },
    fillIn (data) {
      Object.assign(this.formData, data)
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
  .el-form-item /deep/ .el-form-item__content{
    min-width: 309px;
    .single-type{
      min-width: 730px;
    }
  }
</style>
