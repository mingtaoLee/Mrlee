<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="工号" prop="employeeCode">
          <el-input v-model="form.employeeCode" :disabled="!!empfullsalaryId"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="orgUnitName">
          <el-input v-model.number="form.orgUnitName" :disabled="!!empfullsalaryId"></el-input>
        </el-form-item>
        <el-form-item label="薪资组" prop="groupName">
          <el-input v-model="form.groupName" :disabled="!!empfullsalaryId"></el-input>
        </el-form-item>
        <el-form-item label="月薪标准" prop="monthStandard">
          <el-input v-model.number="form.monthStandard"></el-input>元/月
        </el-form-item>
        <el-form-item label="小时工资标准" prop="hourWorkStandard">
          <el-input v-model.number="form.hourWorkStandard"></el-input>元/时
        </el-form-item>
        <el-form-item label="与原工资对比">
          <i-select v-model="searchParam.isCompare" parameter="WHETHER_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="调薪类型">
          <i-select v-model="searchParam.adjustType" parameter="PAY_ADJUST_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="失效日期" prop="unEffectiveDate">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="month"
            :picker-options="uneffectOptions"
            :disabled="isDateDisabled"
          >
          </el-date-picker>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="form.fullName" :disabled="!!empfullsalaryId"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="name">
          <el-input v-model="form.name" :disabled="!!empfullsalaryId"></el-input>
        </el-form-item>
        <el-form-item label="时薪标准" prop="hourStandard">
          <el-input v-model="form.hourStandard"></el-input>元/时
        </el-form-item>
        <el-form-item label="随时效浮动">
          <i-select v-model="searchParam.varyWithHourstd" parameter="WHETHER_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="调薪原因" prop="adjustReason">
          <el-input v-model="form.adjustReason"></el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="month"
            :picker-options="effectOptions"
            :disabled="isDateDisabled"
          >
          </el-date-picker>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  // import { getRule } from 'utils/index'
  // const RULES = {
  //   effectiveDate: getRule('请选择生效日期', 'change', 'date')
  // }
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
      empfullsalaryId: String
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          employeeCode: '',
          name: '',
          orgUnitName: '',
          costCenter: '',
          taxCompany: '',
          fullName: '',
          employeeStatus: '',
          groupName: '',
          payCompany: '',
          effectiveDate: '',
          monthStandard: '',
          hourStandard: '',
          hourWorkStandard: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00')
        },
        effectOptions: {
          // disabledDate: (time) => {
          //   return time.getTime() > Date.parse(this.form.effectiveDate) - 3600 * 1000 * 24
          // }
        },
        companyProps: {
          value: 'companyCode',
          label: 'companyName'
        }
        // rules: RULES
      }
    },
    created () {
      this.init()
    },
    methods: {
      /** 初始化 */
      init () {
        this.initInstance()
        this.initData()
      },

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.empfullsalaryId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 处理区域点击变化 */
      handleAreaChange () {},

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.empfullsalaryId)
      },

      /** 数据保存 */
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              this.instance.save().then(res => {
                resolve(res)
              })
            } else {
              resolve(false)
            }
          })
        })
      },

      /** 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.form)
            } else {
              resolve(false)
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
