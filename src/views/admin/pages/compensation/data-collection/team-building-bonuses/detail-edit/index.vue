<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="组织" prop="orgId">
          <i-select v-model="form.parentUnitId" parameter="COMPONENT_ATTRIBUTE"></i-select>
        </el-form-item>
        <el-form-item label="门店名称" prop="orgId">
          <i-select v-model="form.orgUnitName" parameter="COMPONENT_ATTRIBUTE"></i-select>
        </el-form-item>
        <el-form-item label="开业时间" prop="effectiveDate">
          <el-date-picker
            v-model="form.beginRunDate"
            type="date"
            :picker-options="effectOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收入单价(元/平方米)" prop="salary">
          <el-input v-model="form.unitIncome"></el-input>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="时间段" prop="orgId">
          <i-select v-model="form.period" parameter="COMPONENT_ATTRIBUTE"></i-select>
        </el-form-item>
        <el-form-item label="店编" prop="areaId">
          <el-input v-model="form.orgUnitCode"></el-input>
        </el-form-item>
        <el-form-item label="总建筑面积" prop="areaId">
          <el-input v-model="form.totalArea"></el-input>
        </el-form-item>
        <el-form-item label="时间段内费用(万元)" prop="areaId">
          <el-input v-model="form.totalSpend"></el-input>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  const RULES = {
    componentName: getRule('请输入项目薪资名称'),
    componentType: getRule('请选择薪资项目分类', 'change'),
    componentAttribute: getRule('请选择项目属性', 'change'),
    componentForType: getRule('请选适用类型', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
  }
  export default {
    name: '',
    components: {
      ISelect
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      componentId: String
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          parentUnitId: '',
          orgUnitName: '',
          beginRunDate: '',
          unitIncome: '',
          period: '',
          orgUnitCode: '',
          totalArea: '',
          totalSpend: ''
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
        this.instance = this.componentId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 处理区域点击变化 */
      handleAreaChange () {},

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.componentId)
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
