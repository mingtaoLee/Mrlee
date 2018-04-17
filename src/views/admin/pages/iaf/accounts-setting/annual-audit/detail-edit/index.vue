<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="户头名称" prop="accountName">
          <remote-select
            v-model="form.accountName"
            dataKey="accountTwo"
            @option-click="handleOptionClick"
            :props="remoteProps"
            :disabled="!!unempAuditId"
            :extraParams="userParams"            
          ></remote-select>
        </el-form-item>
        <el-form-item label="公司代码" prop="companyCode">
          <el-input v-model="form.companyCode" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="社保编号">
          <el-input v-model="form.securityNumber" disabled placeholder=" "></el-input>
        </el-form-item> -->
        <el-form-item label="年检日期" prop="auditDate">
          <el-date-picker
            v-model="form.auditDate"
            type="date"
            :editable="false"
          >
        </el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期" prop="uditEndDate">
          <el-date-picker
            v-model="form.uditEndDate"
            type="date"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="户头代码" prop="accountCode">
          <el-input v-model="form.accountCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" disabled></el-input>
        </el-form-item>
        <el-form-item label="年度" prop="auditYear">
          <el-date-picker
            v-model="form.auditYear"
            type="year"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
      </li>
    </ul>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" type="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  import req from 'api/iaf/company-rules'
  import RemoteSelect from 'components/compensation/remote-select/index.vue'
  import reqAccount from 'api/iaf'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  const RULES = {
    accountName: getRule('请输入户头名称', 'change'),
    companyCode: getRule('请输入公司代码', 'change'),
    accountCode: getRule('请输入户头代码', 'change'),
    // securityNumber: getRule('请输入社保编码', 'change'),
    companyName: getRule('请输入公司名称', 'change'),
    auditYear: getRule('请选择年度', 'change', 'date'),
    auditDate: getRule('请选择年检日期', 'change', 'date'),
    uditEndDate: getRule('请选择到期日期', 'change', 'date'),
    remark: { min: 0, max: 200, message: '只能输入200个字', trigger: 'change' }
  }
  export default {
    components: {
      RemoteSelect
    },
    props: {
      unempAuditId: String,
      toolbar: Object
    },
    computed: {
    },
    data: function () {
      return {
        userParams: {userId: this.$store.getters.userId},
        instance: null,
        form: {
          accountId: '',
          accountName: '',
          companyCode: '',
          companyName: '',
          securityNumber: '',
          auditYear: '',
          auditDate: '',
          uditEndDate: '',
          remark: ''
        },
        remoteProps: {
          label: 'accountNameA',
          value: 'accountNameA'
        },
        // 工资套远程搜索api配置项
        apiConfig: {
          req: reqAccount,
          name: 'getAccounts'
        },
        rules: RULES
      }
    },
    created () {
      this.init()
    },
    watch: {
      '$store.getters.userId' (newVal) {
        this.userParams.userId = newVal
      }
    },
    methods: {
      /** 初始化 */
      init () {
        this.initInstance()
        this.initData()
      },

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.unempAuditId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 选项点击事件监听 */
      handleOptionClick (item) {
        this.form.accountId = item.accountId
        this.form.accountCode = item.accountCode
        this.form.securityNumber = item.securityNumber
        this.form.bohrssName = item.bohrssName
        this.form.openingDate = item.openingDate
        this.form.companyCode = item.companyCode || '公司代码'
        this.form.companyName = item.companyName || '公司名称'
      },

      /** 处理区域点击变化 */
      handleAreaChange () {},

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.unempAuditId)
      },

      /** 数据保存 */
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              this.instance.save().then(res => {
                resolve(res)
              })
            } else {
              resolve(false)
            }
          })
        })
      },

      /** 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.form)
            } else {
              resolve(false)
            }
          })
        })
      },

      handleChange (value) {
        // TODO 获取户头代码关联的其他信息
        req('getAccount', { accountId: value }).then(res => {
          if (res) {
            ['companyCode', 'securityNumber', 'accountName', 'companyName'].map(key => {
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
