<template>
  <el-form
    v-loading="loading"
    :element-loading-text="$loadingText"
    :model="form"
    :rules="rules" 
    ref="form"
    label-width="80px"
  >
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
            :picker-options="uneffectOptions"
            :disabled="isDateDisabled"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="uneffectiveDate" label="失效日期">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="month"
            :picker-options="uneffectOptions"
            :disabled="isDateDisabled"
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
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
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
    mixins: [EditorMixin],
    props: {
      id: String
    },
    watch: {
    },
    data: () => {
      return {
        form: {
          bankTemplateName: '',
          bankCode: '',
          bankName: '',
          areaId: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          remark: ''
        },
        instance: null,
        rules: RULES
      }
    },
    computed: {
      previewMode () {
        return this.editorStatus !== '1' && this.editorStatus !== '2'
      }
    },
    methods: {
      initData () {
        this.instance.initData(this.id)
      },
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
