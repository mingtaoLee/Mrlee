<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="130px" :model="form" :rules="rules" v-cloak>
    <div class="content-follow">
      <h2 class="info-title">基本信息</h2>
      <div class="info-content">
        <el-row>
          <el-col :span="8">
            <el-form-item label="户头代码" prop="accountCode">
              <el-input v-model="accountCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户头名称" prop="accountName">
              <el-input v-model="accountName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在区域" prop="areaId">
              <i-select-area v-model="form.areaId" :disabled="true" @change="handleAreaChange"></i-select-area>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="保险类型" prop="insuranceType">
                <i-select
                  v-model="form.insuranceType"
                  :options="insuranceList"
                  :async="false"
                  :disabled="isInsuranceDisabled"
                  :hideKeys="hideKeys"
                  @option-click="handleInsuranceOptionClick"
                  @change="handleInsuranceChange"
                ></i-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户口性质" prop="householdCode">
              <el-tooltip
                effect="dark"
                content="请先选择保险类型"
                placement="top"
                :disabled="!!form.insuranceType"
              >
                <i-select
                  v-if="!accountPolicyId"
                  v-model="form.householdCode"
                  :options="householdList"
                  :async="false"
                  :disabled="!form.insuranceType"
                  @change="handleHouseholdChange"
                ></i-select>
                <i-select v-else v-model="form.householdCode" parameter="IAF_ACCOUNT_TYPE" disabled></i-select>
              </el-tooltip>
              <!--<i-select-->
                <!--v-else-->
                <!--v-model="form.householdCode"-->
                <!--:options="householdList"-->
                <!--:async="false"-->
                <!--:disabled="!form.insuranceType"-->
                <!--@change="handleHouseholdChange"-->
              <!--&gt;</i-select>-->
            </el-form-item>
          </el-col>         
          <el-col :span="8">
            <el-form-item label="户头管理员" prop="fullName">
              <el-input v-model="form.fullName" readonly @click.native="handlePersonnelClick">
                <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
              </el-input>
              <i-personnel-select
                :isShow.sync="isShowPersonnel" :multiple="false"
                :defaultSelectedPersonnel="selectedPersonnel"
                @confirm="handlePersonnelDialogConfirm"
              ></i-personnel-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社保编号" prop="securityNumber">
              <el-input v-model="form.securityNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户社保局" prop="bohrssName">
              <el-input v-model="form.bohrssName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户时间" prop="openingDate">
              <el-date-picker
                v-model="form.openingDate"
                type="date"
                :editable="false"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="增员申请时间">
              <el-input v-model="form.addApplyDate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="增员生效时间">
              <el-input v-model="form.addEffectiveDate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="减员申请时间">
              <el-input v-model="form.delApplyDate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="减员生效时间">
              <el-input v-model="form.delEffectiveDate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker
                v-model="form.effectiveDate"
                type="date"
                :editable="false"
                :picker-options="effectOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="失效日期" prop="uneffectiveDate">
              <el-date-picker
                v-model="form.uneffectiveDate"
                type="date"
                :editable="false"
                :picker-options="uneffectOptions"
                :disabled="true"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content-follow">
      <h2 class="info-title">个人缴纳</h2>
      <div class="info-content">
        <el-row>
          <el-col :span="8">
            <el-form-item label="基数上限" prop="empPayBaseLimit" :rules="getMaxRules('emp', 'empPayBaseLower', 'empPayBaseLimit')" ref="empPayBaseLimit">
              <el-input v-model.number="form.empPayBaseLimit" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基数下限" prop="empPayBaseLower" :rules="getMinRules('emp', 'empPayBaseLimit', 'empPayBaseLower')" ref="empPayBaseLower">
              <el-input v-model.number="form.empPayBaseLower" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="基数进位规则" prop="empBaseCarryRule">
              <i-select v-model="form.empBaseCarryRule" parameter="CARRY_RULE"></i-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="固定金额" prop="empPayFixedAmount">
              <el-input v-model.number="form.empPayFixedAmount" type="number" :min="0" @change="handleEmpPayChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="缴纳比例(%)" prop="empPayRatio" :rules="getEmpPayRatio('emp')">
              <el-input v-model.number="form.empPayRatio" type="number" :min="0" @change="handleEmpPayRatioChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结果进位规则" prop="empFixedCarryRule">
              <i-select v-model="form.empFixedCarryRule" parameter="CARRY_RULE"></i-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content-follow">
      <h2 class="info-title">公司缴纳</h2>
      <div class="info-content">
        <el-row>
          <el-col :span="8">
            <el-form-item label="基数上限" prop="compPayBaseLimit" :rules="getMaxRules('comp', 'compPayBaseLower', 'compPayBaseLimit')" ref="compPayBaseLimit">
              <el-input v-model.number="form.compPayBaseLimit" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基数下限" prop="compPayBaseLower" :rules="getMinRules('comp', 'compPayBaseLimit', 'compPayBaseLower')" ref="compPayBaseLower">
              <el-input v-model.number="form.compPayBaseLower" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="基数进位规则" prop="compBaseCarryRule">
              <i-select v-model="form.compBaseCarryRule" parameter="CARRY_RULE"></i-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="固定金额" prop="compPayFixedAmount">
              <el-input v-model.number="form.compPayFixedAmount" type="number" :min="0" @change="handleCompPayChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="缴纳比例(%)" prop="compPayRatio" :rules="getEmpPayRatio('comp')">
              <el-input v-model.number="form.compPayRatio" type="number" :min="0" @change="handleCompPayRatioChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结果进位规则" prop="compFixedCarryRule">
              <i-select v-model="form.compFixedCarryRule" parameter="CARRY_RULE"></i-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-form>
