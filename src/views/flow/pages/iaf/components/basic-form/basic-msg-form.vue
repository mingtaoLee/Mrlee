<template>
  <div>
    <el-form :inline="true" label-width="100px" :model="formData">
      <el-form-item label="姓名">
        <el-input v-model="formData.fullName"></el-input>
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="formData.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="formData.gender"></el-input>
      </el-form-item>
      <el-form-item label="出生年月">
        <el-date-picker class="dateInput" v-model="formData.test" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="formData.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="人事范围">
        <i-select 
          class="dateInput" 
          clearable 
          v-model="formData.personalArea" 
          parameter="dict" 
          placeholder="请选择字典"
        ></i-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="formData.test"></el-input>
      </el-form-item>
      <el-form-item label="岗位">
        <el-input v-model="formData.test"></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="formData.test"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
      <slot></slot>
    </el-form>
  </div>
</template>

<script>

import ISelect from 'components/common/i-select/i-select.vue'

export default {
  components: {
    ISelect
  },
  props: {
    formData: Object
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
  .dateInput{
    width:185px;
  }
</style>
