<template>
<div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :model="basicData"
      processType="iafRetirementInsuranceApplicationFlow"
      v-loading="loading"
      :element-loading-text="$loadingText"
    >
        <div class="module" slot="baseInformation">
          <h2>基本信息</h2>
          <el-form :inline="true" label-width="100px" :model="basicData" :rules="basicDataCheck" class="basic-box">
            <el-form-item label="工号" prop="employeeCode" v-if="showMap.employeeCode">
              <template v-if="showInput">
                <el-input 
                  @click.native="handleIconClick"
                  v-model="basicData.employeeCode" 
                  :disabled="disabledMap.employeeCode" 
                  :editable="false"
                >
                  <i slot="suffix" class="el-input__icon el-icon-menu" v-if="!disabledMap.employeeCode"></i>
                </el-input>
                <i-personnel-select 
                  v-if="!disabledMap.employeeCode"
                  @confirm="handleConfirm" 
                  :isShow.sync="isShow" 
                  :multiple="false" 
                ></i-personnel-select>
              </template>
              <span v-else>{{basicData.employeeCode}}</span>
            </el-form-item>
            <el-form-item label="姓名" v-if="showMap.fullName">
              <el-input v-model="basicData.fullName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="性别" v-if="showMap.gender">
              <i-select parameter="GENDER" v-model="basicData.gender" disabled></i-select>
            </el-form-item>
            <el-form-item label="出生年月" v-if="showMap.birthDate">
              <el-date-picker type="date" v-model="basicData.birthDate" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="身份证号码" v-if="showMap.idNumber">
              <el-input v-model="basicData.idNumber" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="人事范围" v-if="showMap.personnelGroupName">
              <el-input v-model="basicData.personnelGroupName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="部门" v-if="showMap.orgUnitName">
              <el-input v-model="basicData.orgUnitName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="岗位" v-if="showMap.posPositionName">
              <el-input v-model="basicData.posPositionName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" v-if="showMap.homeAddress">
              <el-input v-model="basicData.homeAddress" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" v-if="showMap.mobile" prop="mobile">
              <el-input v-model.trim="basicData.mobile" :disabled="disabledMap.mobile"></el-input>
            </el-form-item>
            <el-form-item label="参保户头">
              <el-input v-model="basicData.accountName" disabled></el-input>
            </el-form-item>
            <el-form-item label="参保城市">
              <el-input v-model="basicData.applyArea" disabled></el-input>
            </el-form-item>
            <el-form-item label="参保时间">
              <el-date-picker v-model="basicData.effectiveDate" class="dateInput" type="date" disabled></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="module" slot="retirementDetails">
          <h2>退休明细说明</h2>
          <el-form :inline="true" label-width="100px" :model="detailData" class="basic-box" :rules="detailDataCheck">
            <el-form-item label="退休时间" v-if="showMap.retiredDate" prop="retiredDate">
              <el-date-picker 
                type="date"
                class="dateInput" 
                v-model="detailData.retiredDate" 
                @change="handleDateChange(detailData.retiredDate, 'detailData', 'retiredDate', 'string')"
                :disabled="disabledMap.retiredDate" 
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="退休类型" v-if="showMap.retireType" prop="retireType">
              <el-select v-model="detailData.retireType" :disabled="disabledMap.retireType" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form 
            v-if="showMap.insDetailsTable"
            class="box" 
            ref="data" 
            :model="tableData" 
            :inline="true" 
            :rules="tableDataCheck"
          >
            <el-form-item class="item-row">
              <el-form-item label="退休险种" class="item-box label-title"></el-form-item>
              <el-form-item label="情况" class="item-box label-title"></el-form-item>
              <el-form-item label="退休待遇（元/月）" class="item-box label-title"></el-form-item>
              <el-form-item label="退休办理时间" class="item-box label-title"></el-form-item>
              <el-form-item label="待遇发放开始时间" class="item-box label-title"></el-form-item>
            </el-form-item>
            <!-- 养老退休 -->
            <el-form-item class="item-row" v-if="retireInsuranceType.endowmentRetire">
              <el-form-item class="item-box label-title" v-if="showMap.endowmentRecordName">
                <label class="el-form-item__label">{{tableNames.endowmentRecordName}}</label>
              </el-form-item>
              <el-form-item class="item-box el-form-item--mini" v-if="showMap.endowmentInsuranceStatus" prop="endowmentInsuranceStatus" size="mini">
                <el-select  v-model="tableData.endowmentInsuranceStatus" :disabled="disabledMap.endowmentInsuranceStatus" placeholder="请选择">
                  <el-option
                    v-for="item in conditionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item class="item-box el-form-item--mini" v-if="showMap.endowmentRetireTreatment" prop="endowmentRetireTreatment" size="mini">
                <el-input v-model="tableData.endowmentRetireTreatment" :disabled="disabledMap.endowmentRetireTreatment"></el-input>
              </el-form-item>
              <el-form-item class="item-box el-form-item--mini" v-if="showMap.endowmentTransactDate" prop="endowmentTransactDate">
                <el-date-picker 
                  type="date" 
                  v-model="tableData.endowmentTransactDate" 
                  :disabled="disabledMap.endowmentTransactDate" 
                  :editable="false" 
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="item-box el-form-item--mini" v-if="showMap.endowmentProvideDate" prop="endowmentProvideDate" size="mini">
                <el-date-picker 
                  type="date" 
                  v-model="tableData.endowmentProvideDate" 
                  :disabled="disabledMap.endowmentProvideDate" 
                  :editable="false" 
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
            <!-- 医疗退休 -->
            <el-form-item class="item-row" v-if="retireInsuranceType.midicalRetire">
              <el-form-item class="item-box label-title" v-if="showMap.medicareRecordName">
                <label class="el-form-item__label">{{tableNames.medicareRecordName}}</label>
              </el-form-item>
              <el-form-item class="item-box el-form-item--mini" v-if="showMap.medicalInsuranceStatus" prop="medicalInsuranceStatus">
                <el-select v-model="tableData.medicalInsuranceStatus" placeholder="请选择" :disabled="disabledMap.medicalInsuranceStatus">
                  <el-option
                    v-for="item in conditionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item-box el-form-item--mini" v-if="showMap.medicalRetireTreatment" prop="medicalRetireTreatment">
                <el-input  v-model="tableData.medicalRetireTreatment" :disabled="disabledMap.medicalRetireTreatment"></el-input>
              </el-form-item>
              <el-form-item class="item-box el-form-item--mini" v-if="showMap.medicalTransactDate" prop="medicalTransactDate">
                <el-date-picker 
                  type="date" 
                  v-model="tableData.medicalTransactDate" 
                  :disabled="disabledMap.medicalTransactDate" 
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="item-box el-form-item--mini" v-if="showMap.medicalProvideDate" prop="medicalProvideDate">
                <el-date-picker 
                  type="date" 
                  v-model="tableData.medicalProvideDate" 
                  :disabled="disabledMap.medicalProvideDate" 
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
    </i-process-flow>
  </div>
