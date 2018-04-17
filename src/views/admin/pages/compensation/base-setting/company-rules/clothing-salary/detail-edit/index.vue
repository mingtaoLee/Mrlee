<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="区域" prop="areaId">
          <i-select-area
            v-model="form.areaId"
            :disabled="!!componentId"
            type="yonghui"
            @change="handleAreaChange"
          ></i-select-area>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            :disabled="isDateDisabled"
            type="month"
            :picker-options="effectOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="服装底薪" prop="salary">
          <el-input type="number" :min="0" v-model.number="form.salary" @change="handleSalaryChange"></el-input>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="门店" prop="orgId">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            :disabled="!!componentId"
            v-model="form.orgId"
            lazy
            size="small"
          ></i-select-tree>
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
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    areaId: getRule('请选择区域', 'change'),
    orgId: getRule('请选择门店', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date'),
    salary: [
      { required: true, min: 0, max: 99999999, message: '请输入8位以内的正数', type: 'number', trigger: 'change' }
    ]
  }
  export default {
    mixins: [EditorMixin],
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      componentId: String
    },
    computed: {
      isOverTime (value) {
        return (!!this.componentId && (new Date(this.form.effectiveDate) - new Date() < 0))
      }
    },
    data: function () {
      return {
        defaultNode: {},
        instance: null,
        form: {
          areaId: '',
          orgId: '',
          salary: '',
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
        this.instance = this.componentId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.componentId)
      },
      handleSalaryChange () {
        if (this.form.salary < 0) {
          this.form.salary = ''
          return
        }
        let minDecimal = this.form.salary.toFixed(2)
        if (this.form.salary !== minDecimal) {
          this.form.salary = parseFloat(minDecimal)
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
