<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="130px" :model="form" :rules="rules" v-cloak>
    <div class="content-follow">
      <h2 class="info-title">基本信息</h2>
      <div class="info-content">
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在区域" prop="areaId">
              <i-select-area v-model="form.areaId" :disabled="!!accountPolicyId" @change="handleAreaChange"></i-select-area>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="保险类型" prop="insuranceType">
              <el-tooltip
                effect="dark"
                content="请先选择所在区域"
                placement="top"
                :disabled="!isInsuranceDisabled"
              >
                <i-select
                  v-model="form.insuranceType"
                  :options="insuranceList"
                  :async="false"
                  :disabled="isInsuranceDisabled"
                  @option-click="handleInsuranceOptionClick"
                  @change="handleInsuranceChange"
                ></i-select>
              </el-tooltip>
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
                  v-model="form.householdCode"
                  :options="householdList"
                  :async="false"
                  :disabled="!form.insuranceType"
                  @change="handleHouseholdChange"
                ></i-select>
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
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker
                v-model="form.effectiveDate"
                type="month"
                :picker-options="effectOptions"
                :disabled="isDateDisabled"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="失效日期" prop="uneffectiveDate">
              <el-date-picker
                v-model="form.uneffectiveDate"
                type="month"
                :picker-options="uneffectOptions"
                :disabled="isDateDisabled"
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
            <el-form-item label="基数上限" prop="empPayBaseLimit" :rules="getMaxRules('emp')">
              <el-input v-model.number="form.empPayBaseLimit" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基数下限" prop="empPayBaseLower" :rules="getMinRules('emp')">
              <el-input v-model.number="form.empPayBaseLower" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基数进位规则" prop="empBaseCarryRule">
              <i-select v-model="form.empBaseCarryRule" parameter="CARRY_RULE"></i-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固定金额" prop="empPayFixedAmount">
              <el-input v-model.number="form.empPayFixedAmount" type="number" :min="0" @change="handleEmpPayChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="缴纳比例(%)" prop="empPayRatio">
              <el-input v-model.number="form.empPayRatio" type="number" :min="0" @change="handleEmpPayRatioChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额进位规则" prop="empFixedCarryRule">
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
            <el-form-item label="基数上限" prop="compPayBaseLimit" :rules="getMaxRules('comp')">
              <el-input v-model.number="form.compPayBaseLimit" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基数下限" prop="compPayBaseLower" :rules="getMinRules('comp')">
              <el-input v-model.number="form.compPayBaseLower" type="number" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基数进位规则" prop="compBaseCarryRule">
              <i-select v-model="form.compBaseCarryRule" parameter="CARRY_RULE"></i-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固定金额" prop="compPayFixedAmount">
              <el-input v-model.number="form.compPayFixedAmount" type="number" :min="0" @change="handleCompPayChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="缴纳比例(%)" prop="compPayRatio">
              <el-input v-model.number="form.compPayRatio" type="number" :min="0" @change="handleCompPayRatioChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额进位规则" prop="compFixedCarryRule">
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
  import req from 'api/compensation/base-setting/company-rules'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    insuranceType: getRule('请选择保险类型', 'change'),
    areaId: getRule('请选择所在区域', 'change'),
    householdCode: getRule('请选择户口性质', 'change'),
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
    mixins: [EditorMixin],
    props: {
      areaId: String,
      accountId: String,
      accountPolicyId: String
    },
    computed: {
      isInsuranceDisabled (value) {
        return !!this.accountPolicyId || (!(this.currentAreaId && this.isInsuranceListLoaded))
      }
    },
    data: function () {
      return {
        isInsuranceListLoaded: false,
        currentAreaId: this.areaId,
        insuranceList: [],
        householdList: [],
        currentInsuranceType: '',
        currentHouseholdCode: '',
        selectedPersonnel: [],
        isShowPersonnel: false,
        instance: null,
        form: {
          areaInfoId: '',
          insuranceType: '',
          areaId: this.areaId,
          householdCode: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          empPayBaseLimit: '',
          empPayBaseLower: '',
          empPayRatio: '',
          empBaseCarryRule: '',
          empFixedCarryRule: '',
          empPayFixedAmount: '',
          compPayBaseLimit: '',
          compPayBaseLower: '',
          compPayRatio: '',
          compPayFixedAmount: '',
          compBaseCarryRule: '',
          compFixedCarryRule: ''
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
      /** 基数上限校验 */
      getMaxRules (preKey) {
        return [
          getRule('请输入基数上限', 'change', 'number'),
          { min: this.form[`${preKey}PayBaseLower`], message: '不能小于基数下限', type: 'number', trigger: 'change' },
          { max: 99999999, message: '不能超过8位数', type: 'number', trigger: 'change' }
        ]
      },
      /** 基数下限校验 */
      getMinRules (preKey) {
        return [
          getRule('请输入基数下限', 'change', 'number'),
          { max: this.form[`${preKey}PayBaseLimit`], message: '不能大于基数上限', type: 'number', trigger: 'change' },
          { max: 99999999, message: '不能超过8位数', type: 'number', trigger: 'change' }
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
        req('getOptionsByAreaId', { areaId: id }).then(res => {
          if (res) {
            this.isInsuranceListLoaded = true
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
          res && this.setInsuranceDetail(res)
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
      /** 重置已选选项 */
      resetSelectedOption (keys) {
        keys.map(key => {
          this.form[key] = ''
        })
        this.setInsuranceDetail('')
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