</template>

<script>

import IProcessFlow from 'components/common/i-process-flow'
import BasicMsgForm from 'views/flow/pages/iaf/components/basic-form/basic-msg-form'
import ISelect from 'components/common/i-select/i-select.vue'
import processMixin from 'mixins/process'
import req from 'api/iaf/iaf-flow'
import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'

export default {
  components: {
    IProcessFlow,
    BasicMsgForm,
    ISelect
  },
  data () {
    let checkPhone = (rule, value, cb) => {
      let phoneTest = /^1[34578]\d{9}$/
      !value && cb(new Error('电话号码不能为空'))
      setTimeout(function () {
        !phoneTest.test(value) ? cb(new Error('请输入正确的电话号码格式')) : cb()
      }, 0)
    }
    let checkNumber = (rule, value, cb) => {
      if (Number.isNaN(Number(value))) return cb('请输入数字')
      if (Number(value) < 0) return cb('请输入正数')
      return cb()
    }
    return {
      basicDataCheck: {
        employeeCode: [{ required: 'true', message: '请输入工号' }],
        mobile: [{ required: true, validator: checkPhone }]
      },
      detailDataCheck: {
        retiredDate: [{ required: 'true', message: '请输入退休时间' }],
        retireType: [{ required: 'true', message: '请输入退休类型' }]
      },
      tableDataCheck: {
        endowmentInsuranceStatus: [{ required: true, message: '请输入退休申请情况' }],
        endowmentRetireTreatment: [
          { validator: checkNumber },
          { required: true, message: '请输入退休待遇' }
        ],
        endowmentTransactDate: [{ required: true, message: '请输入退休办理时间' }],
        endowmentProvideDate: [{ required: true, message: '请输入退休待遇发放时间' }],
        medicalInsuranceStatus: [{ required: true, message: '请输入退休申请情况' }],
        medicalRetireTreatment: [
          { validator: checkNumber },
          { required: true, message: '请输入退休待遇' }
        ],
        medicalTransactDate: [{ required: true, message: '请输入退休办理时间' }],
        medicalProvideDate: [{ required: true, message: '请输入退休待遇发放时间' }]
      },
      // 显示基本信息工号弹出框
      isShow: false,
      showInput: true,
      conditionOptions: [
        {value: '01', label: '申请中'},
        {value: '02', label: '已完结'}
      ],
      typeOptions: [
        {value: '01', label: '正常退休'},
        {value: '02', label: '提前退休'}
      ],
      // 基本信息表单数据
      basicData: {
        employeeId: '',
        empEmployeeId: '',
        accountId: '',
        employeeCode: '',
        fullName: '',
        gender: '',
        birthDate: '',
        idNumber: '',
        personnelGroupName: '',
        orgUnitName: '',
        posPositionName: '',
        homeAddress: '',
        mobile: '',
        accountName: '',
        applyArea: '',
        effectiveDate: ''
      },
      // 明细说明
      detailData: {
        retiredDate: '',
        retireType: ''
      },
      // 表格数据
      tableData: {
        endowmentInsuranceStatus: '',
        endowmentRetireTreatment: '',
        endowmentTransactDate: '',
        endowmentProvideDate: '',
        medicalInsuranceStatus: '',
        medicalRetireTreatment: '',
        medicalTransactDate: '',
        medicalProvideDate: ''
      },
      retireInsuranceType: {
        endowmentRetire: false,
        midicalRetire: false
      },
      flowData: {
        operateType: 'insuranceCreateFlow'
      },
      tableNames: {
        endowmentRecordName: '养老退休',
        medicareRecordName: '医保退休'
      },
      loading: false
    }
  },
  watch: {

  },
  mixins: [processMixin, IafSearchMixin],
  methods: {
     // 弹出框的显示
    handleIconClick () {
      this.isShow = !this.isShow
    },
    // 获取员工id
    handleConfirm (selected) {
      this.loading = true
      req('iafGetEmpAccount', {employeeCode: selected[0].employeeCode})
      .then(data => {
        // 基本信息
        this.basicData = data
        // 将员工Id赋给empEmployeeId,触发流程组件自动选择审核人
        this.basicData.empEmployeeId = data.employeeId
        this.loading = false
        return this.handleRetireInsuranceType(selected)
      })
      .catch(() => {
        this.whenReturnError()
        this.loading = false
      })
    },
    // 通过工号获取可退休险种
    handleRetireInsuranceType (selected) {
      return req('findInsuranceTypeByEmployeeCode', {employeeCode: selected[0].employeeCode})
      .then(data => {
        data.forEach(item => {
          item.insuranceType === '01' && (this.retireInsuranceType.endowmentRetire = true)
          item.insuranceType === '03' && (this.retireInsuranceType.midicalRetire = true)
        })
      })
    },
    // 当报错后清空基本信息
    whenReturnError () {
      // 当报错后清空基本信息
      Object.keys(this.basicData).forEach(item => {
        this.basicData[item] = ''
      })
      Object.keys(this.retireInsuranceType).forEach(item => {
        this.retireInsuranceType[item] = false
      })
    },
    postFlow () {
      return Object.assign({}, this.basicData, this.detailData, this.tableData, this.flowData, this.retireInsuranceType)
    },
    fillIn (data) {
      for (let key in data) {
        this.basicData[key] = data[key]
        this.detailData[key] = data[key]
        this.tableData[key] = data[key]
        this.retireInsuranceType[key] = data[key]
      }
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
  .basic-box{
    .el-form-item /deep/ .el-form-item__content{
      width: 193px;
    }
  }
  .dateInput{
    width:193px;
  }
  .box{
    width:900px;
    margin-bottom:20px;
  }
  .item-box{
    border-left:1px solid #aaa;
    padding:5px 10px;
    width:150px;
    margin:0;
  }
  .item-row .item-box:first-child{
    border-left:none;
  }
  .item-row{
    border:1px solid #aaa;
    border-bottom: none;
    margin:0;
  }
  .item-row:last-child{
    border-bottom:1px solid #aaa;
  }
  .label-title{
    width:150px;
    text-align:center;
  }
</style>
