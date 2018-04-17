<template>
  <el-form
    v-cloak
    v-loading="loading"
    :element-loading-text="$loadingText"
    ref="form"
    class="zzf-security-policy-detail-edit"
    labelWidth="120px"
    :model="form"
    :rules="rules"
  >
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="选择员工">
          <el-input
            v-model="form.employeeName"
            :disabled="isDisabled"
            readonly
            @click.native="handlePersonnelClick">
            <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select
            ref="personnelSelect"
            :isShow.sync="isShowPersonnel"
            :multiple="false"
            :defaultSelectedPersonnel="selectedPersonnel"
            @confirm="handlePersonnelDialogConfirm"
            @cancel="handlePersonnelDialogCancel"
          ></i-personnel-select>
        </el-form-item>
        <!-- <el-form-item label="工号">
          <el-input v-model="form.employeeCode" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="组织名称"> -->
          <!-- <i-select-tree
            v-model="searchParam.orgUnitId"
            :disabled="isDisabled"
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            size="small"
          ></i-select-tree> -->
          <!-- <el-input v-model="form.orgUnitName" :disabled="isDisabled"></el-input>
        </el-form-item> -->
        <el-form-item label="发放方式" prop="deliverType">
          <i-select v-model="form.deliverType" parameter="DELIVER_TYPE" clearable></i-select>
        </el-form-item>
        <el-form-item label="银行卡号" prop="account">
          <el-input v-model="form.account" :disabled="form.deliverType === '1'"></el-input>
        </el-form-item>
        <el-form-item label="开户地区" prop="areaId">
          <i-select-area v-model="form.areaId" @change="handleAreaChange"></i-select-area>
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

        <!-- <el-form-item label="薪资组">
          <el-input v-model="form.groupName" :disabled="isDisabled"></el-input>
        </el-form-item> -->
        <el-form-item label="账户类型" prop="cardType">
          <i-select v-model="form.cardType" parameter="CARD_TYPE" ></i-select>
        </el-form-item>
        <el-form-item label="开户银行" prop="bankCode">
          <i-select v-model="form.bankCode" parameter="BANK_TYPE" ></i-select>
        </el-form-item>
        <!--<el-form-item label="模板名称" prop="bankTemplateId">-->
          <!--<i-select v-model="form.bankTemplateId" size="small" :props="bankTemplateProps" :disabled="!form.bankCode && !form.bankTemplateId" @click.native.stop="handleBankTemplateClick" :async="false" :options="templateOptions"></i-select>-->
        <!--</el-form-item>-->
        <el-form-item label="开户行名称" prop="bankName">
          <el-input v-model.number="form.bankName"></el-input>
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
    </ul>
  </el-form>
</template>
<script>
  // import { RULES } from 'config/validator-rules'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import req from 'api/compensation'
  import { BaseEditor } from './base-editor'
  import { NewEditor } from './new-editor'
  import { Modifier } from './modifier'
  import { getRule, showMessage } from 'utils/index'
  export default {
    mixins: [EditorMixin],
    props: {
      empAccountId: String
    },
    data: function () {
      return {
        // 人员默认选中
        selectedPersonnel: [],
        // 人员选择器弹出框显示属性
        isShowPersonnel: false,
        // 是否禁用模板
        isTemplateDisabled: false,
        // 模板数据
        templateOptions: [],
        // 模板配置选项
        bankTemplateProps: {
          label: 'bankTemplateName',
          value: 'bankTemplateId'
        },
        instance: null,
        form: {
          employeeName: '',
          cardType: '',
          account: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          areaId: '',
          bankCode: '',
          deliverType: '',
          bankName: ''
        }
      }
    },
    computed: {
      rules (value) {
        switch (this.form.deliverType) {
          case '1':
            this.resetBankData()
            return {
              deliverType: getRule('请选择发放方式', 'change'),
              effectiveDate: getRule('请选择生效日期', 'change', 'date'),
              uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
            }
          default:
            return {
              cardType: getRule('请选择卡类型', 'change'),
              account: [
                getRule('请输入银行卡号', 'change'),
                { pattern: /^[0-9]\d*$/, message: '只能输入数字' },
                { min: 12, max: 20, message: '长度限制在12-20个数字', trigger: 'change' }
              ],
              // account: { required: true, validator: RULES.bankNumber, trigger: 'blur' },
              bankCode: getRule('请选择开户银行', 'change'),
              bankName: getRule('请输入开户行名称', 'change'),
              areaId: getRule('请选择开户地区', 'change'),
              deliverType: getRule('请选择发放方式', 'change'),
              effectiveDate: getRule('请选择生效日期', 'change', 'date'),
              uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
            }
        }
      }
    },
    methods: {

      /** 初始化数据 */
      async initData () {
        this.instance.initData(this.empAccountId)
//        const bankCode = await this.instance.initData(this.empAccountId)
//        this.getBankTemplateOptions({value: bankCode}, true)
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
      },

      /** 下拉开户行点击事件监听 */
      handleBankClick (option) {
        this.getBankTemplateOptions(option)
      },

      /** 银行模板输入框点击事件监听 */
      handleBankTemplateClick () {
        if (!this.form.bankTemplateId && !this.form.bankCode) showMessage('warning', '请先选择开户银行')
      },

      /** 获取银行模板选项 */
      getBankTemplateOptions (option, isFirst) {
        req('getBankTemplates', {areaId: this.form.areaId, bankCode: option.value}).then(res => {
          if (res) {
            // 重置模板选项
            !isFirst && (this.form.bankTemplateId = '')
            this.templateOptions = res
          }
        }).catch(err => {
          console.log(err)
        })
      },

      /** 重置银行数据 */
      resetBankData () {
        ['cardType', 'account', 'areaId', 'bankCode', 'bankName'].map(key => {
          this.form[key] = ''
        })
      },
      /** 人员选择事件监听 */
      handlePersonnelClick () {
        if (this.isDisabled) return
        this.isShowPersonnel = true
      },

      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected) {
        this.form.employeeName = selected[0] ? selected[0].employeeName : ''
        this.form.empEmployeeId = selected[0] ? selected[0].employeeId : ''
      },

      /** 人员选择取消事件 */
      handlePersonnelDialogCancel () {
        // 如果表单未选中人则重置人员选择
        this.form.empEmployeeId || this.$refs.personnelSelect.resetData()
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
