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
            @option-click="companyCodeOptionClick"
          ></remote-select>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input @blur="getCompanyCode" v-model="form.companyName" :disabled="!!accountId"></el-input>
        </el-form-item>
        <!-- <el-form-item label="社保编号" prop="securityNumber">
          <el-input v-model="form.securityNumber" :disabled="!!accountId"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="开户时间" prop="openingDate">
          <el-date-picker
            v-model="form.openingDate"
            type="date"
            :editable="false"
            :disabled="!!accountId"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="date"
            :editable="false"
            :picker-options="effectOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所在区域" prop="areaId">
          <i-select-area v-model="form.areaId" :disabled="!!accountId"></i-select-area>
        </el-form-item>
        <!-- <el-form-item label="行业代码" prop="tradeCode">
          <el-input v-model="form.tradeCode"></el-input>
        </el-form-item> -->
      </li>
      <li class="item">
        <el-form-item label="户头名称" prop="accountName">
          <el-input v-model="form.accountName" :disabled="!!accountId"></el-input>
        </el-form-item>
        <el-form-item label="户头类型" prop="accountType">
          <i-select v-model="form.accountType" parameter="ACCOUNT_TYPE" :disabled="!!accountId"></i-select>
        </el-form-item>
        <el-form-item label="失效日期" prop="uneffectiveDate">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="date"
            :editable="false"
            :picker-options="uneffectOptions"
            :disabled="true"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="减员申请时间"> -->
          <!-- <el-date-picker
            v-model="form.delApplyDate"
            type="date"
            :editable="false"
            format="每月dd日"
          >
          </el-date-picker> -->
          <!-- <el-input v-model="form.delApplyDate"></el-input> -->
          <!-- <i-select v-model="form.delApplyDate" :options="monthDate" :async="false"></i-select>
        </el-form-item>
        <el-form-item label="减员生效时间"> -->
          <!-- <el-date-picker
            v-model="form.delEffectiveDate"
            type="date"
            format="每月dd日"
            :editable="false"
          >
          </el-date-picker> -->
          <!-- <el-input v-model="form.delEffectiveDate"></el-input> -->
          <!-- <i-select v-model="form.delEffectiveDate" :options="monthDate" :async="false"></i-select>
        </el-form-item> -->
        <el-form-item label="失业险年检时间">
          <!-- <el-input v-model="form.unempAuditTime"></el-input> -->
          <el-date-picker
            v-model="form.unempAuditTime"
            type="month"
            :editable="false"
          >
          </el-date-picker>
          <!-- <el-input v-model="form.unempAuditTime"></el-input> -->
        </el-form-item>
        <!-- <el-form-item label="行业" prop="trade">
          <el-input v-model="form.trade"></el-input>
        </el-form-item> -->
        <el-form-item label="执行日期" prop="executeDate">
          <el-date-picker
            v-model="form.executeDate"
            type="date"
            :editable="false"
            :picker-options="executeOptions"
          >
          </el-date-picker>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import ISelect from 'components/common/i-select/i-select'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import companyReq from 'api/iaf'
  const RULES = {
    accountCode: [
      getRule('请输入户头代码'),
      { min: 0, max: 20, message: '只能输入20个字符', trigger: 'change' },
      { pattern: '^[A-Za-z0-9]+$', message: '只能输入英文和数字' }
    ],
    companyCode: getRule('请选择公司代码', 'change'),
    companyName: getRule('请输入公司名称', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    accountName: [
      getRule('请输入户头名称'),
      { min: 0, max: 40, message: '只能输入50个字', trigger: 'change' }
    ],
    accountType: getRule('请选择户头类型', 'change'),
    areaId: getRule('请选择区域', 'change'),
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
      RemoteSelect,
      ISelect
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      accountId: String,
      toolbar: Object
    },
    computed: {
      monthDate () {
        let array = []
        for (let i = 1; i <= 31; i++) {
          let item = {}
          item.label = i < 10 ? `每月0${i}日` : `每月${i}日`
          item.value = i < 10 ? `每月0${i}日` : `每月${i}日`
          array.push(item)
        }
        return array
      }
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
          label: 'showCompanyName'
        },
        form: {
          showCompanyName: '',
          accountCode: '',
          companyCode: '',
          // securityNumber: '',
          openingDate: null,
          effectiveDate: null,
          addApplyDate: '',
          addEffectiveDate: '',
          areaId: '',
          accountName: '',
          accountType: '',
          bohrssName: '',
          fullName: '',
          uneffectiveDate: new Date('9999-12-31'),
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
        // executeOptions: {
        //   disabledDate: (time) => {
        //     return time.getTime() < Date.parse(this.form.executeDate) + 3600 * 1000 * 24
        //   }
        // },
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
      companyCodeOptionClick (value) {
        companyReq('getCompanyName', {companyCode: value.companyCode}).then(data => {
          this.form = Object.assign({}, this.form, {companyName: data})
        })
      },
      getCompanyCode () {
        companyReq('getCompanyCode', {companyName: this.form.companyName}).then(data => {
          this.form = Object.assign({}, this.form, {companyCode: data})
        })
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
