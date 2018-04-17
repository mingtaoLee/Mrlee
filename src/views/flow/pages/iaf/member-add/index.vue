<template>
    <!-- :model="empEmployeeId"  自动选人时必须要加上-->
  <i-process-flow
    processType="iafAddMemberFlow"
    @fillin = "fillIn"
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
                <el-form-item label="工号" prop="employeeCode" v-if="showMap.employeeCode">
                  <template v-if="showInput">
                    <el-input 
                      v-model="iafInfo.employeeCode" 
                      readonly
                      @click.native="handleIconClick"
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
                <el-form-item label="职位" v-if="showMap.positionName">
                  <span>{{iafInfo.positionName}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="联系电话" v-if="showMap.mobile">
                  <span>{{iafInfo.mobile}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="人事范围" v-if="showMap.personnelGroupName">
                  <span>{{iafInfo.personnelGroupName}}</span>
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
                <el-form-item label="身份证号码" v-if="showMap.idNumber">
                  <span>{{iafInfo.idNumber}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别" v-if="showMap.gender">
                  <dict-show v-model="iafInfo.gender" parameter="GENDER"></dict-show>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="户口所在地" v-if="showMap.domicilePlace">
                  <span>{{iafInfo.domicilePlace}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="户口性质" v-if="showMap.domicileType">
                  <dict-show v-model="iafInfo.domicileType" parameter="DOMICILE_TYPE"></dict-show>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="参保地" class="radioMargin" v-if="showMap.selectArea">
                  <el-radio v-model="selectArea" :label="true" :disabled="disabledMap.selectArea">录用公司所在地</el-radio>
                  <el-radio v-model="selectArea" :label="false" :disabled="disabledMap.selectArea" v-show="false">选择其他城市</el-radio>
                  <i-select-area 
                    v-show="showSelectArea" 
                    @change="handleAreaChange" 
                    :id="iafInfo.areaId" 
                    :disabled="disabledMap.selectArea"
                  ></i-select-area>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="参保城市" v-if="showMap.compArea">
                  <span>{{iafInfo.insuranceCity}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="户口级别" v-if="showMap.domicileGrade && iafInfo.domicileGrade">
                  <dict-show v-model="iafInfo.domicileGrade" parameter="DOMICILE_LEVE"></dict-show>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="个人补充公积金" v-if="showMap.empPaySupplyment && showEmpPaySupplyment" prop="empPaySupplyment">
                  <el-input v-model="iafInfo.empPaySupplyment" :disabled="disabledMap.empPaySupplyment"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>

    <div slot="additionalInformation" class="content-follow">
      <h2 class="info-title">增员信息</h2>
      <div class="info-content">
        <table-pay-base
          :columns="columns"
          :iafInfo="iafInfo"
          :benchmarks="benchmarks"
          :isSelect="true"
          :taskNumber="taskNumber"
          :checkedType.sync="selectedInsuranceType"
          :editPayBase="!disabledMap.insAdditionalTable"
          :canAddInsuranceType="canAddInsuranceType"
          :canAddInsuranceTypeNumber="canAddInsuranceTypeNumber"
        ></table-pay-base>
      </div>
    </div>
    <div slot="increaseCause" class="content-follow">
      <div class="tabMsg">
        <header>增员原因<span style="color: #ff6464">(必填)</span></header>
        <section>
          <el-form :model="iafInfo" :rules="reasonRules">
            <el-form-item prop="reason">
              <i-select
                v-model="iafInfo.reason"
                @change="handleSelectReason"
                parameter="IAF_ADD_REASON"
                required
                :disabled="disabledMap.reason"
              ></i-select>
            </el-form-item>
          </el-form>
        </section>
      </div>
    </div>
  </i-process-flow>
</template>

<script>
import IProcessFlow from 'components/common/i-process-flow'
import TablePayBase from '../components/table-pay-base'
import ISelectArea from 'components/common/i-select-area'
import processMixin from 'mixins/process'
import iafBaseInfoMixin from 'mixins/compensation/iaf-base-info'
import ISelect from 'components/common/i-select/i-select'
import req from 'api/iaf/iaf-flow'
import DictShow from '../components/dict-show'
export default {

  name: 'IAFADD',

  components: {
    IProcessFlow,
    TablePayBase,
    ISelectArea,
    DictShow,
    ISelect
  },

  data () {
    let checkNumber = (rule, value, cb) => {
      if (Number.isNaN(Number(value))) return cb('请输入数字')
      if (Number(value) < 0) return cb('请输入正数')
      return cb()
    }
    return {
      mob: '02',
      checkType: {
        checkedFund: []
      },
      // 公积金的显隐 判断条件：是否选择参保公积金
      showEmpPaySupplyment: false,
      loading: false,
      typeAll: ['endowment', 'unemployment', 'medicare', 'employmentInjury', 'maternity', 'supplyEmployeeInjury', 'supplyMedicare', 'hpfund'],
      taskNumber: 0,
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
      columns: ['selectType', 'compbase', 'empbase', 'number', 'payMethods', 'account'],
      isShow: false,
      showInput: true,
      showSelectArea: false,
      selectArea: true,
      rules: {
        employeeCode: [{ required: true, message: '请输入工号' }],
        empPaySupplyment: [{ validator: checkNumber, trigger: 'change' }],
        domicileGrade: [{ required: true, message: '请选择户口级别' }]
      },
      reasonRules: {
        reason: [{ required: true, message: '请选择增员原因' }]
      },
      checkRules: {
        checkedFund: [{ type: 'array', required: true, message: '请选择增员品种' }]
      },
      getBackInsuranceType: {},
      canAddInsuranceType: [],
      canAddInsuranceTypeNumber: 0
    }
  },

  mixins: [processMixin, iafBaseInfoMixin],

  watch: {
    selectArea (val) {
      this.showSelectArea = !val
      if (val) {
        this._validateAndGetBaseInfo()
      }
    },
    benchmarks (val) {
      if (this.taskKey !== 'undefined') return
      this.showPayBaseLower(val)
    },
    selectedInsuranceType (val, oldVal) {
      this.showEmpPaySupplyment = val.includes('hpfund')
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

    _validateAndGetBaseInfo () {
      this.validateAndGetBaseInfo(this.validateAddMember)
    },

    handleAreaChange (area) {
      this.iafInfo.areaId = area
      req('iafEndowmentPayBaseByAreaId', {areaId: 'area0002'})
      .then((data) => {
        this.showPayBaseLower(data)
        Object.assign(this.benchmarks, data)
      })
    },

    validateAddMember () {
      return req('iafValidInscreasing', {employeeCode: this.iafInfo.employeeCode})
      .then((data) => {
        this.getBackInsuranceType = data
      })
      .catch(() => {
        Object.keys(this.iafInfo).forEach(item => {
          this.iafInfo[item] = ''
        })
        this.loading = false
      })
    },
    handleConfirm (selected) {
      this.loading = true
      this.iafInfo.employeeCode = selected[0].employeeCode
      this.selectedInsuranceType = []
      this._validateAndGetBaseInfo()
    },

    handleIconClick () {
      this.isShow = !this.isShow
    },

    getSelectedInsuranceType () {
      Object.keys(this.iafInfo).forEach(item => {
        this.typeAll.includes(item) && this.iafInfo[item] && this.selectedInsuranceType.push(item)
      })
    },
    showPayBaseLower (data) {
      let {
        employmentInjuryAccountName,
        endowmentAccountName,
        maternityAccountName,
        medicareAccountName,
        unemploymentAccountName,
        hpfundAccountName,
        endowmentAccountPersonalCode,
        unemploymentAccountPersonalCode,
        medicareAccountPersonalCode,
        employmentInjuryAccountPersonalCode,
        maternityAccountPersonalCode,
        hpfundAccountPersonalCode,
        supplyEmployeeInjuryAccountPersonalCode,
        supplyMedicareAccountPersonalCode,
        endowmentCompPayBaseLower,
        endowmentEmpPayBaseLower,
        unemploymentEmpPayBaseLower,
        unemploymentCompPayBaseLower,
        medicareCompPayBaseLower,
        medicareEmpPayBaseLower,
        employmentInjuryEmpPayBaseLower,
        employmentInjuryCompPayBaseLower,
        maternityEmpPayBaseLower,
        maternityCompPayBaseLower,
        hpfundEmpPayBaseLower,
        hpfundCompPayBaseLower,
        supplyMedicareCompPayBaseLower,
        supplyMedicareEmpPayBaseLower,
        supplyEmployeeInjuryCompPayBaseLower,
        supplyEmployeeInjuryEmpPayBaseLower,
        supplyMedicareAccountName,
        supplyEmployeeInjuryAccountName
      } = data
      this.iafInfo.endowmentCompPayBase = endowmentCompPayBaseLower
      this.iafInfo.endowmentEmpPayBase = endowmentEmpPayBaseLower
      this.iafInfo.medicareCompPayBase = medicareCompPayBaseLower
      this.iafInfo.medicareEmpPayBase = medicareEmpPayBaseLower
      this.iafInfo.unemploymentCompPayBase = unemploymentCompPayBaseLower
      this.iafInfo.unemploymentEmpPayBase = unemploymentEmpPayBaseLower
      this.iafInfo.employmentInjuryCompPayBase = employmentInjuryCompPayBaseLower
      this.iafInfo.employmentInjuryEmpPayBase = employmentInjuryEmpPayBaseLower
      this.iafInfo.maternityCompPayBase = maternityCompPayBaseLower
      this.iafInfo.maternityEmpPayBase = maternityEmpPayBaseLower
      this.iafInfo.hpfundCompPayBase = hpfundCompPayBaseLower
      this.iafInfo.hpfundEmpPayBase = hpfundEmpPayBaseLower
      this.iafInfo.supplyMedicareCompPayBase = supplyMedicareCompPayBaseLower
      this.iafInfo.supplyMedicareEmpPayBase = supplyMedicareEmpPayBaseLower
      this.iafInfo.supplyEmployeeInjuryCompPayBase = supplyEmployeeInjuryCompPayBaseLower
      this.iafInfo.supplyEmployeeInjuryEmpPayBase = supplyEmployeeInjuryEmpPayBaseLower
      this.iafInfo.employmentInjuryAccountName = employmentInjuryAccountName
      this.iafInfo.endowmentAccountName = endowmentAccountName
      this.iafInfo.maternityAccountName = maternityAccountName
      this.iafInfo.medicareAccountName = medicareAccountName
      this.iafInfo.unemploymentAccountName = unemploymentAccountName
      this.iafInfo.hpfundAccountName = hpfundAccountName
      this.iafInfo.supplyMedicareAccountName = supplyMedicareAccountName
      this.iafInfo.supplyEmployeeInjuryAccountName = supplyEmployeeInjuryAccountName
      this.iafInfo.endowmentAccountPersonalCode = endowmentAccountPersonalCode
      this.iafInfo.unemploymentAccountPersonalCode = unemploymentAccountPersonalCode
      this.iafInfo.medicareAccountPersonalCode = medicareAccountPersonalCode
      this.iafInfo.employmentInjuryAccountPersonalCode = employmentInjuryAccountPersonalCode
      this.iafInfo.maternityAccountPersonalCode = maternityAccountPersonalCode
      this.iafInfo.hpfundAccountPersonalCode = hpfundAccountPersonalCode
      this.iafInfo.supplyEmployeeInjuryAccountPersonalCode = supplyEmployeeInjuryAccountPersonalCode
      this.iafInfo.supplyMedicareAccountPersonalCode = supplyMedicareAccountPersonalCode
    },

    postFlow () {
      return Object.assign({}, this.iafInfo, this.benchmarks,
        {
          canAddInsuranceType: this.canAddInsuranceType,
          canAddInsuranceTypeNumber: this.canAddInsuranceTypeNumber
        }, {operateType: 'insuranceCreateFlow'})
    },

    fillIn (data) {
      data.employeeCode && (this.showInput = false)
      this.canAddInsuranceType = data.canAddInsuranceType
      this.canAddInsuranceTypeNumber = data.canAddInsuranceTypeNumber
      this.taskNumber++
      Object.assign(this.iafInfo, data)
      this.getSelectedInsuranceType()
      Object.assign(this.benchmarks, data)
    },

    checkedChoose (cruentChoose) {
      this.iafInfo.insurance = cruentChoose.includes(1)
      this.iafInfo.hpfund = cruentChoose.includes(2)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form-item{
    margin-bottom: 0;
  }
  .inline-form{
    .radioMargin{
      .el-radio+.el-radio{
        margin-left: 0px;
      }
    }
  }
  .info-content{
    width:100%;
    line-height: 17px;
    .select{
      margin: 10px;
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
      padding: 0 0 20px;
      font-weight: normal;
      width: 310px;
    }
  }

</style>
