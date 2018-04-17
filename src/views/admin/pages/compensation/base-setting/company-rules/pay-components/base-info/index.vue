<template>
  <div class="content-follow zzf-pay-component">
    <header class="info-title">基本信息</header>
    <div class="info-content">
      <el-form
        :model="form"
        :rules="rules"
        labelWidth="100px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="工资套名称" prop="componentListName">
              <el-input v-model="form.componentListName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工资套分类" prop="componentListType">
              <i-select v-model="form.componentListType" parameter="COMPONENT_LIST_TYPE"></i-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker
                v-model="form.effectiveDate"
                type="month"
                :picker-options="effectOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="失效日期">
              <el-date-picker
                v-model="form.uneffectiveDate"
                type="month"
                :picker-options="uneffectOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import IForm from 'components/compensation/form-layout'
  import ISelect from 'components/common/i-select/i-select'
  import { getRule } from 'utils/index'
  export default {
    name: '',
    components: {
      ISelect,
      IForm
    },
    props: {
      form: Object,
      isDateDisabled: Boolean
    },
    data: function () {
      return {
        rules: {
          componentListName: [
            getRule('请输入工资套名称', 'change'),
            {min: 0, max: 20, message: '只能输入20个字', trigger: 'change'}
          ],
          componentListType: getRule('请选择工资套分类', 'change'),
          effectiveDate: getRule('请选择生效日期', 'change', 'date')
        },
        effectOptions: {
          disabledDate: (time) => {
            return time.getTime() < moment().startOf('month').valueOf() || time.getTime() > Date.parse(this.form.uneffectiveDate)
          }
        },
        uneffectOptions: {
          disabledDate: (time) => {
            return time.getTime() <= Date.parse(this.form.effectiveDate) || time.getTime() < moment().startOf('month').valueOf()
          }
        }
      }
    },
    created () {
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>

</style>
