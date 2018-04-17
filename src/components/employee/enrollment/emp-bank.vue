<template>
  <section class="emp-bank content-follow">
    <h2 class="info-title">银行卡信息</h2>

    <el-form
      :model="bank"
      label-width="100px"
      class="form-main clearfix"
      v-for="(bank, index) in empBankTaxList"
      :key="index"
      :rules="rules">
       <!-- <el-row> -->
          <div class="base">
          <el-form-item label="银行卡号" prop="bankNumber" v-if="showMap.bankNumber">
            <el-input v-model="bank.bankNumber" :disabled="disabledMap.bankNumber"></el-input>
          </el-form-item>

          <el-form-item label="开户行地区" prop="provinceNo" v-if="showMap.provinceNo">
            <i-select-area search @change="change" v-model="bank.provinceNo" :disabled="disabledMap.provinceNo"></i-select-area>
          </el-form-item>
          <el-form-item label="开户银行" prop="bankType" v-if="showMap.bankType">
            <i-select v-model="bank.bankType" parameter="BANK_TYPE" :disabled="disabledMap.bankType"></i-select>
          </el-form-item>
          <el-form-item label="开户行名称" prop="bankName" v-if="showMap.bankName">
            <el-input v-model="bank.bankName" :disabled="disabledMap.bankName" maxlength="30"></el-input>
          </el-form-item>
      <!-- </el-row> -->
    </div>
    </el-form>
  </section>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select'
  import req from 'api/employee/personal'
  import ISelectArea from 'components/common/i-select-area'
  export default {
    components: {
      ISelect,
      ISelectArea
    },
    props: {
      empBankTaxList: Array,
      empId: String
    },
    data () {
      /* eslint-disable */
      function luhnCheck (bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1) // 取出最后一位（与luhn进行比较）

        var first15Num = bankno.substr(0, bankno.length - 1) // 前15或18位
        var newArr = new Array()
        for (var i = first15Num.length - 1; i > -1; i--) {
          // 前15或18位倒序存进数组
          newArr.push(first15Num.substr(i, 1))
        }
        var arrJiShu = new Array() // 奇数位*2的积 <9
        var arrJiShu2 = new Array() // 奇数位*2的积 >9

        var arrOuShu = new Array() // 偶数位数组
        for (var j = 0; j < newArr.length; j++) {
          if ((j + 1) % 2 == 1) {
            // 奇数位
          if (parseInt(newArr[j]) * 2 < 9) { arrJiShu.push(parseInt(newArr[j]) * 2) } else arrJiShu2.push(parseInt(newArr[j]) * 2)
        } else arrOuShu.push(newArr[j]) // 偶数位
        }

        var jishu_child1 = new Array() // 奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array() // 奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
          jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
          jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
        }

        var sumJiShu = 0 // 奇数位*2 < 9 的数组之和
        var sumOuShu = 0 // 偶数位数组之和
        var sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0
        for (var m = 0; m < arrJiShu.length; m++) {
          sumJiShu = sumJiShu + parseInt(arrJiShu[m])
        }

        for (var n = 0; n < arrOuShu.length; n++) {
          sumOuShu = sumOuShu + parseInt(arrOuShu[n])
        }

        for (var p = 0; p < jishu_child1.length; p++) {
          sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
          sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
        }
        // 计算总和
        sumTotal =
          parseInt(sumJiShu) +
          parseInt(sumOuShu) +
          parseInt(sumJiShuChild1) +
          parseInt(sumJiShuChild2)

      // 计算luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10
        var luhn = 10 - k

        if (lastNum == luhn) {
          return true
        } else {
          return false
        }
      }

      // 检查联行号
      const validateBankNo = (rule, value, cb) => {
        var num = /^\d{12}$/
        !value && cb(new Error('联行号不能为空'))
        setTimeout(function () {
          !num.exec(value) ? cb(new Error('联行号必须为12位整数')) : cb()
        }, 0)
      }

      // 检查银行名称
       const validateBankName = (rule, value, cb) => {
        !value && cb(new Error("开户行名称不能为空"))
        
         let wordTest = /^[^\s]+$/
         !wordTest.test(value) ? cb(new Error("首尾不能含空格")) : cb();
      }
      // 检查银行卡号
      const checkBankNo = (rule, value, cb) => {
      
      // console.log(11212,value,rule)
        // 不能有空格
        if (value.indexOf(" ")!==-1) {
          cb(new Error('银行卡号不能有空格'))
          return false
        }
        var value = value.replace(/\s/g, '')
        if (value == '') {
          cb(new Error('银行卡号不能为空'))
          return false
        }
        if (value.length < 16 || value.length > 19) {
          cb(new Error('银行卡号长度必须在16到19之间'))
          return false
        }
        var num = /^\d*$/ // 全数字
        if (!num.exec(value)) {
          cb(new Error('银行卡号必须全为数字'))
          return false
        }
        // 开头6位
        var strBin =
          '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
        if (strBin.indexOf(value.substring(0, 2)) == -1) {
        cb(new Error('银行卡号开头6位不符合规范'))
        return false
        }
        // Luhn校验
        if (!luhnCheck(value)) {
          cb(new Error('银行卡号校验不通过'))
          return false
        } else {
          req('checkBankNumber',{empEmployeeId: this.empId,account:value,cardType:''})
          .then(res => {
            res ? cb(new Error('银行卡号已存在')) : cb()
          })
        }
      }
      return {
        rules: {
          bankNumber: [
            { required: true, validator: checkBankNo, trigger: 'blur' }
          ],
          bankType: [
            { required: true, message: '银行类别不能为空', trigger: 'change'}
          ],
          provinceNo: [
            { required: true, message: '省份不能为空', trigger: 'change'}
          ],
          bankNo: [
            { required: true, validator: validateBankNo, trigger: 'change'}
          ],
          bankName: [
            { required: true,validator: validateBankName,trigger: 'blur'}
          ]
        },
        provinceList: [],
        cityList: []
      }
    },
    computed: {
      bankList () {
        return 
      }
    },
    methods: {
      change (val) {
        console.log(this.empBankTaxList[0].provinceNo)
        // console.log(val)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .emp-bank {
    .base {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .content > * {
        width: 100%;
      }
      & > * {
        flex-basis: 25%;
      }
    }
    .form-main {
      .el-form-item {
        width: 290px;
      }
    }
  }
</style>


