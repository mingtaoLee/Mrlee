<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="130px" :model="form" :rules="rules" v-cloak>
    <div class="content-follow">
      <h2 class="info-title">基本信息</h2>
      <div class="info-content">
        <el-row>
          <el-col :span="8">
            <el-form-item  label="保险类型" prop="insuranceType">
              <i-select v-model="form.insuranceType" :disabled="!!areaInfoId" parameter="INSURANCE_TYPE"></i-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="!!areaInfoId">
            <el-form-item label="所在区域" prop="areaId">
              <i-select-area v-model="form.areaId" :disabled="!!areaInfoId" @change="handleAreaChange"></i-select-area>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户口性质" prop="householdCode">
              <i-select v-model="form.householdCode" parameter="IAF_ACCOUNT_TYPE"></i-select>
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
            <el-form-item label="缴纳比例" prop="empPayRatio">
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
            <el-form-item label="缴纳比例" prop="compPayRatio">
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
  import ISelect from 'components/common/i-select/i-select.vue'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  const RULES = {
    insuranceType: getRule('请选择保险类型', 'change'),
    areaId: getRule('请选择所在区域', 'change'),
    householdCode: getRule('请选择户口性质', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date'),
    empPayBaseLimit: getRule('请输入基数上限', 'blur', 'number'),
    empPayBaseLower: getRule('请输入基数下限', 'blur', 'number'),
    empPayRatio: [
      getRule('请输入缴纳比例', 'change', 'number'),
      { min: 0, max: 100, message: '请输入0到100之间的数', type: 'number', trigger: 'change' }
    ],
    empBaseCarryRule: getRule('请选择基数进位规则', 'change'),
    empFixedCarryRule: getRule('请选择固定金额进位规则', 'change'),
    empPayFixedAmount: [
      getRule('请输入固定金额', 'change', 'number'),
      { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
    ],
    compPayRatio: [
      getRule('请输入缴纳比例', 'change', 'number'),
      { min: 0, max: 100, message: '请输入0到100之间的数', type: 'number', trigger: 'change' }
    ],
    compPayFixedAmount: [
      getRule('请输入固定金额', 'change', 'number'),
      { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
    ],
    compBaseCarryRule: getRule('请选择基数进位规则', 'change'),
    compFixedCarryRule: getRule('请选择固定金额进位规则', 'change')
  }
  export default {
    mixins: [EditorMixin],
    components: {
      ISelect
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      id: String,
      areaInfoId: String
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          insuranceType: '',
          areaId: '',
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
          // disabledDate: (time) => {
          //   return time.getTime() < Date.parse(this.form.effectiveDate) + 3600 * 1000 * 24
          // }
        },
        areaProps: {
        },
        rules: RULES
      }
    },
    methods: {

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.areaInfoId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData()
      },

      /** 基数上限校验 */
      getMaxRules (preKey) {
        return [
          getRule('请输入基数上限', 'change', 'number'),
          { min: this.form[`${preKey}PayBaseLower`], message: '不能小于基数下限', type: 'number', trigger: 'change' },
          { max: 99999999, message: '输入不能超过8位数', type: 'number', trigger: 'change' }
        ]
      },
      /** 基数下限校验 */
      getMinRules (preKey) {
        return [
          getRule('请输入基数下限', 'change', 'number'),
          { max: this.form[`${preKey}PayBaseLimit`], message: '不能大于基数上限', type: 'number', trigger: 'change' },
          { max: 99999999, message: '输入不能超过8位数', type: 'number', trigger: 'change' }
        ]
      },
      /** 个人固定金额 */
      handleEmpPayChange () {
        let minDecimal = this.form.empPayFixedAmount.toFixed(2)
        console.log(minDecimal)
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
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
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
