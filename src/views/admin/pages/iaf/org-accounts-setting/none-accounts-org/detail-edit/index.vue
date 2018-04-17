<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="人事范围名称">
          <el-input v-model="form.personnelGroupName" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="户头名称" prop="accountId">
          <i-select
            v-model="form.accountId"
            async="false"
            :props="accountProps"
            :options="accountOptions"
            @option-click="handleChange">
          </i-select>
        </el-form-item> -->
        <el-form-item label="户头名称" prop="accountName" required>
          <remote-select
            v-model="form.accountName"
            dataKey="accountTwo"
            @option-click="handleOptionClick"
            :props="remoteProps"
            :disabled="!!accountPersonnelId"
            :extraParams="userParams"
          ></remote-select>
        </el-form-item>
        <el-form-item label="险种" prop="insuranceType">
          <!-- <i-select
            @change="getInfo"
            v-model="form.insuranceType"
            :async="false"
            :options="insuranceTypeList"
          ></i-select> -->
          <i-select 
            @change="getInfo"
            v-model="form.insuranceType" 
            parameter="INSURANCE_TYPE">
          </i-select>
        </el-form-item>
        <el-form-item label="开户时间" required>
          <el-date-picker
            v-model="form.openingDate"
            type="date"
            :editable="false"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="date"
            :editable="false"
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
        <el-form-item label="社保编号" required>
          <el-input v-model="form.securityNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="开户社保局" required>
          <el-input v-model="form.bohrssName" disabled></el-input>
        </el-form-item>
        <el-form-item label="失效日期" prop="uneffectiveDate">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="date"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import reqAccount from 'api/iaf'
  import ISelect from 'components/common/i-select/i-select.vue'
  import RemoteSelect from 'components/compensation/remote-select/index.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  const RULES = {
    accountName: getRule('请输入户头名称', 'change'),
    accountId: getRule('请选择户头', 'change'),
    insuranceType: getRule('请选择险种', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
  }
  export default {
    name: '',
    components: {
      ISelect,
      RemoteSelect
    },
    props: {
      personnelGroupCode: String
    },
    computed: {
    },
    watch: {
      '$store.getters.userId' (newVal) {
        this.userParams.userId = newVal
      }
    },
    data: function () {
      return {
        userParams: {userId: this.$store.getters.userId},
        insuranceTypeList: [],
        instance: null,
        remoteProps: {
          label: 'accountNameA',
          value: 'accountNameA'
        },
        accountProps: {
          label: 'accountName',
          value: 'accountId'
        },
        accountOptions: [],
        form: {
          accountId: '',
          accountCode: '',
          personnelGroupCode: '',
          personnelGroupName: '',
          securityNumber: '',
          insuranceType: '',
          bohrssName: '',
          openingDate: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31')
        },
        rules: RULES
      }
    },
    created () {
      this.init()
    },
    methods: {
      /** 选项点击事件监听 */
      handleOptionClick (item) {
        this.form.accountId = item.accountId
        this.form.accountCode = item.accountCode
        this.form.securityNumber = item.securityNumber
        this.form.bohrssName = item.bohrssName
        this.form.openingDate = item.openingDate
        this.insuranceTypeList = item.insuranceTypeList
      },
      getInfo (value) {
        if (this.form.accountCode === '') {
          this.$message.error('请先选择户头名称！')
        } else {
          reqAccount('getOhterInfo', { accountCode: this.form.accountCode, insuranceType: value }).then(res => {
            Object.assign(this.form, {securityNumber: res.securityNumber, openingDate: res.openingDate, bohrssName: res.bohrssName})
          })
        }
      },
      /** 初始化 */
      async init () {
        this.initInstance()
        await this.initAccountOptions()
        this.initData()
      },

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.personnelGroupCode ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 户头选项获取 */
      initAccountOptions () {
        reqAccount('getAccounts').then(res => {
          this.accountOptions = res
        })
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.personnelGroupCode)
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

      handleChange (option) {
        if (option) {
          ['securityNumber', 'accountCode', 'bohrssName', 'openingDate'].map(key => {
            this.form[key] = option[key]
          })
          this.insuranceTypeList = option.insuranceTypeList
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
