<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item ref="treeForm" label="适用范围" prop="orgUnitId">
          <i-select-tree
            multiple
            dataKey="org"
            nodeKey="orgUnitId"
            :disabled="isDisabled"
            v-model="form.orgUnitId"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="职务" prop="posTitleId">
          <i-select
            dataKey="posTitles"
            v-model="form.posTitleId"
            :props="posTitleProps"
            multiple
          ></i-select>
        </el-form-item>
        <el-form-item label="档级" prop="salaryGrade">
          <el-input v-model="form.salaryGrade"></el-input>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="组织类别" prop="orgType">
          <i-select v-model="form.orgType" parameter="CPS_ORG_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="计薪方式" prop="calculateSalaryWay">
          <i-select v-model="form.calculateSalaryWay" parameter="CALCULATE_SALARY_WAY"></i-select>
        </el-form-item>
        <el-form-item label="标准工资" prop="standardSalary">
          <el-input type="number" v-model.number="form.standardSalary" :min="0" @change="handleStandardChange"></el-input>
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
    orgUnitId: getRule('请选择适用范围', 'change'),
    posTitleId: getRule('请选择职务', 'change', 'array'),
    salaryGrade: [getRule('请输入档级'), { max: 12, message: '长度限制为12个字符', type: 'string', trigger: 'blur' }],
    orgType: getRule('请选择组织类别', 'change'),
    calculateSalaryWay: getRule('请选择计薪方式', 'change'),
    standardSalary: [
      getRule('请输入标准工资', 'change', 'number'),
      { min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
    ]
  }
  export default {
    mixins: [EditorMixin],
    props: {
      salaryMatrixId: String
    },
    watch: {
      'form.orgUnitId': {
        handler (value) {
          setTimeout(() => {
            this.$refs.treeForm.validate('change')
          }, 0)
        }
      }
    },
    data: function () {
      return {
        // 职务配置选项
        posTitleProps: {
          value: 'posTitleId',
          label: 'name'
        },
        instance: null,
        form: {
          orgType: '',
          orgUnitName: '',
          orgUnitId: '',
          titleName: '',
          posTitleId: '',
          salaryGrade: '',
          calculateSalaryWay: '',
          standardSalary: ''
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
      // 标准工资
      handleStandardChange () {
        let minDecimal = this.form.standardSalary.toFixed(2)
        if (this.form.standardSalary !== minDecimal) {
          this.form.standardSalary = parseFloat(minDecimal)
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
