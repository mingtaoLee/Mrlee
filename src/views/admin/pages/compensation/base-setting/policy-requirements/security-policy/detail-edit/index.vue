<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <!--<el-form-item label="社保政策名称" prop="name">-->
          <!--<el-input v-model="form.name"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="所在区域" prop="areaId">
          <i-select-area v-model="form.areaId" :disabled="isDisabled" search></i-select-area>
        </el-form-item>
        <el-form-item label="最低工资" prop="socialMinSalary">
          <el-input :id="form.MinSalaryId" v-model.number="form.socialMinSalary" type="number" :min="0" @change="handleMinChange"></el-input>
          <!-- <el-input type="number" v-model.number="form.socialMinSalary"></el-input> -->
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
      <li class="item">
        <el-form-item label="社平工资" prop="socialAverageSalary">
          <el-input v-model.number="form.socialAverageSalary" type="number" :min="0" @change="handleSalaryChange"></el-input>
        </el-form-item>
        <el-form-item label="最低小时工资" prop="socialMinHourSalary">
          <el-input v-model.number="form.socialMinHourSalary" type="number" :min="0" @change="handleMinHourSalaryChange"></el-input>
        </el-form-item>
        <el-form-item label="失效日期" prop="uneffectiveDate">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="month"
            :picker-options="uneffectOptions"
            :disabled="isDateDisabled"
          >
          </el-date-picker>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    areaId: getRule('请选择所在区域', 'change'),
    socialMinSalary: [
      { required: true, type: 'number', message: '请输入最低工资', trigger: 'change' },
      { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
    ],
    socialAverageSalary: [
      { required: true, type: 'number', message: '请输入社平工资', trigger: 'change' },
      { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
    ],
    socialMinHourSalary: [
      { required: true, type: 'number', message: '请输入最低小时工资', trigger: 'change' },
      { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
    ],
    effectiveDate: [
      { required: true, type: 'date', message: '请选择生效日期', trigger: 'change' }
    ],
    uneffectiveDate: [
      { required: true, type: 'date', message: '请选择失效日期', trigger: 'change' }
    ]
  }
  export default {
    mixins: [EditorMixin],
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      id: String
    },
    data: function () {
      return {
        instance: null,
        form: {
          areaId: '',
          socialMinSalary: '',
          socialAverageSalary: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          MinSalaryId: 'MinSalaryId'
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
        this.instance = this.getInstance(this.editorStatus, opts)
      },

      /** 获取对应实例 */
      getInstance (editorStatus, opts) {
        switch (editorStatus) {
          case '1':
            return new BaseEditor(opts)
          case '2':
            return new NewEditor(opts)
          default:
            return new Modifier(opts)
        }
      },

      handleSalaryChange () {
        let averageSalaryDecimal = this.form.socialAverageSalary.toFixed(2)
        if (this.form.socialAverageSalary !== averageSalaryDecimal) {
          this.form.socialAverageSalary = parseFloat(averageSalaryDecimal)
        }
      },
      handleMinChange () {
        let minDecimal = this.form.socialMinSalary.toFixed(2)
        if (this.form.socialMinSalary !== minDecimal) {
          this.form.socialMinSalary = parseFloat(minDecimal)
        }
      },
      handleMinHourSalaryChange () {
        let minDecimal = this.form.socialMinHourSalary.toFixed(2)
        if (this.form.socialMinHourSalary !== minDecimal) {
          this.form.socialMinHourSalary = parseFloat(minDecimal)
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
  }
</style>
