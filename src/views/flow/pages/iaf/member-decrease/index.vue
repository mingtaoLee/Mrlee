<template>
  <div>
    <!-- :model="empEmployeeId"  自动选人时必须要加上-->
    <i-process-flow
      processType="iafDecreaseMemberFlow"
      @fillin="fillIn"
      v-loading="loading"
    >
      <div slot="baseInformation" class="content-follow">
        <h2 class="info-title">基本信息</h2>
        <div class="info-content">
          <div class="inline-form">
            <el-form 
              class="demo-form-inline"
              label-width="150px" 
              :model="iafInfo" 
              :rules="rules" 
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item label="工号" prop="employeeCode"  v-if="showMap.employeeCode">
                    <template v-if="showInput">
                      <el-input 
                        v-model="iafInfo.employeeCode" 
                        readonly
                        @click.native="handleIconClick" 
                        :disabled="disabledMap.employeeCode"
                      >
                        <i slot="suffix" class="el-input__icon el-icon-menu" v-if="!disabledMap.employeeCode"></i>
                      </el-input>
                      <i-personnel-select 
                        v-if="!disabledMap.employeeCode"
                        @confirm="handleConfirm"  
                        :isShow.sync="isShow" 
                        :multiple="false" 
                        filterType="all"
                      ></i-personnel-select>
                    </template>
                    <span v-else>{{iafInfo.employeeCode}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="姓名" v-if="showMap.fullName">
                    <span>{{iafInfo.fullName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="年龄" v-if="showMap.age">
                    <span>{{iafInfo.age}}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="人事范围" v-if="showMap.personnelGroupName">
                    <span>{{iafInfo.personnelGroupName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="职位" v-if="showMap.positionName">
                    <span>{{iafInfo.positionName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别" v-if="showMap.gender">
                    <dict-show v-model="iafInfo.gender" parameter="GENDER"></dict-show>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="身份证号码" v-if="showMap.idNumber">
                    <span>{{iafInfo.idNumber}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="户口所在地" v-if="showMap.domicilePlace">
                    <span>{{iafInfo.domicilePlace}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="户口性质" v-if="showMap.domicileType">
                    <dict-show v-model="iafInfo.domicileType" parameter="DOMICILE_TYPE"></dict-show>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="户口级别" v-if="showMap.domicileGrade || iafInfo.domicileGrade">
                    <dict-show v-model="iafInfo.domicileGrade" parameter="DOMICILE_LEVE"></dict-show>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系电话" v-if="showMap.mobile">
                    <span>{{iafInfo.mobile}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="参保地" v-if="showMap.compArea">
                    <span>{{iafInfo.insuranceCity}}</span>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form>
          </div>
        </div>
      </div>
      <div slot="decreaseInformation" class="content-follow">
        <h2 class="info-title">减员信息</h2>
        <div class="info-content">
          <table-pay-base 
            editPayBase="false"
            :columns="columns" 
            :iafInfo="iafInfo"
            :benchmarks="benchmarks"
            :isSelect="true"
            :taskNumber="taskNumber"
            :checkedType.sync="selectedInsuranceType"
            :canAddInsuranceType="canAddInsuranceType"
            :canAddInsuranceTypeNumber="canAddInsuranceTypeNumber"
          ></table-pay-base>
        </div>
      </div>
      <div slot="decreaseReason" class="content-follow">
          <div class="tabMsg">
            <header>减员原因<span style="color: #ff6464">(必填)</span></header>
            <section>
              <el-form :model="iafInfo" :rules="rules">
                <el-form-item prop="reason">
                  <i-select
                    v-model="iafInfo.reason"
                    parameter="IAF_DEDUCE_REASON"
                    required
                    @change="handleSelectReason"
                    :disabled="disabledMap.insReasonTable"
                  ></i-select>
                </el-form-item>
              </el-form>
            </section>
          </div>
      </div>
    </i-process-flow>
  </div>
</template>

<script>
import IProcessFlow from 'components/common/i-process-flow'
import TablePayBase from '../components/table-pay-base'
import processMixin from 'mixins/process'
import iafBaseDecreaseMixin from 'mixins/compensation/iaf-base-decrease'
import req from 'api/iaf/iaf-flow'
import DictShow from '../components/dict-show'
export default {

  name: 'iafDecrease',

  components: {
    IProcessFlow,
    TablePayBase,
    DictShow
  },

  data () {
    return {
      checkType: {
        checkedFund: []
      },
      loading: false,
      taskNumber: 0,
      typeAll: ['endowment', 'unemployment', 'medicare', 'employmentInjury', 'maternity', 'supplyEmployeeInjury', 'supplyMedicare', 'hpfund'],
      insuranceType: {
        '01': 'endowment',
        '02': 'unemployment',
        '03': 'medicare',
        '04': 'employmentInjury',
        '05': 'maternity',
        '06': 'supplyEmployeeInjury',
        '07': 'supplyMedicare',
        '0A': 'hpfund'
      },
      empEmployeeId: {
        'endowmentEmployeeId': '',
        'unemploymentEmployeeId': '',
        'medicareEmployeeId': '',
        'employmentInjuryEmployeeId': '',
        'maternityEmployeeId': '',
        'supplyEmployeeInjuryEmployeeId': '',
        'supplyMedicareEmployeeId': '',
        'hpfundEmployeeId': ''
      },
      selectedInsuranceType: [],
      columns: ['selectType', 'account'],
      isShow: false,
      showInput: true,
      rules: {
        employeeCode: [{ required: true, message: '请填写工号', trigger: 'change' }],
        reason: [{ required: true, message: '请选择减员原因' }]
      },
      checkRules: {
        checkedFund: [{ type: 'array', required: true, message: '请选择减员品种' }]
      },
      getBackInsuranceType: {},
      canAddInsuranceType: [],
      canAddInsuranceTypeNumber: 0
    }
  },

  mixins: [processMixin, iafBaseDecreaseMixin],

  watch: {
    benchmarks (val) {
      let {
        endowmentAccountName,
        medicareAccountName,
        unemploymentAccountName,
        employmentInjuryAccountName,
        maternityAccountName,
        hpfundAccountName,
        supplyEmployeeInjuryAccountName,
        supplyMedicareAccountName
      } = val

      Object.assign(this.iafInfo, {
        endowmentAccountName,
        medicareAccountName,
        unemploymentAccountName,
        employmentInjuryAccountName,
        maternityAccountName,
        hpfundAccountName,
        supplyEmployeeInjuryAccountName,
        supplyMedicareAccountName
      })
    },
    selectedInsuranceType (val, oldVal) {
      // 自动选人时用于给选择的险种自动添加保险管理员, 当保险管理员id为空时赋值为'-1',这样就会变成手动选人
      if (val.length > oldVal.length) {
        val.forEach(item => {
          !oldVal.includes(item) && (this.empEmployeeId[`${item}EmployeeId`] = this.benchmarks[`${item}EmployeeId`] || '-1') && (this.iafInfo[`${item}EmployeeId`] = this.benchmarks[`${item}EmployeeId`])
        })
      } else {
        oldVal.forEach(item => {
          !val.includes(item) && (this.empEmployeeId[`${item}EmployeeId`] = '') && (this.iafInfo[`${item}EmployeeId`] = this.benchmarks[`${item}EmployeeId`])
        })
      }
    }
  },
  methods: {
    /**
     * 校验并且获取信息
     */
    _validateAndGetInfo () {
      this.validateAndGetBaseInfo(this.validateDecrease)
    },

    handleConfirm (selected) {
      this.loading = true
      this.iafInfo.employeeCode = selected[0].employeeCode
      this.selectedInsuranceType = []
      this._validateAndGetInfo()
    },

    handleIconClick () {
      this.isShow = !this.isShow
    },
    getSelectedInsuranceType () {
      Object.keys(this.iafInfo).forEach(item => {
        this.typeAll.includes(item) && this.iafInfo[item] && this.selectedInsuranceType.push(item)
      })
    },

    checkedChoose (cruentChoose) {
      this.iafInfo.insurance = cruentChoose.includes(1)
      this.iafInfo.hpfund = cruentChoose.includes(2)
    },
    /**
     * 校验账号是否能做减员
     */
    validateDecrease () {
      return req('decreasedInsuranceTypeByEmployeeCode', {employeeCode: this.iafInfo.employeeCode})
      .then((data) => {
        this.getBackInsuranceType = data
      })
      .catch(() => { this.loading = false })
    },
        /**
     * 获取参保基数
     */
    getBenchmark () {
      return this.$store.dispatch('GET_IAFPAYBASEFORDECREASING', {employeeCode: this.iafInfo.employeeCode})
      .then(data => {
        this.benchmarks = data
        this.iafInfo.hpfundAreaId = data.areaId
        this.iafInfo.insuranceAreaId = data.areaId
        // 通过areaId得到参保地中文名
        this.getCityName(data)
        // 判断是否能减员的险种
        this.canInsuranceType(this.getBackInsuranceType)
        // 判断基数是否为null，如果为null才不显示此险种
        this.canShowInsuranceType(data)
        this.loading = false
      })
      .catch(() => {
        Object.keys(this.benchmarks).forEach(key => {
          this.benchmarks[key] = ''
        })
        this.loading = false
      })
    },
    /**
     * 判断基数是否为空，如果为空不显示此险种
     */
    canShowInsuranceType (data) {
      for (let item of this.typeAll) {
        if (!data[item + 'AccountName']) {
          this.canAddInsuranceType.indexOf(item) > -1 && this.canAddInsuranceType.splice(this.canAddInsuranceType.indexOf(item), 1)
        }
      }
      this.canAddInsuranceTypeNumber = this.canAddInsuranceType.length
      this.selectedInsuranceType = this.canAddInsuranceType
      !this.canAddInsuranceTypeNumber && this.$message.warning('该员工无险种可发起流程')
    },
    /**
     * 通过后端返回的数据获取可减员的险种
     * @param {*} data
     */
    canInsuranceType (data) {
      this.canAddInsuranceType = []
      this.selectedInsuranceType = []
      Object.keys(data).map(item => {
        if (data[item]) {
          Object.keys(this.insuranceType).forEach(type => {
            this.insuranceType[type] === item && this.canAddInsuranceType.push(this.insuranceType[type])
          })
          this.canAddInsuranceTypeNumber = this.canAddInsuranceType.length
        }
      })
    },
    postFlow () {
      return Object.assign({}, this.iafInfo,
        {
          canAddInsuranceType: this.canAddInsuranceType,
          canAddInsuranceTypeNumber: this.canAddInsuranceTypeNumber
        }, {operateType: 'insuranceUpdateFlow'})
    },

    fillIn (data) {
      data.employeeCode && (this.showInput = false)
      this.canAddInsuranceType = data.canAddInsuranceType
      this.canAddInsuranceTypeNumber = data.canAddInsuranceTypeNumber
      this.iafInfo = data
      this.taskNumber++
      this.getSelectedInsuranceType()
    }
  }

}
</script>
<style lang="scss" scoped>
  .inline-form{
    .radioMargin{
      .el-radio+.el-radio{
        margin-left: 0px;
      }
    }
  }
  .info-content{
    .select{
      font-size: 14px;
      text-align: left;
      /deep/ .el-form-item__error{
        top: 20%;
        left: 230px;
      }
    }
  }
  .tabMsg{
    margin: 0 auto;
    width: 100%;
    font-weight: bold;
    header{
      color: #333;
      font-size: 14px;
      line-height: 40px;
    }
    section{
      font-weight: normal;
      width: 310px;
      .el-row{
        height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        border-bottom: 1px #B3C0D1 solid;
        &:last-child{
          height: 70px;
          border-bottom: none;
        }
      }
    }
  }
</style>
