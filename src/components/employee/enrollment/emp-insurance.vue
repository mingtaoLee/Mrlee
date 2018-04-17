<template>
  <section class="emp-insurance content-follow">
    <h2 class="info-title">保险信息</h2>
    <div>
      <!--参保地，，城市 -->
      
     <el-form label-width="96px" :model="hireInfo" class="form-main clearfix" >
        <el-row>
        <el-col :span="5">
          <el-form-item label="参保地" v-if="showMap.insuranceAreaType">
            <el-radio-group v-model="hireInfo.insuranceAreaType" :disabled="disabledMap.insuranceAreaType || hireInfo.tip">
              <el-radio label="Y">公司所在地</el-radio>
              <el-radio label="N">其它城市</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="7" v-if="hireInfo.insuranceAreaType === 'N'">
          <el-form-item
           label="请选择地区"
           prop="insuranceArea"
           :rules="[
              { required: true, message: '请选择地区', trigger: 'change,blur'},
            ]"
          >
          <!-- :panelAmount='2'  -->
              <i-select-area search @change="changeCity" v-model="hireInfo.insuranceArea" :returnNode="true" :disabled="disabledMap.insuranceAreaType || hireInfo.tip"></i-select-area>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="参保城市: " v-if="showMap.insuranceCityName">
            {{hireInfo.insuranceCityName}}
          </el-form-item>
        </el-col>
      </el-row>
     </el-form>

     <!-- 五险一金 -->
    <el-form 
      :model="insurance" 
      label-width="78px" 
      class="form-main clearfix" 
      v-for="(insurance, index) in hireInfo.empInsuranceList" 
      :key="index"
      v-if="showMap[insurance.insuranceType]"
      :ref="insurance.insuranceType"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item 
            :label="insurance.insuranceType!='0A'?getType(insurance.insuranceType) +'保险':getType(insurance.insuranceType)" 
            prop="isInsured"
            class="col-340"
            :rules="[{ required: true, message: '请选择是否参保', trigger: 'change'}]"            
          >
          <!-- TODO: 这组按钮的禁用状态要不要去掉？ -->
            <el-radio-group  
              v-model="insurance.isInsured"
              @change="changeRadio(insurance, $event)"
              :disabled="disabledMap[insurance.insuranceType] || hireInfo.tip || (hireInfo.hasInsurance && insurance.insuranceType!='0A') || (hireInfo.hasHouseFund && insurance.insuranceType ==='0A')"
              >
              <span class="mlr30">是否参保</span>
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="不参类型" 
            prop="noInsuredType" 
              :rules="insurance.isInsured === 'N' ? [
              { required: true, message: '类型不能为空', trigger: 'change,blur'}
            ] : {}"
          >
            <i-select 
              v-model="insurance.noInsuredType"
              parameter="NO_INSURED_TYPE"
              :disabled="disabledMap[insurance.insuranceType] || insurance.isInsured==='Y' || hireInfo.tip"
              >
            </i-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="参保户头">
            <el-tooltip effect="dark" :content="insurance.accountName" placement="top" v-if="insurance.isInsured === 'Y'">
              <el-input v-model="insurance.accountName"  :disabled="disabledMap[insurance.insuranceType]" readonly placeholder=""></el-input>
            </el-tooltip>
              <el-input v-else v-model="insurance.accountName" disabled placeholder=""></el-input>            
          </el-form-item>
        </el-col>
        <el-col :span="3">
              <!-- 公积金的支付方式 -->
          <el-form-item
           label="支付方式"
           prop="payWay"
           :rules="insurance.isInsured === 'Y' ? [
              { required: true, message: '支付方式不能为空', trigger: 'change,blur'},
            ] : {}"
          >
          <i-select 
              v-model="insurance.payWay"
              parameter="IAF_PAYMENT_TYPE"
              :disabled="disabledMap[insurance.insuranceType] || insurance.isInsured==='N' || hireInfo.tip"
              placeholder=""
              >
            </i-select>
          </el-form-item>
          </el-col>
            <!-- 公积金个人补充部分 -->
      
        <el-col :span="3">
          <el-form-item label="单位缴纳基数" 
            prop="unitInsuredCardinal"
            label-width="94px"
            :rules="insurance.isInsured === 'Y' ? [
             {required: true, validator: (rule, value, cb) => {
                let phoneTest = /^(?:0\.\d*[1-9]|[1-9]\d*(?:\.\d*[1-9])?)$/
              !value.toString() && cb('不能为空')
               value < insurance.unitInsuredCardinalMin && cb(`不能小于最低基数${insurance.unitInsuredCardinalMin}`)
               value > insurance.unitInsuredCardinalMax && cb(`不能大于最高基数${insurance.unitInsuredCardinalMax}`)
                value && !(phoneTest.test(value)) ? cb('请输入数字格式') : cb()
               }, trigger: 'blur'}] : {}"
          >
            <el-input placeholder="" v-model="insurance.unitInsuredCardinal" :disabled="disabledMap[insurance.insuranceType] || insurance.isInsured==='N' || hireInfo.tip"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="个人缴纳基数" 
            label-width="94px"
            prop="personInsuredCardinal"
            :rules="insurance.isInsured === 'Y' ? [
            {required: true, validator: (rule, value, cb) => {
                let phoneTest = /^(?:0\.\d*[1-9]|[1-9]\d*(?:\.\d*[1-9])?)$/
              !value.toString() && cb('不能为空')
               value < insurance.personInsuredCardinalMin && cb(`不能小于最低基数${insurance.personInsuredCardinalMin}`)
               value > insurance.personInsuredCardinalMax && cb(`不能大于最高基数${insurance.personInsuredCardinalMax}`)
                value && !(phoneTest.test(value)) ? cb('请输入数字格式') : cb()
               }, trigger: 'blur'}
            ] : {}"
          >
            <el-input placeholder="" v-model="insurance.personInsuredCardinal" :disabled="disabledMap[insurance.insuranceType] || insurance.isInsured==='N' || hireInfo.tip" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item 
            label="触发增员时间" 
            prop="beginDate" 
            class="col-227" 
            :rules="insurance.isInsured === 'Y' ? [
              { required: true, message: '时间不能为空', trigger: 'change'},
            ] : {}"
            
          >
            <el-date-picker
              placeholder=""
              type="date"
              v-model="insurance.beginDate"
              style="width: 100%;"
              @change="handleChange($event, insurance)"
              :disabled="disabledMap[insurance.insuranceType] || insurance.isInsured==='N' || hireInfo.tip">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 个人补充公积金部分 -->
    <el-form v-if="isShowPersonalPart && showMap['0A'] " label-width="200px" :model="hireInfo" class="form-main clearfix">
     <el-row>
      <el-col :span="6">
          <el-form-item label="个人补充公积金部分" 
            label-width="150px"
            prop="personalSupplement"
            :rules="[
              {required: true, validator: (rule, value, cb) => {
                let num = /^[0-9]*$/
                !value.toString() && cb('不能为空')
                value && !(num.test(value)) ? cb('请输入数字格式') : cb()
               }, trigger: 'blur'}
            ]"
          >
            <el-input :placeholder="disabledMap['0A'] && ''" v-model="hireInfo.personalSupplement" :disabled="disabledMap['0A'] || hireInfo.tip" ></el-input>
          </el-form-item>
        </el-col>
     </el-row>
    </el-form>
    </div>
  </section>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select'
  import {formatDateToMi} from 'utils/employee'
  import req from 'api/employee/personal'
  import moment from 'moment'
  import ISelectArea from 'components/common/i-select-area'

  export default {
    props: {
      hireInfo: Object
    },
    components: {
      ISelect,
      ISelectArea
    },
    data () {
      return {
        tip: false,
        // 险种的字典
        insType: {
          '01': '养老',
          '02': '失业',
          '03': '医疗',
          '04': '工伤',
          '05': '生育',
          '06': '补充工伤',
          '07': '大病医疗',
          '0A': '住房公积金'
        }
      }
    },
    created () {
      // 进入流程，如果基本信息的选择参保，默认值为参保
      // if (this.$route.query.taskKey === 'HRsupplementMessage') {
      this.hireInfo.empInsuranceList.length === 0 && this.hireInfo.insuranceAreaType !== 'N' && this.getInsuranceInfo()
      this.hireInfo.insuranceAreaType === 'Y' && this.getInsuranceCity()
      // }
    },
    watch: {
      // 改变参保地也需要重新获取五险一金的列表
      'hireInfo.insuranceAreaType' (newVal, oldVal) {
        newVal === 'Y' && this.getInsuranceCity()
        newVal === 'N' && this.hireInfo.empInsuranceList.length === 0 && (this.hireInfo.insuranceArea = '')
      },
      // 只有参保城市改变才需要重新获取保险列表，其他改变不需要重新获取
      'hireInfo.insuranceCityId': {
        handler: function (newVal, oldVal) {
          // 如果选择本公司参保则发送人事范围，如果选择其他地方参保则发送选择的区域id
          if (newVal) {
            this.hireInfo.insuranceAreaType === 'Y' ? this.getInsuranceInfo() : this.getInsuranceInfo(newVal)
          }
        },
        deep: true
      },
      'hireInfo.empPosition.employeeType': {
        handler: function (newVal, oldVal) {
          if (newVal === '3' || newVal === '4') {
            this.hireInfo.empInsuranceList.map(key => {
              key.isInsured = 'N'
            })
          }
        },
        deep: true
      },
      'hireInfo.empPosition.isGetAgain': {
        handler: function (newVal, oldVal) {
          console.log(newVal)
          if (newVal) {
            this.getInsuranceInfo()
          }
        },
        deep: true
      }
      // 'hireInfo.empEmployeeEmpContacts.gender': {
      //   handler: function (newVal, oldVal) {
      //     if (this.$route.query.taskKey === 'applicantFillIn') {
      //       newVal !== oldVal ? this.isOld() : ''
      //     }
      //   },
      //   deep: true
      // },
      // 'hireInfo.empEmployeeEmpContacts.birthDate': {
      //   handler: function (newVal, oldVal) {
      //     newVal !== oldVal ? this.isOld() : ''
      //   },
      //   deep: true
      // }
    },
    computed: {
      'isShowPersonalPart' () {
        let flag = ''
        flag = this.hireInfo.empInsuranceList.find(res => {
          return res.insuranceType === '0A' && res.isInsured === 'Y'
        })
        return !!flag
      }
    },
    methods: {
      // 日期选择器的赋值
      handleChange ($event, insurance) {
        $event ? insurance.beginDate = moment(new Date($event)).format('YYYY-MM-DD') : insurance.beginDate = ''
      },
      // 获取类型
      getType (type) {
        return this.insType[type]
      },
      // 改变选择是否参保按钮
      changeRadio (row, val) {
        // 参保则用复制的信息赋值
        if (row.isInsured === 'Y') {
          let data = this.hireInfo.copyInfo.find(item => { return item.insuranceType === row.insuranceType })
          this.$set(row, 'accountCode', data.accountCode)
          this.$set(row, 'accountName', data.accountName)
          this.$set(row, 'payWay', data.payWay)
          this.$set(row, 'empPayRatio', data.empPayRatio)
          this.$set(row, 'compPayRatio', data.compPayRatio)
          this.$set(row, 'householdCode', data.householdCode)
          this.$set(row, 'personInsuredCardinal', row.personInsuredCardinalMin)
          this.$set(row, 'unitInsuredCardinal', row.unitInsuredCardinalMin)
          row.noInsuredType = ''
          !row.beginDate && (row.beginDate = formatDateToMi(new Date()).da)
          this.$refs[row.insuranceType][0].validateField('noInsuredType', res => {})
        } else {
          row.accountName = ''
          row.accountCode = ''
          row.personInsuredCardinal = ''
          row.unitInsuredCardinal = ''
          row.beginDate = ''
          row.payWay = ''
          row.compPayRatio = ''
          row.empPayRatio = ''
          row.householdCode = ''
          // 对表单校验
          this.$refs[row.insuranceType][0].validateField('unitInsuredCardinal', res => {})
          this.$refs[row.insuranceType][0].validateField('personInsuredCardinal', res => {})
          this.$refs[row.insuranceType][0].validateField('payWay', res => {})
          this.$refs[row.insuranceType][0].validateField('beginDate', res => {})
        }
        // 如果是工伤为n则商业为y
        if (row.isInsured === 'N' && row.insuranceType === '04') {
          this.hireInfo.empPosition.hasCommercialInsurance = 'Y'
        }
      },
      // 超过法定年龄默认为否
      isOld () {
        let now = new Date()
        let birth = new Date(this.hireInfo.empEmployeeEmpContacts.birthDate).getTime()
        let sex = this.hireInfo.empEmployeeEmpContacts.gender
        ;(sex === 'F' && new Date(now.setFullYear(now.getFullYear() - 50)).getTime() >= birth) ? this.tip = true : this.tip = false
        if (!this.tip) {
          ;(sex === 'M' && new Date(now.setFullYear(now.getFullYear() - 60)).getTime() >= birth) ? this.tip = true : this.tip = false
        }
        // 超龄，默认不惨类型为超龄人员
        if (this.tip) {
          console.log(this.tip)
          this.hireInfo.empInsuranceList.map((res, idx) => {
            res.noInsuredType = '5'
          })
        }
        return !this.tip
      },
      // 获取五险一金数据
      getInsuranceInfo (val) {
        // 如果有参数则需要传递，不传人事范围
        let send = {}
        // 拼接参数
        send.employeeType = this.hireInfo.empPosition.employeeType
        send.orgUnitId = this.hireInfo.empPosition.orgUnitId
        send.domicileGrade = this.hireInfo.empPosition.domicileGrade
        send.domicileType = this.hireInfo.empEmployeeEmpContacts.domicileType
        if (val) {
          send.areaId = val
          send.personnelGroupCode = ''
        } else {
          send.areaId = ''
          send.personnelGroupCode = this.hireInfo.empPosition.personnelArea
        }
  
        req('getInsuranceInfo', send)
        .then(res => {
          // 复制一份信息
          this.hireInfo.copyInfo = JSON.parse(JSON.stringify(res))
          res.map(item => {
            // 根据基本信息的值设置是否参保
            item && (this.$set(item, 'isInsured', this.hireInfo.empEmployeeEmpContacts.hasInsurance))
            item && (item.insuranceType === '0A' ? (this.$set(item, 'isInsured', this.hireInfo.empEmployeeEmpContacts.hasHouseFund)) : '')
            item && (this.hireInfo.tip ? this.$set(item, 'noInsuredType', '5') : (this.$set(item, 'noInsuredType', '')))
            if ((item.insuranceType !== '0A' && this.hireInfo.empEmployeeEmpContacts.hasInsurance === 'Y') || (item.insuranceType === '0A' && this.hireInfo.empEmployeeEmpContacts.hasHouseFund === 'Y')) {
              item && (this.$set(item, 'unitInsuredCardinal', item.unitInsuredCardinalMin))
              item && this.$set(item, 'personInsuredCardinal', item.personInsuredCardinalMin)
              item && this.$set(item, 'beginDate', formatDateToMi(new Date()).da)
            } else {
              item && (this.$set(item, 'accountName', ''))
              item && (this.$set(item, 'accountCode', ''))
              item && (this.$set(item, 'payWay', ''))
              item && (this.$set(item, 'unitInsuredCardinal', ''))
              item && this.$set(item, 'personInsuredCardinal', '')
              item && this.$set(item, 'beginDate', '')
              item && this.$set(item, 'empPayRatio', '')
              item && this.$set(item, 'compPayRatio', '')
              item && this.$set(item, 'householdCode', '')
            }
          })
          this.$set(this.hireInfo, 'empInsuranceList', res)
        })
      },
      // 根据人事范围获取参保城市
      getInsuranceCity () {
        req('getInsuranceCity', {personnelGroupCode: this.hireInfo.empPosition.personnelArea})
        .then(res => {
          this.hireInfo.insuranceCityName = res.areaName
          this.hireInfo.insuranceCityId = res.areaId
        })
      },
      // 选择其他地区参保时，根据选择的地区，改变参保城市,
      changeCity (val) {
        console.log(val)
        this.hireInfo.insuranceCityName = val.areaName
        this.hireInfo.insuranceCityId = val.areaId
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mlr30 {
    padding-right: 8px;
  }
</style>

<style lang="scss">
  .emp-insurance {
    border-bottom: none;
    margin-bottom: 0;
    .col-227 {
      width: 230px !important;
      .el-form-item__label {
        width: 106px !important;
      }
      .el-form-item__content {
        margin-left: 106px !important;
      }
    }
    .col-252 {
      // width: 252px !important;
      .el-form-item__label {
        width: 132px !important;
      }
      .el-form-item__content {
        margin-left: 132px !important;
      }
    }

    .col-166 {
      // width: 400px;
      .el-form-item__label {
        width: 166px !important;
        margin-right: 50px;
      }
      .el-form-item__content {
        width: 400px !important;
      }
    } // 设置label宽度
    .col-340 {
      width: 250px !important;
      .el-form-item__label {
        width: 96px !important;
      }
      .el-form-item__content {
        .el-form-item__error {
          left: 40% !important;
        }
      }
    }

    .el-radio-group {
      font-size: 14px;
    }
    .el-radio__label {
      padding-left: 5px
    }
    .el-radio + .el-radio {
     margin-left: 2px;
    }
  }
    .popper__arrow {
     left: 40px !important;
   }
</style>



