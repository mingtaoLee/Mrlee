<template>
  <el-form :model="form" :rules="rules" ref="tax-tpl-modify" label-width="80px">
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item prop="bankTemplateName" label="模板名称">
          <el-input v-model="form.bankTemplateName" :disabled="previewMode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="areaId" label="所在区域">
          <i-select-area
            v-model="form.areaId"
            :disabled="previewMode"
            search
            :panelAmount="2"
            return-node
          ></i-select-area>
        </el-form-item>
      </el-col>
      <el-col :span="12">
      <el-form-item prop="bankCode" label="银行名称">
        <i-select v-model="form.bankCode" :disabled="previewMode" parameter="BANK_TYPE"></i-select>
      </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="effectiveDate" label="生效日期">
          <el-date-picker
            v-model="form.effectiveDate"
            type="month"
            :disabled="isDateDisabled"
            :picker-options="effectOptions"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="uneffectiveDate" label="失效日期">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="month"
            :disabled="isDateDisabled"
            :picker-options="uneffectOptions"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <slot name="tab"></slot>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select'
  import { getRule, getDict } from 'utils/index'
  import BankTaxMixin from 'mixins/compensation/bank-tax-mixin'
//  import EditorMixin from 'mixins/compensation/editor-mixin'
//  import { showMessage, confirmPopover } from 'utils/index'
  const RULES = {
    bankTemplateName: [
      getRule('请填写模板名称', 'change'),
      { min: 0, max: 50, message: '只能输入50个字', trigger: 'change' }
    ],
    bankCode: getRule('请选择银行名称', 'change'),
    areaId: getRule('请填写省市区名称', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    remark: { min: 0, max: 200, message: '只能输入200个字', trigger: 'change' }
  }
  export default {
    mixins: [BankTaxMixin],
    data () {
      return {
        rules: RULES
      }
    },
    created () {
      this.form.effectiveDate && (this.form.effectiveDate = new Date(this.form.effectiveDate))
      this.form.uneffectiveDate = new Date(this.form.uneffectiveDate)
    },
    props: {
      form: {
        type: Object,
        default: () => {
          return {
            bankTemplateName: '',
            bankCode: '',
            bankName: '',
            areaId: '',
            effectiveDate: '',
            uneffectiveDate: new Date('9999-12-31 00:00:00'),
            remark: ''
          }
        }
      },
      previewMode: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleAreaChange (node) {
        // console.log(node, this.form)
      },
      initData () {
        // if (this.data.calculateRuleId) {
        // } else {
        // }
        getDict('ATTENDANCE_ITEM').then(res => {
          if (res) {
            // this.attendanceOptions = this.transformAttendanceOptions(res)
            this.instance.initData(this.id)
            this.vm.setIsDateDisabled()
          }
        })
      }
    },
    components: {
      ISelect
    }
  }
</script>
