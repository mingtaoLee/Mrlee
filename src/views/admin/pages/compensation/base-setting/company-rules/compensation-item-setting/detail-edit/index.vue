<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="薪资项目名称" prop="componentName">
          <el-input v-model="form.componentName" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="项目属性" prop="componentAttribute">
          <i-select v-model="form.componentAttribute" parameter="COMPONENT_ATTRIBUTE"></i-select>
        </el-form-item>
        <el-form-item label="精度" prop="accuracy">
          <el-input type="number" :min="0" :step="0.1" v-model="form.accuracy"></el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="month"
            :picker-options="effectOptions"
            :disabled="isDateDisabled"
          ></el-date-picker>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="项目分类" prop="componentType">
          <i-select v-model="form.componentType" parameter="COMPONENT_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="进位规则" prop="carryRule">
          <i-select v-model="form.carryRule" parameter="CARRY_RULE"></i-select>
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
    componentName: [
      getRule('请输入薪资项目名称'),
      { min: 0, max: 50, message: '只能输入50个字', trigger: 'change' }
    ],
    componentType: getRule('请选择项目分类', 'change'),
    componentAttribute: getRule('请选择项目属性', 'change'),
    accuracy: {
      required: true,
      validator: (rule, value, callback) => {
        let accuracyString = value.toString()
        let pointIndex = accuracyString.indexOf('.')
        if (!value) {
          return callback(new Error('请输入精度值'))
        } else if (value < 0 || value > 99999999) {
          return callback(new Error('请输入8位以内的正数'))
        } else if (pointIndex > 0) {
          let accuracyLength = Number(accuracyString.slice(0, pointIndex))
          let accuracyDecimals = Number(accuracyString.slice(pointIndex + 1))
          if (accuracyLength < accuracyDecimals) {
            return callback(new Error('精度无效，请重新输入'))
          }
        }
        callback()
      },
      trigger: 'blur'
    },
    carryRule: getRule('请选择进位规则', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
  }
  export default {
    mixins: [EditorMixin],
    props: {
      componentId: String
    },
    data: function () {
      return {
        instance: null,
        form: {
          componentName: '',
          componentType: '',
          componentAttribute: '',
          accuracy: '',
          carryRule: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00')
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
