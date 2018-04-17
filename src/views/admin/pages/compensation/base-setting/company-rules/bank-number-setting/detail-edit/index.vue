<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="所在区域" prop="areaId">
          <i-select-area v-model="form.areaId" search></i-select-area>
        </el-form-item>
        <el-form-item label="银行类别" prop="bankType">
          <i-select v-model="form.bankType" parameter="BANK_TYPE" ></i-select>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="银行名称" prop="bankName">
          <el-input v-model="form.bankName" :disabled="isDisabledBankType"></el-input>
        </el-form-item>
        <el-form-item label="联行号" prop="bankingFirmId">
          <el-input v-model="form.bankingFirmId" :disabled="isDisabledBankingFirmId"></el-input>
        </el-form-item>
      </li>
    </ul>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" type="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    bankingFirmId: [
      { pattern: /^[0-9]\d*$/, message: '只能输入数字' },
      { min: 0, max: 20, message: '最多只能输入20个字', trigger: 'change' }
    ],
    bankType: getRule('请选择银行类别', 'change'),
    bankName: [
      getRule('请输入银行名称'),
      { min: 0, max: 50, message: '只能输入50个字', trigger: 'change' }
    ],
    areaId: getRule('请选择所属区域', 'change'),
    remark: { min: 0, max: 200, message: '只能输入200个字', trigger: 'change' }
  }
  export default {
    mixins: [EditorMixin],
    props: {
      payBankingFirmId: String
    },
    data: function () {
      return {
        isDisabledBankType: false,
        isDisabledBankingFirmId: false,
        instance: null,
        form: {
          bankingFirmId: '',
          bankType: '',
          bankName: '',
          areaId: '',
          remark: ''
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
