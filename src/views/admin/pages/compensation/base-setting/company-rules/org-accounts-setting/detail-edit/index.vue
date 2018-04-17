<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="人事范围名称" prop="personnelGroupName">
          <remote-select
            v-model="form.personnelGroupName"
            dataKey="personnelGroup"
            @option-click="handlePersonnelOptionClick"
            :props="personnelProps"
            :disabled="!!accountPersonnelId"
          ></remote-select>
        </el-form-item>
        <el-form-item label="户头名称" prop="accountName" required>
          <remote-select
            v-model="form.accountName"
            dataKey="account"
            @option-click="handleOptionClick"
            :props="remoteProps"
            :disabled="!!accountPersonnelId"
          ></remote-select>
        </el-form-item>
        <el-form-item label="社保编号" required>
          <el-input v-model="form.securityNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="开户时间" required>
          <el-date-picker
          v-model="form.openingDate"
          type="date"
          disabled
        >
        </el-date-picker>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="month"
            :disabled="isDateDisabled"
            :picker-options="effectOptions"
          >
          </el-date-picker>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="人事范围代码" required>
          <el-input v-model="form.personnelGroupCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="户头代码" required>
          <el-input v-model="form.accountCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="开户社保局" required>
          <el-input v-model="form.bohrssName" disabled></el-input>
        </el-form-item>
        <el-form-item label="险种" prop="insuranceType">
          <i-select
            v-model="form.insuranceType"
            :disabled="!!accountPersonnelId"
            :async="false"
            :options="insuranceTypeList"
          ></i-select>
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
  import req from 'api/compensation/base-setting/company-rules'
  import ISelect from 'components/common/i-select/i-select.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  import reqIndex from 'api/compensation'
  import RemoteSelect from 'components/compensation/remote-select/index.vue'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    accountId: getRule('请选择户头', 'change'),
    accountName: getRule('请输入户头名称', 'change'),
    personnelGroupName: getRule('请选择人事范围', 'change'),
    insuranceType: getRule('请选择险种', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
  }
  export default {
    mixins: [EditorMixin],
    components: {
      ISelect,
      RemoteSelect
    },
    props: {
      accountPersonnelId: String
    },
    computed: {
      isOverTime (value) {
        return (!!this.accountPersonnelId && (new Date(this.form.effectiveDate) - new Date() < 0))
      }
    },
    data: function () {
      return {
        insuranceTypeList: [],
        instance: null,
        remoteProps: {
          label: 'accountName',
          value: 'accountName'
        },
        // 工资套远程搜索api配置项
        apiConfig: {
          req: reqIndex,
          name: 'getAccounts'
        },
        // 人事范围远程搜索api配置项
        personnelApiConfig: {
          req: reqIndex,
          name: 'getPersonnelGroups'
        },
        personnelProps: {
          label: 'personnelGroupName',
          value: 'personnelGroupName'
        },
        /** 默认组织选项 */
        defaultOrgNode: {},
        form: {
          accountId: '',
          accountCode: '',
          orgUnitId: '',
          personnelGroupCode: '',
          securityNumber: '',
          bohrssName: '',
          openingDate: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00')
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
        rules: RULES
      }
    },
    methods: {

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.accountPersonnelId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 组织选择事件 */
      handleOrgNodeClick (data) {
        this.form.personnelGroupCode = data.personnelGroupCode
      },

      /** 组织选择清空事件 */
      handleOrgNodeDelete (value) {
        this.form.personnelGroupCode = ''
      },

      /** 选项点击事件监听 */
      handleOptionClick (item) {
        this.form.accountId = item.accountId
        this.form.accountCode = item.accountCode
        this.form.securityNumber = item.securityNumber
        this.form.bohrssName = item.bohrssName
        this.form.openingDate = item.openingDate
        this.insuranceTypeList = item.insuranceTypeList
      },

      /** 人事范围选项点击事件监听 */
      handlePersonnelOptionClick (item) {
        this.form.personnelGroupCode = item.personnelGroupCode
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.accountPersonnelId)
      },

      handleChange (value) {
        // TODO 获取户头代码关联的其他信息
        req('getAccount', { accountId: value }).then(res => {
          if (res) {
            ['securityNumber', 'accountCode', 'bohrssName', 'openingDate'].map(key => {
              this.form[key] = res[key]
            })
          }
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
