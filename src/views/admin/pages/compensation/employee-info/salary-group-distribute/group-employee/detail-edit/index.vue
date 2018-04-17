<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="工号" prop="employeeCode">
          <el-input v-model="form.employeeCode" :disabled="!!empgroupId"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="name">
          <el-input v-model="form.name" :disabled="!!empgroupId"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="orgUnitName">
          <el-input v-model.number="form.orgUnitName" :disabled="!!empgroupId"></el-input>
        </el-form-item>
        <el-form-item label="薪资组代码" prop="groupCode">
          <el-input v-model.number="form.groupCode" :disabled="!!empgroupId"></el-input>
        </el-form-item>
        <el-form-item label="报税主体" prop="taxCompany">
          <i-select
            v-model="form.taxCompany"
            dataKey="company"
            :props="taxCompanyProps"
          ></i-select>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="form.fullName" :disabled="!!empgroupId"></el-input>
        </el-form-item>
        <el-form-item label="在职状态" prop="employeeStatus">
          <i-select v-model="form.employeeStatus" parameter="EMPLOYEE_STATUS" :disabled="!!empgroupId"></i-select>
        </el-form-item>
        <el-form-item label="薪资组名称" prop="groupName">
          <el-input v-model="form.groupName" :disabled="!!empgroupId"></el-input>
        </el-form-item>
        <el-form-item label="发薪主体" prop="payCompany">
          <i-select
            v-model="form.payCompany"
            dataKey="company"
            :props="payCompanyProps"
            :disabled="!!empgroupId"
          ></i-select>
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
      </li>
    </ul>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import { getRule } from 'utils/index'
  const RULES = {
    taxCompany: getRule('请选择报税主体', 'change')
  }
  export default {
    mixins: [EditorMixin],
    components: {
      ISelect
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      empgroupId: String
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          employeeCode: '',
          name: '',
          orgUnitName: '',
          // costCenter: '',
          taxCompany: '',
          fullName: '',
          employeeStatus: '',
          groupName: '',
          groupCode: '',
          payCompany: '',
          effectiveDate: ''
        },
        effectOptions: {
          // disabledDate: (time) => {
          //   return time.getTime() > Date.parse(this.form.effectiveDate) - 3600 * 1000 * 24
          // }
        },
        taxCompanyProps: {
          value: 'companyCode',
          label: 'companyName'
        },
        payCompanyProps: {
          value: 'companyCode',
          label: 'companyName'
        },
        rules: RULES
      }
    },
    created () {
      this.init()
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
        this.instance = this.empgroupId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 处理区域点击变化 */
      handleAreaChange () {},

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.empgroupId)
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
