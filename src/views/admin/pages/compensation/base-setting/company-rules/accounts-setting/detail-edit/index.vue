<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="户头代码" prop="accountCode">
          <el-input v-model="form.accountCode" :disabled="!!accountId"></el-input>
        </el-form-item>
        <el-form-item label="公司代码" prop="companyCode">
          <remote-select
            v-model="form.companyCode"
            dataKey="company"
            :props="remoteProps"
            :disabled="!!accountId"
          ></remote-select>
        </el-form-item>
        <el-form-item label="社保编号" prop="securityNumber">
          <el-input v-model="form.securityNumber" :disabled="!!accountId"></el-input>
        </el-form-item>
        <el-form-item label="开户时间" prop="openingDate">
          <el-date-picker
            v-model="form.openingDate"
            type="date"
            :disabled="!!accountId"
          >
          </el-date-picker>
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
        <el-form-item label="增员申请时间">
          <el-date-picker
            v-model="form.addApplyDate"
            type="date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="增员生效时间">
          <el-date-picker
            v-model="form.addEffectiveDate"
            type="month"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所在区域" prop="areaId">
          <i-select-area v-model="form.areaId" :disabled="!!accountId"></i-select-area>
        </el-form-item>
        <el-form-item label="行业代码" prop="tradeCode">
          <el-input v-model="form.tradeCode"></el-input>
        </el-form-item>
        <el-form-item label="执行日期" prop="executeDate">
          <el-date-picker
            v-model="form.executeDate"
            type="date"
            :picker-options="executeOptions"
          >
          </el-date-picker>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="户头名称" prop="accountName">
          <el-input v-model="form.accountName" :disabled="!!accountId"></el-input>
        </el-form-item>
        <el-form-item label="户头类型" prop="accountType">
          <i-select v-model="form.accountType" parameter="ACCOUNT_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="开户社保局" prop="bohrssName">
          <el-input v-model="form.bohrssName" :disabled="!!accountId"></el-input>
        </el-form-item>
        <el-form-item label="户头管理员" prop="fullName">
          <el-input v-model="form.fullName" readonly @click.native="handlePersonnelClick">
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
        <el-form-item label="失效日期" prop="uneffectiveDate">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="month"
            :picker-options="uneffectOptions"
            :disabled="isDateDisabled"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="减员申请时间">
          <el-date-picker
            v-model="form.delApplyDate"
            type="date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="减员生效时间">
          <el-date-picker
            v-model="form.delEffectiveDate"
            type="date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失业险年检时间" prop="unempAuditTime">
          <el-input v-model="form.unempAuditTime"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="trade">
          <el-input v-model="form.trade"></el-input>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import companyReq from 'api/compensation'
  const RULES = {
    accountCode: [
      getRule('请输入户头代码'),
      { min: 0, max: 20, message: '只能输入20个字符', trigger: 'change' },
      { pattern: '^[A-Za-z0-9]+$', message: '只能输入英文和数字' }
    ],
    companyCode: getRule('请选择公司代码', 'change'),
    securityNumber: [
      getRule('请输入社保编号', 'change'),
      { min: 0, max: 20, message: '只能输入20个字符', trigger: 'change' },
      { pattern: '^[A-Za-z0-9]+$', message: '只能输入英文和数字' }
    ],
    openingDate: getRule('请选择开户时间', 'change', 'date'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    accountName: [
      getRule('请输入户头名称'),
      { min: 0, max: 40, message: '只能输入50个字', trigger: 'change' }
    ],
    accountType: getRule('请选择户头类型', 'change'),
    areaId: getRule('请选择区域', 'change'),
    bohrssName: [
      getRule('请输入开户社保局'),
      { min: 0, max: 50, message: '只能输入50个字', trigger: 'change' }
    ],
    fullName: getRule('请输入户头管理员', 'change'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date'),
    unempAuditTime: [{ min: 0, max: 20, message: '只能输入20个字符', trigger: 'change' }],
    tradeCode: [
      getRule('请输入行业代码'),
      { min: 0, max: 2, message: '只能输入2个字符', trigger: 'change' },
      { pattern: '^[A-Za-z0-9]+$', message: '只能输入英文和数字' }
    ],
    trade: [
      getRule('请输入行业', 'change'),
      { pattern: '[\u4e00-\u9fa5]', message: '只能输入中文' }
    ],
    executeDate: getRule('请选择执行日期', 'change', 'date')
  }
  export default {
    mixins: [EditorMixin],
    components: {
      RemoteSelect
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      accountId: String
    },
    computed: {
    },
    data: function () {
      return {
        selectedPersonnel: [],
        isShowPersonnel: false,
        instance: null,
        companyApiConfig: {
          req: companyReq,
          name: 'getCompanies'
        },
        remoteProps: {
          value: 'companyCode',
          label: 'companyCode'
        },
        form: {
          accountCode: '',
          companyCode: '',
          securityNumber: '',
          openingDate: null,
          effectiveDate: null,
          addApplyDate: '',
          addEffectiveDate: '',
          areaId: '',
          accountName: '',
          accountType: '',
          bohrssName: '',
          fullName: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          delApplyDate: '',
          delEffectiveDate: '',
          unempAuditTime: '',
          tradeCode: '',
          trade: '',
          executeDate: ''

        },
        effectOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.parse(this.form.uneffectiveDate) - 3600 * 1000 * 24
          }
        },
        uneffectOptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(this.form.effectiveDate) + 3600 * 1000 * 24
          }
        },
        executeOptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(this.form.executeDate) + 3600 * 1000 * 24
          }
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
        this.instance = this.accountId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 人员选择事件监听 */
      handlePersonnelClick () {
        this.isShowPersonnel = true
      },

      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected) {
        this.form.fullName = selected[0].employeeName
        this.form.employeeId = selected[0].employeeId
      },

      /** 处理区域点击变化 */
      handleAreaChange () {},

      /** 人员选择取消事件 */
      handlePersonnelDialogCancel () {
        // 如果表单未选中人则重置人员选择
        this.form.employeeId || this.$refs.personnelSelect.resetData()
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.accountId)
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
