<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <el-form-item label="选择员工" prop="empEmployeeId">
      <i-select v-model="form.empEmployeeId" parameter="dict" clearable></i-select>
    </el-form-item>
    <el-form-item label="上班方式" prop="workType">
      <i-select v-model="form.workType" parameter="dict" clearable></i-select>
    </el-form-item>
    <el-form-item label="开始时间" prop="effectiveDate">
      <el-date-picker
        v-model="form.effectiveDate"
        type="date"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="uneffectiveDate">
      <el-date-picker
        v-model="form.uneffectiveDate"
        type="date"
      >
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  const RULES = {
    empEmployeeId: getRule('请选择员工', 'change'),
    workType: getRule('请选择上班方式', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
  }
  export default {
    name: '',
    components: {
      ISelect
    },
    props: {
      attendanceBasisId: String
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          empEmployeeId: '',
          workType: '',
          effectiveDate: '',
          uneffectiveDate: ''
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
        this.instance = this.attendanceBasisId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.attendanceBasisId)
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
