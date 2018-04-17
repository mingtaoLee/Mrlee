<template>
  <i-process-flow
    processType="iafTransferMemberFlow"
    @fillin="fillIn"
    :taskKey="taskKey"
    :taskI="taskId"
  >
    <div slot="baseInformation">
      <div class="module">
        <h2>基本信息</h2>
          <el-form 
            label-width="100px" 
            :inline="true" 
            :model="iafInfo" 
            :rules="iafInfoCheck"
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
                <el-form-item label="性别" v-if="showMap.gender">
                  <span v-if="iafInfo.gender === 'M'">男</span>
                  <span v-if="iafInfo.gender === 'F'">女</span>
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
                <el-form-item label="部门" v-if="showMap.orgUnitName">
                  <span>{{iafInfo.orgUnitName}}</span>
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
                <el-form-item label="身份证号码" v-if="showMap.idNumber">
                  <span>{{iafInfo.idNumber}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年龄" v-if="showMap.age">
                  <span>{{iafInfo.age}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否怀孕" prop="pregnant" v-if="showMap.pregnant">
                  <el-select v-model="iafInfo.pregnant" :disabled="disabledMap.pregnant">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
                  </el-select>
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
                <el-form-item label="户口所在地" v-if="showMap.domicilePlace">
                  <span>{{iafInfo.domicilePlace}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="户口性质" v-if="showMap.domicileType">
                  <!-- <el-select v-model="iafInfo.domicileType" :disabled="disabledMap.domicileType">
                    <span v-if="iafInfo.domicileType === '01'">通用</span>
                    <span v-if="iafInfo.domicileType === '02'">本地城镇</span>
                    <span v-if="iafInfo.domicileType === '03'">本地农村</span>
                    <span v-if="iafInfo.domicileType === '04'">外地城镇</span>
                    <span v-if="iafInfo.domicileType === '05'">外地农村</span>
                  </el-select> -->
                  <i-select v-model="iafInfo.domicileType" :disabled="disabledMap.domicileType" parameter="IAF_ACCOUNT_TYPE"></i-select>
                  <!-- <span>{{iafInfo.domicileType}}</span> -->
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
      </div>
    </div>
    <div slot="changeInformation">
      <div class="module">
        <h2 class="info-title">参保信息变更说明</h2>
        <el-form :model="iafInfo" :rules="iafInfoCheck">
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="转移前参保地：" offset="100">
                <span>{{beforeIafInfo.insuranceAreaId}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="转移前合同主体：">
                <span>{{beforeIafInfo.contractSubject}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
                <el-form-item label="转移后参保地：" prop="areaId">
                  <i-select-area v-model="iafInfo.areaId" @change="handleAreaChange" :disabled="disabledMap.insChangeTable"></i-select-area>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="转移后合同主体：">
                <span>{{iafInfo.contractSubject}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="info-content">

          <table-pay-base 
            :columns="beforeTable.columns" 
            :header="beforeTable.header" 
            :iafInfo="beforeIafInfo"
            :isSelect="false"
            :editPayBase="false"
            :canAddInsuranceType="canAddInsuranceType"
          ></table-pay-base>

          <table-pay-base 
            :columns="afterTable.columns" 
            :header="afterTable.header"
            :iafInfo="iafInfo"
            :isSelect="false"
            :benchmarks="benchmarks"
            :editPayBase="!disabledMap.insChangeTable"
            :canAddInsuranceType="canAddInsuranceType"
          ></table-pay-base>
        </div>
      </div>
    </div>
  </i-process-flow>
</template>
<script>

import IProcessFlow from 'components/common/i-process-flow'
import TablePayBase from '../components/table-pay-base'
import iSelectArea from 'components/common/i-select-area'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import iafBaseInfoMixin from 'mixins/compensation/iaf-base-info'
import processMixin from 'mixins/process'
import req from 'api/iaf/iaf-flow'

export default {

  name: 'IafTransferFlow',

  components: {
    IProcessFlow,
    TablePayBase,
    iSelectArea,
    iPersonnelSelect
  },

  mixins: [iafBaseInfoMixin, processMixin],

  data () {
    return {
      iafInfoCheck: {
        employeeCode: [{ required: 'true', message: '请输入工号', trigger: 'change' }],
        pregnant: [{ required: 'true', message: '请选择是否怀孕' }],
        areaId: [{required: 'true', message: '请选择参保地区'}]
      },
      beforeTable: {
        columns: ['type', 'compbase', 'empbase', 'account', 'number', 'confirmTransferDate', 'confirmIntoDate'],
        header: '转移前'
      },
      afterTable: {
        columns: ['type', 'compbase', 'empbase', 'account', 'number', 'confirmTransferDate', 'confirmIntoDate'],
        header: '转移后'
      },
      beforeIafInfo: {},
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
      canAddInsuranceType: [],
      showInput: true,
      isShow: false
    }
  },

  methods: {

    handleAreaChange (area) {
      this.$set(this.iafInfo, this.iafInfo.areaId, area)
      req('iafEndowmentPayBaseByAreaId', {areaId: 'area0001'})
      .then((data) => {
        let {
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
        employmentInjuryAccountName,
        endowmentAccountName,
        maternityAccountName,
        medicareAccountName,
        unemploymentAccountName,
        hpfundAccountName
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
        this.iafInfo.employmentInjuryAccountName = employmentInjuryAccountName
        this.iafInfo.endowmentAccountName = endowmentAccountName
        this.iafInfo.maternityAccountName = maternityAccountName
        this.iafInfo.medicareAccountName = medicareAccountName
        this.iafInfo.unemploymentAccountName = unemploymentAccountName
        this.iafInfo.hpfundAccountName = hpfundAccountName

        this.benchmarks = Object.assign(this.benchmarks, data)
      })
    },

    _validateAndGetInfo () {
      this.validateAndGetBaseInfo()
      .then(() => {
        this.requestApi(this.iafInfo, false)
      })
      req('insuranceTypeByEmployeeCode', { employeeCode: this.iafInfo.employeeCode })
      .then((data) => {
        Object.keys(data).map(item => {
          if (data[item]) {
            Object.keys(this.insuranceType).forEach(type => {
              this.insuranceType[type] === item && this.canAddInsuranceType.push(this.insuranceType[type])
            })
          }
        })
      })
    },

    getLastPayBase (data, api, isFillIn) {
      if (data) {
        return req(api, {employeeCode: this.iafInfo.employeeCode})
        .then((data) => {
          this.beforeIafInfo = JSON.parse(JSON.stringify(Object.assign(this.beforeIafInfo, data)))
          if (!isFillIn) Object.assign(this.iafInfo, data)
        })
      }
    },

    requestApi (data, isFillIn) {
      if (isFillIn) this.showInput = false
      req('iafValidTransfering', {employeeCode: data.employeeCode})
        .then((data) => {
          console.log(data, 'iafValidTransfering')
          if (data) this.getLastPayBase(data, 'iafInsuranceLastPayBase', isFillIn)
          this.iafInfo.insurance = data
          this.beforeIafInfo.insurance = data
        })
      // req('iafInsuranceState', {employeeCode: data.employeeCode})
      //   .then((data) => {
      //     if (data) this.getLastPayBase(data, 'iafInsuranceLastPayBase', isFillIn)
      //     this.iafInfo.insurance = data
      //     this.beforeIafInfo.insurance = data
      //   })
      // req('iafHpfundState', {employeeCode: data.employeeCode})
      //   .then((data) => {
      //     if (data) this.getLastPayBase(data, 'iafHpfundLastPayBase', isFillIn)
      //     this.iafInfo.hpfund = data
      //     this.beforeIafInfo.hpfund = data
      //   })
    },

    handleConfirm (selected) {
      this.iafInfo.employeeCode = selected[0].employeeCode
      this._validateAndGetInfo()
    },

    handleIconClick () {
      this.isShow = !this.isShow
    },

    postFlow () {
      let {
        endowmentAccountName,
        medicareAccountName,
        unemploymentAccountName,
        employmentInjuryAccountName,
        maternityAccountName,
        hpfundAccountName,
        employmentInjuryCompPayRatio,
        employmentInjuryEmpPayRatio,
        endowmentCompPayRatio,
        endowmentEmpPayRatio,
        hpfundCompPayRatio,
        hpfundEmpPayRatio,
        maternityCompPayRatio,
        maternityEmpPayRatio,
        medicareCompPayRatio,
        medicareEmpPayRatio,
        unemploymentCompPayRatio,
        unemploymentEmpPayRatio
      } = this.benchmarks

      return Object.assign({}, this.iafInfo, {
        endowmentAccountName,
        medicareAccountName,
        unemploymentAccountName,
        employmentInjuryAccountName,
        maternityAccountName,
        hpfundAccountName,
        employmentInjuryCompPayRatio,
        employmentInjuryEmpPayRatio,
        endowmentCompPayRatio,
        endowmentEmpPayRatio,
        hpfundCompPayRatio,
        hpfundEmpPayRatio,
        maternityCompPayRatio,
        maternityEmpPayRatio,
        medicareCompPayRatio,
        medicareEmpPayRatio,
        unemploymentCompPayRatio,
        unemploymentEmpPayRatio
      }, {canAddInsuranceType: this.canAddInsuranceType}, {operateType: 'insuranceCreateFlow'})
    },

    fillIn (data) {
      data.employeeCode && this.requestApi(data, true)
      this.canAddInsuranceType = data.canAddInsuranceType
      Object.assign(this.iafInfo, data)
      Object.assign(this.benchmarks, data)
    }
  }
}
</script>
<style lang="scss">
  .module{
    .el-dropdown{
      width: 400px !important;
    }
    min-width: 850px;
    border-bottom: 1px solid #e5e5e5;
    margin: 20px;
    h2{
      margin-bottom: 20px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0;
    }
  }
  .dateInput{
    width:185px;
  }
</style>
