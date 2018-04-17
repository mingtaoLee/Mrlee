<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="公司代码" prop="companyCode">
          <remote-select
            v-model="form.companyCode"
            dataKey="company"
            :props="remoteProps"
            :disabled="isDisabled"
            @option-click="handleOptionClick"
          ></remote-select>
        </el-form-item>
        <el-form-item label="基本户" prop="basicAccount">
          <el-input v-model="form.basicAccount" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="支付账户" prop="payAccount">
          <el-input v-model="form.payAccount"></el-input>
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <i-select v-model="form.isDefault" parameter="WHETHER_TYPE"></i-select>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付主体" prop="paymentCompanyCode">
          <i-select
            v-model="form.paymentCompanyCode"
            dataKey="company"
            :props="companyProps"
          ></i-select>
        </el-form-item>
        <el-form-item label="支付银行类别" prop="payBankType">
          <i-select v-model="form.payBankType" parameter="BANK_TYPE"></i-select>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import companyReq from 'api/compensation'
  const RULE = {
    companyCode: getRule('请选择公司代码', 'change'),
    companyName: getRule('请选择公司名称', 'change'),
    basicAccount: [
      getRule('请输入基本户', 'change'),
      { pattern: /^[0-9]\d*$/, message: '只能输入数字' },
      { min: 10, max: 30, message: '长度限制在10-30个数字', trigger: 'change' }
    ],
    payAccount: [
      getRule('请输入支付账户', 'change'),
      { pattern: /^[0-9]\d*$/, message: '只能输入数字' },
      { min: 12, max: 20, message: '长度限制在12-20个数字', trigger: 'change' }
    ],
    paymentCompanyCode: getRule('请选择支付主体', 'change'),
    payBankType: getRule('请选择支付银行类别', 'change'),
    isDefault: getRule('请选择是否默认', 'change')
  }
  export default {
    mixins: [EditorMixin],
    components: {
      RemoteSelect
    },
    props: {
      companyAccountId: String
    },
    data: function () {
      return {
        instance: null,
        form: {
          companyCode: '',
          companyName: '',
          payAccount: '',
          basicAccount: '',
          payBankType: '',
          paymentCompanyCode: '',
          isDefault: ''
        },
        rules: RULE,
        companyApiConfig: {
          req: companyReq,
          name: 'getCompanies'
        },
        remoteProps: {
          value: 'companyCode',
          label: 'companyCode'
        },
        companyProps: {
          value: 'companyCode',
          label: 'companyName'
        }
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

      /** 选项点击事件监听 */
      handleOptionClick (item) {
        this.form.companyCode = item.companyCode || '公司代码'
        this.form.companyName = item.companyName || '公司名称'
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
