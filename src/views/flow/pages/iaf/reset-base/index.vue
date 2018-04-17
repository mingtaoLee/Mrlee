<template>
  <i-process-flow
    processType="iafUpdateBaseFlow"
    @fillin = "fillIn"
    :taskKey="taskKey"
    :taskI="taskId"
  >
    <div slot="baseInformation" class="content-follow">
      <h2 class="info-title">基本信息</h2>
      <div class="">
        <div class="inline-form">
          <el-form 
            class="demo-form-inline"
            label-width="120px" 
            :model="iafInfo" 
            :rules="iafInfoCheck" 
          >
            <el-row>
              <el-col :span="8">
                <el-form-item v-if="showMap.employeeCode" label="工号" prop="employeeCode">
                  <template v-if="showInput">
                    <el-input 
                      readonly
                      v-model="iafInfo.employeeCode" 
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
                <el-form-item label="姓名" v-if="!disabledMap.fullName">
                  <span>{{iafInfo.fullName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年龄" v-if="!disabledMap.age">
                  <span>{{iafInfo.age}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="职位" v-if="!disabledMap.positionName">
                  <span>{{iafInfo.positionName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="当月税前薪资" v-if="!disabledMap.empSalary">
                  <span>{{iafInfo.empSalary}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号码" v-if="!disabledMap.mobile">
                  <span>{{iafInfo.mobile}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="changeInstructionsInformation" class="content-follow">
      <h2 class="info-title">参保信息变更说明</h2>
      <div class="info-content">

        <table-pay-base 
          :columns="beforeTable.columns" 
          :header="beforeTable.header" 
          :iafInfo="beforeIafInfo"
          :isSelect="false"
          :editPayBase="false" 
          :canAddInsuranceType="canAddInsuranceType"
          :canAddInsuranceTypeNumber="canAddInsuranceTypeNumber"
        ></table-pay-base>

        <table-pay-base 
          :columns="afterTable.columns" 
          :header="afterTable.header"
          :iafInfo="iafInfo"
          :beforeIafInfo="beforeIafInfo"
          :benchmarks="benchmarks"
          :isSelect="false"
          :editPayBase="!disabledMap.insChangesTable"
          :canAddInsuranceType="canAddInsuranceType"
          :canAddInsuranceTypeNumber="canAddInsuranceTypeNumber"
        ></table-pay-base>

      </div>
    </div>
    <div slot="updateBaseReason" class="content-follow">
      <div class="cause">
        <div>调基原因</div>
        <el-input type="textarea" :disabled="disabledMap.insReasonTable"></el-input>
      </div>
    </div>
  </i-process-flow>
</template>
<script>

import IProcessFlow from 'components/common/i-process-flow'
import ITable from 'components/common/i-table'
import TablePayBase from '../components/table-pay-base'
import iafBaseInfoMixin from 'mixins/compensation/iaf-base-info'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import processMixin from 'mixins/process'
import req from 'api/iaf/iaf-flow'

export default {

  name: 'FundPayment',

  components: {
    IProcessFlow,
    ITable,
    TablePayBase,
    iPersonnelSelect
  },

  mixins: [iafBaseInfoMixin, processMixin],

  data () {
    return {
      iafInfoCheck: {
        employeeCode: [{required: 'true', message: '请输入工号'}]
      },
      beforeTable: {
        columns: ['type', 'compbase', 'empbase', 'area', 'account'],
        header: '调整前'
      },
      afterTable: {
        columns: ['type', 'compbase', 'empbase', 'area', 'account'],
        header: '调整后'
      },
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
      beforeIafInfo: {},
      showInput: true,
      isShow: false,
      canAddInsuranceTypeNumber: 0
    }
  },

  watch: {
    canAddInsuranceTypeNumber (newVal) {
      console.log(newVal)
    }
  },
  methods: {

    _validateAndGetInfo () {
      this.validateAndGetBaseInfo(this.validateInsertBase)
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
            this.canAddInsuranceTypeNumber = this.canAddInsuranceType.length
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
      req('iafInsuranceState', {employeeCode: data.employeeCode})
        .then((data) => {
          if (data) this.getLastPayBase(data, 'iafInsuranceLastPayBase', isFillIn)
        })
      req('iafHpfundState', {employeeCode: data.employeeCode})
        .then((data) => {
          if (data) this.getLastPayBase(data, 'iafHpfundLastPayBase', isFillIn)
        })
    },

    /***
     * 判断是否可调基
     */
    validateInsertBase () {
      return req('isIafInsertBase', {
        employeeCode: this.iafInfo.employeeCode
      })
    },

    handleConfirm (selected) {
      this.iafInfo.employeeCode = selected[0].employeeCode
      this._validateAndGetInfo()
    },

    handleIconClick () {
      this.isShow = !this.isShow
    },

    postFlow () {
      return Object.assign({}, this.iafInfo, this.benchmarks, {canAddInsuranceType: this.canAddInsuranceType}, {operateType: 'insuranceCreateFlow'})
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
<style lang="scss" scoped>
  .cause{
    div{
    font-size:14px;
    font-weight:bold;
      margin-bottom: 10px;
    }
  }
  .tabMsg{
    width: 100%;
    border: 1px #B3C0D1 solid;
    margin-bottom: 10px;
    .tabMsgTitle{
      width: 100%;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      font-weight: bold;
    }
  }
  header{
    background-color: #B3C0D1;
    color: #333;
    font-size: 14px;
    line-height: 40px;
    text-align: center;
  }
  section{
    padding: 10px;
    .el-row{
      height: 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      &:last-child{
        border-bottom: none;
      }
      .el-col{
        height: 100%;
        margin-top: 12px;
      }
    }
  }
</style>