</template>
<script>
  import {BaseEditor} from './base-editor'
  import {Modifier} from './modifier'
  import {getRule} from 'utils/index'
  import req from 'api/iaf/company-rules'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
  
  const RULES = {
    insuranceType: getRule('请选择保险类型', 'change'),
    areaId: getRule('请选择所在区域', 'change'),
    householdCode: getRule('请选择户口性质', 'change'),
    openingDate: getRule('请选择开户时间', 'change', 'date'),
    bohrssName: [
      getRule('请输入开户社保局'),
      { min: 0, max: 50, message: '只能输入50个字', trigger: 'change' }
    ],
    securityNumber: [
      getRule('请输入社保编号', 'change'),
      { min: 0, max: 20, message: '只能输入20个字符', trigger: 'change' },
      { pattern: '^[A-Za-z0-9]+$', message: '只能输入英文和数字' }
    ],
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date'),
    empPayBaseLimit: [
      getRule('请输入基数上限', 'change', 'number'),
      {max: 99999999, message: '最多只能输入8位数', trigger: 'change', type: 'number'}
    ],
    empPayBaseLower: [
      getRule('请输入基数下限', 'change', 'number'),
      {max: 99999999, message: '最多只能输入8位数', trigger: 'change', type: 'number'}
    ],
    empPayRatio: [
      getRule('请输入缴纳比例', 'change', 'number'),
      {min: 0, max: 100, message: '只能输入0到100之间的数', trigger: 'change', type: 'number'}
    ],
    empBaseCarryRule: getRule('请选择基数进位规则', 'change'),
    empFixedCarryRule: getRule('请选择固定金额进位规则', 'change'),
    empPayFixedAmount: [
      getRule('请输入固定金额', 'change', 'number'),
      {min: 0, max: 99999999, message: '请输入8位以内的正数', trigger: 'change', type: 'number'}
    ],
    compPayBaseLimit: [
      getRule('请输入基数上限', 'change', 'number'),
      {max: 99999999, message: '最多只能输入8位数', trigger: 'change', type: 'number'}
    ],
    compPayBaseLower: [
      getRule('请输入基数下限', 'change', 'number'),
      {max: 99999999, message: '最多只能输入8位数', trigger: 'change', type: 'number'}
    ],
    compPayRatio: [
      getRule('请输入缴纳比例', 'change', 'number'),
      {min: 0, max: 100, message: '只能输入0到100之间的数', trigger: 'change', type: 'number'}
    ],
    compPayFixedAmount: [
      getRule('请输入固定金额', 'change', 'number'),
      {min: 0, max: 99999999, message: '请输入8位以内的正数', trigger: 'change', type: 'number'}
    ],
    compBaseCarryRule: getRule('请选择基数进位规则', 'change'),
    compFixedCarryRule: getRule('请选择固定金额进位规则', 'change'),
    fullName: getRule('请选择管理员', 'change')
  }
  export default {
    mixins: [EditorMixin, IafSearchMixin],
    props: {
      areaId: {
        type: String,
        default: sessionStorage.getItem('INSURANCE_ACCOUNTINFO') && JSON.parse(sessionStorage.getItem('INSURANCE_ACCOUNTINFO')).areaId
      },
      accountId: String,
      accountPolicyId: String,
      accountCode: {
        type: String,
        default: sessionStorage.getItem('INSURANCE_ACCOUNTINFO') && JSON.parse(sessionStorage.getItem('INSURANCE_ACCOUNTINFO')).accountCode
      },
      accountName: {
        type: String,
        default: sessionStorage.getItem('INSURANCE_ACCOUNTINFO') && JSON.parse(sessionStorage.getItem('INSURANCE_ACCOUNTINFO')).accountName
      },
      accountType: {
        type: String,
        default: sessionStorage.getItem('INSURANCE_ACCOUNTINFO') && JSON.parse(sessionStorage.getItem('INSURANCE_ACCOUNTINFO')).accountType
      },
      uneffectiveDate: {
        type: String,
        default: sessionStorage.getItem('INSURANCE_ACCOUNTINFO') && JSON.parse(sessionStorage.getItem('INSURANCE_ACCOUNTINFO')).uneffectiveDate
      }
    },
    data: function () {
      return {
        isInsuranceListLoaded: false,
        currentAreaId: this.areaId,
        insuranceList: [],
        householdList: [],
        householdListAll: [],
        currentInsuranceType: '',
        currentHouseholdCode: '',
        selectedPersonnel: [],
        isShowPersonnel: false,
        instance: null,
        hideKeys: [],
        form: {
          areaInfoId: '',
          insuranceType: '',
          accountType: this.accountType,
          areaId: this.areaId,
          accountCode: this.accountCode,
          accountName: this.accountName,
          bohrssName: '',
          openingDate: '',
          addApplyDate: '',
          addEffectiveDate: '',
          delApplyDate: '',
          delEffectiveDate: '',
          householdCode: '',
          effectiveDate: '',
          uneffectiveDate: new Date(this.uneffectiveDate),
          empPayBaseLimit: '',
          empPayBaseLower: '',
          empPayRatio: '',
          comPayRatio: '',
          empBaseCarryRule: '',
          empFixedCarryRule: '',
          empPayFixedAmount: '',
          compPayBaseLimit: '',
          compPayBaseLower: '',
          compPayRatio: '',
          securityNumber: '',
          compPayFixedAmount: '',
          compBaseCarryRule: '',
          compFixedCarryRule: '',
          empPayBaseLimitMax: '', // 社保基数上限
          empPayBaseLowerMin: '',  // 社保基数下限
          compPayBaseLimitMax: '', // 社保公司基数上限
          compPayBaseLowerMin: ''// 社保公司基数下限
        },
        baseNumber: {
          compPayBaseLimit: 0,
          compPayBaseLower: 0,
          empPayBaseLimit: 0,
          empPayBaseLower: 0,
          empPayRatio: 0,
          compPayRatio: 0,
          empPayRatioMin: 0,
          compPayRatioMin: 0,
          empPayRatioMax: 0,
          compPayRatioMax: 0,
          empPayBaseLimitMax: 0, // 社保基数上限
          empPayBaseLowerMin: 0,  // 社保基数下限
          compPayBaseLimitMax: 0, // 社保公司基数上限
          compPayBaseLowerMin: 0// 社保公司基数下限
        },
        effectOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.parse(this.form.uneffectiveDate) - 3600 * 1000 * 24
          }
        },
        uneffectOptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(this.form.effectiveDate) + 3600 * 1000 * 24
          }
        },
        areaProps: {},
        rules: RULES
      }
    },
    computed: {
      isInsuranceDisabled (value) {
        return !!this.accountPolicyId || (!(this.currentAreaId && this.isInsuranceListLoaded))
      }
    },
    methods: {
      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.accountPolicyId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 人员选择事件监听 */
      handlePersonnelClick () {
        this.isShowPersonnel = true
      },

      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected) {
        this.form.fullName = selected[0].employeeName
        this.form.employeeId = selected[0].employeeId
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData()
        this.getOptionsByAreaId(this.areaId)
      },

      /** 个人固定金额 */
      handleEmpPayChange () {
        let minDecimal = this.form.empPayFixedAmount.toFixed(2)
        if (this.form.empPayFixedAmount !== minDecimal) {
          this.form.empPayFixedAmount = parseFloat(minDecimal)
        }
      },
      /** 个人缴纳比例 */
      handleEmpPayRatioChange () {
        let minDecimal = this.form.empPayRatio.toFixed(2)
        if (this.form.empPayRatio !== minDecimal) {
          this.form.empPayRatio = parseFloat(minDecimal)
        }
      },
      /** 公司固定金额 */
      handleCompPayChange () {
        let minDecimal = this.form.compPayFixedAmount.toFixed(2)
        if (this.form.compPayFixedAmount !== minDecimal) {
          this.form.compPayFixedAmount = parseFloat(minDecimal)
        }
      },
      /** 公司缴纳比例 */
      handleCompPayRatioChange () {
        let minDecimal = this.form.compPayRatio.toFixed(2)
        if (this.form.compPayRatio !== minDecimal) {
          this.form.compPayRatio = parseFloat(minDecimal)
        }
      },
      getValidateValue (preKey, validateData, size) {
        if (size === 'min') return Math.min(this.baseNumber[preKey + 'PayBaseLimit'], Math.max(this.baseNumber[preKey + 'PayBaseLower'], this.form[validateData]))
        if (size === 'max') return Math.max(this.baseNumber[preKey + 'PayBaseLower'], Math.min(this.baseNumber[preKey + 'PayBaseLimit'], this.form[validateData]))
      },
      isShowBaseText (preKey, validateData, validateNum, size) {
        if (size === 'min' && this.form[validateData] < this.baseNumber[preKey + 'PayBaseLower'] && this.form[validateNum] <= this.baseNumber[preKey + 'PayBaseLower']) return '地方社保'
        if (size === 'max' && this.form[validateData] > this.baseNumber[preKey + 'PayBaseLimit'] && this.form[validateNum] >= this.baseNumber[preKey + 'PayBaseLimit']) return '地方社保'
        return ''
      },
      /** 基数上限校验 */
      getMaxRules (preKey, validateData, validateNum) {
        return [
          getRule('请输入基数上限', 'change', 'number'),
          { min: this.getValidateValue(preKey, validateData, 'min'), message: `不能小于${this.isShowBaseText(preKey, validateData, validateNum, 'min')}基数下限${this.getValidateValue(preKey, validateData, 'min')}`, type: 'number', trigger: 'change' },
          { max: this.baseNumber[preKey + 'PayBaseLimit'], message: `不能大于地方社保基数上限${this.baseNumber[preKey + 'PayBaseLimit']}`, type: 'number', trigger: 'change' }
        ]
      },
      /** 基数下限校验 */
      getMinRules (preKey, validateData, validateNum) {
        return [
          getRule('请输入基数下限', 'change', 'number'),
          { min: this.baseNumber[preKey + 'PayBaseLower'], message: `不能小于地方社保基数下限${this.baseNumber[preKey + 'PayBaseLower']}`, type: 'number', trigger: 'change' },
          { max: this.getValidateValue(preKey, validateData, 'max'), message: `不能大于${this.isShowBaseText(preKey, validateData, validateNum, 'max')}基数上限${this.getValidateValue(preKey, validateData, 'max')}`, type: 'number', trigger: 'change' }
        ]
      },
       /** 缴纳比例校验 */
      getEmpPayRatio (preKey) {
        return [
          getRule('请输入缴纳比例', 'change', 'number'),
          { min: this.baseNumber[preKey + 'PayRatioMin'], message: `不能小于缴纳比例下限(${this.baseNumber[preKey + 'PayRatioMin']})`, type: 'number', trigger: 'change' },
          { max: this.baseNumber[preKey + 'PayRatio'], message: `不能大于缴纳比例上限(${this.baseNumber[preKey + 'PayRatio']})`, type: 'number', trigger: 'change' }
  
        ]
      },
      /** 人员选择修改 */
      handleAreaChange (id) {
        this.currentAreaId = id

        this.isInsuranceListLoaded = false

        this.resetSelectedOption(['insuranceType, householdCode'])

        id && this.getOptionsByAreaId(id)
      },
      /** 根据areaId获取险种及户口性质列表联动 */
      getOptionsByAreaId (id) {
        req('getOptionsByAreaId', { areaId: id, accountType: this.accountType }).then(res => {
          if (res) {
            this.isInsuranceListLoaded = true
            if (this.accountType === '01') {
              this.hideKeys = ['0A']
            } else {
              this.hideKeys = ['01', '02', '03', '04', '05', '06', '07']
            }
            this.insuranceList = res
            if (this.accountPolicyId && this.form.insuranceType) {
              for (let item of this.insuranceList) {
                if (item.insuranceType === this.form.insuranceType) {
                  this.householdList = item.householdList
                  break
                }
              }
            }
          }
        })
      },
      /** 险种选项点击事件监听 */
      handleInsuranceOptionClick (insurance) {
        this.householdList = insurance.householdList
      },
      /** 险种选择改变事件监听 */
      handleInsuranceChange (insuranceType) {
        this.resetSelectedOption(['householdCode'])

        this.currentInsuranceType = insuranceType
      },
      /** 户口性质选择改变事件监听 */
      handleHouseholdChange (householdCode) {
        this.currentHouseholdCode = householdCode

        this.currentInsuranceType && householdCode && this.getInsuranceDetail()
      },
      getInsuranceDetail () {
        req('getInsuranceInfo', {areaId: this.form.areaId, insuranceType: this.currentInsuranceType, householdCode: this.currentHouseholdCode}).then(res => {
          if (res) {
            Object.keys(this.baseNumber).forEach(item => {
              Object.keys(res).includes(item) && (this.baseNumber[item] = res[item])
            })
            console.log(this.baseNumber, 'baseNumber')
            this.setInsuranceDetail(res)
          }
        })
      },
      setInsuranceDetail (res) {
        [
          'empPayBaseLimit', 'empPayBaseLower', 'empPayRatio', 'empPayFixedAmount',
          'compPayBaseLimit', 'compPayBaseLower', 'compPayRatio', 'compPayFixedAmount',
          'empBaseCarryRule', 'compBaseCarryRule', 'empFixedCarryRule', 'compFixedCarryRule', 'areaInfoId'
        ].map(key => {
          this.form[key] = res ? res[key] : ''
        })
        const dateKeys = ['effectiveDate', 'uneffectiveDate']
        dateKeys.map(key => {
          this.form[key] = res ? new Date(res[key]) : ''
        })
      },
      /** 重置已选选项   */
      resetSelectedOption (keys) {
        keys.map(key => {
          this.form[key] = ''
        })
        this.setInsuranceDetail('')
      }
    },
    watch: {
      'form.empPayBaseLimit' () {
        if (this.form.empPayBaseLower >= this.baseNumber.empPayBaseLower && this.form.empPayBaseLower <= Math.max(this.baseNumber.empPayBaseLower, Math.min(this.form.empPayBaseLimit, this.baseNumber.empPayBaseLimit))) {
          this.$refs.empPayBaseLower.validateState = 'success'
        }
      },
      'form.empPayBaseLower' () {
        if (this.form.empPayBaseLimit <= this.baseNumber.empPayBaseLimit && this.form.empPayBaseLimit >= Math.min(this.baseNumber.empPayBaseLimit, Math.max(this.form.empPayBaseLower, this.baseNumber.empPayBaseLower))) {
          this.$refs.empPayBaseLimit.validateState = 'success'
        }
      },
      'form.compPayBaseLimit' () {
        if (this.form.compPayBaseLower >= this.baseNumber.compPayBaseLower && this.form.compPayBaseLower <= Math.max(this.baseNumber.compPayBaseLower, Math.min(this.form.compPayBaseLimit, this.baseNumber.compPayBaseLimit))) {
          this.$refs.compPayBaseLower.validateState = 'success'
        }
      },
      'form.compPayBaseLower' () {
        if (this.form.compPayBaseLimit <= this.baseNumber.compPayBaseLimit && this.form.compPayBaseLimit >= Math.min(this.baseNumber.compPayBaseLimit, Math.max(this.form.compPayBaseLower, this.baseNumber.compPayBaseLower))) {
          this.$refs.compPayBaseLimit.validateState = 'success'
        }
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
    .content-follow {
      margin: 0 0 20px;
      &:last-child {
        margin: 0;
        border-bottom: 0;
      }
    }
    .info-content {
      margin-bottom: 0;
    }
    .base-limit {
      display: inline-block;
      .el-input {
        width: 70px;
      }
    }
  }
</style>
