<template>
  <el-form :rules="rules" :model="accountData" ref="form">
    <el-form-item label="公司" label-width="60px">
      <el-input  v-model="accountData.companyName" :disabled="true"></el-input>
    </el-form-item>

    <el-form-item label="基本户" label-width="60px" prop="basicAccount">
      <el-input placeholder="请输入" v-model="accountData.basicAccount"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    companyName: String,
    companyAccountId: String,
    companyCode: String,
    basicAccount: String
  },
  data () {
    /* eslint-disable */
    function luhnCheck (bankno) {
      let lastNum = bankno.substr(bankno.length - 1, 1) // 取出最后一位（与luhn进行比较）

      let first15Num = bankno.substr(0, bankno.length - 1) // 前15或18位
      let newArr = []
      for (let i = first15Num.length - 1; i > -1; i--) {
          // 前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1))
      }
      let arrJiShu = [] // 奇数位*2的积 <9
      let arrJiShu2 = [] // 奇数位*2的积 >9

      let arrOuShu = [] // 偶数位数组
      for (let j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) {
            // 奇数位
          if (parseInt(newArr[j]) * 2 < 9) { arrJiShu.push(parseInt(newArr[j]) * 2) } else arrJiShu2.push(parseInt(newArr[j]) * 2)
        } else arrOuShu.push(newArr[j]) // 偶数位
      }

      let jiShuChild1 = [] // 奇数位*2 >9 的分割之后的数组个位数
      let jiShuChild2 = [] // 奇数位*2 >9 的分割之后的数组十位数
      for (let h = 0; h < arrJiShu2.length; h++) {
        jiShuChild1.push(parseInt(arrJiShu2[h]) % 10)
        jiShuChild2.push(parseInt(arrJiShu2[h]) / 10)
      }

      let sumJiShu = 0 // 奇数位*2 < 9 的数组之和
      let sumOuShu = 0 // 偶数位数组之和
      let sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
      let sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
      let sumTotal = 0
      for (let m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m])
      }

      for (let n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n])
      }

      for (let p = 0; p < jiShuChild1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jiShuChild1[p])
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jiShuChild2[p])
      }
        // 计算总和
      sumTotal =
          parseInt(sumJiShu) +
          parseInt(sumOuShu) +
          parseInt(sumJiShuChild1) +
          parseInt(sumJiShuChild2)

      // 计算luhn值
      let k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10
      let luhn = 10 - k

      if (lastNum == luhn) {
        return true
      } else {
        return false
      }
    }
          // 检查银行卡号
    function checkBankNo (rule, value, cb) {
      let ReValue = value.replace(/\s/g, '')
      if (ReValue === '') {
        cb(new Error('银行卡号不能为空'))
        return false
      }
      let num = /^\d*$/ // 全数字
      if (!num.exec(ReValue)) {
        cb(new Error('银行卡号必须全为数字'))
        return false
      }
        // 开头6位
      let strBin =
          '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
      if (strBin.indexOf(ReValue.substring(0, 2)) === -1) {
        cb(new Error('银行卡号开头6位不符合规范'))
        return false
      }
      if (ReValue.length > 19){
          cb(new Error('银行卡号长度必须在16到19之间'))
          return false
      }
        // Luhn校验
      // if (!luhnCheck(ReValue)) {
      //   cb(new Error('银行卡号校验不通过'))
      //   return false
      // }
      cb()
      return true
    }
    function checkBankNoSecond (rule, value, cb) {
       let ReValue = value.replace(/\s/g, '')
       if (ReValue.length < 16 || ReValue.length > 19){
          cb(new Error('银行卡号长度必须在16到19之间'))
          return false
      } else {
        if (!luhnCheck(value)) {
          cb(new Error('银行卡号校验不通过, 请输入正确的卡号'))
          return false
         }
      }
      cb()
      return true
    }
    return {
      rules: {
        basicAccount: [
          { required: true, validator: checkBankNo, trigger: 'change' },
         { required: true, validator: checkBankNoSecond, trigger: 'blur' }
        ]
      },
      accountData: {
        companyName: '',
        companyCode: '',
        basicAccount: '',
        companyAccountId: ''
      },
      multipleSelection: [],
      dataList: []
    }
  },
  created () {
    this.accountData.companyCode = this.companyCode
    this.accountData.basicAccount = this.basicAccount
    this.accountData.companyAccountId = this.companyAccountId
    this.accountData.companyName = this.companyName
  },
  methods: {
    /** 数据校验 */
    validate () {
      return new Promise(resolve => {
          // ele自带validate验证，根据rule
        this.$refs.form.validate(res => {
          if (res) {
            resolve(this.accountData)
          }
        })
      })
    }
  }
}
</script>