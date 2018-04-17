<template>
  <el-form v-loading="loading" :element-loading-text="loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="100px" :model="form" :rules="rules" v-cloak>
    <el-form-item label="核算月份" prop="checkMonth">
      <el-date-picker
        v-model="form.checkMonth"
        type="month"
        value-format="yyyyMM"
      ></el-date-picker>
    </el-form-item>
    <el-form-item v-if="config.includes('org')" label="组织" prop="orgUnitIds">
      <i-select-tree
        v-model="form.orgUnitIds"
        multiple
        dataKey="org"
        nodeKey="orgUnitId"
      ></i-select-tree>
    </el-form-item>
  </el-form>
</template>
<script>
  import { getRule } from 'utils/index'
  const RULES = {
    checkMonth: getRule('请选择核算月份', 'change')
  }
  export default {
    name: 'IsolateEdit',
    computed: {
      loadingText (value) {
        return `正在抽取${this.form.checkMonth}数据中，请稍候...`
      }
    },
    props: {
      config: {
        type: Array,
        default: ['org']
      }
    },
    data: function () {
      return {
        loading: false,
        instance: null,
        form: {
          checkMonth: ''
        },
        rules: RULES
      }
    },
    beforeDestroy () {
      this.$eventBus.$emit('isolateDisabled', false)
    },
    methods: {
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
