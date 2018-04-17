<template>
  <el-form ref="form" class="laborhour-tranfer-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
        <el-form-item label="工号" prop="employeeCode">
            <el-input v-model="form.employeeCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="employeeName">
            <el-input v-model="form.employeeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="个税主体编码" prop="taxOrgunitCode">
            <el-input v-model="form.taxOrgunitCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="个税主体名称" prop="taxOrgunitName">
            <el-input v-model="form.taxOrgunitName" disabled></el-input>
        </el-form-item>
        <el-form-item label="税款所属月" prop="taxMonth">
            <el-input v-model="form.taxMonth" disabled></el-input>
        </el-form-item>
        <el-form-item label="应付工资" prop="taxableIncome">
            <el-input type="number" v-model.number="form.taxableIncome" disabled></el-input>
        </el-form-item>
        <el-form-item label="个税" prop="personalIncomeTax">
            <el-input type="number" v-model.number="form.personalIncomeTax" disabled></el-input>
        </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name: 'CheckDetail',
    props: {
      showData: Object
    },
    computed: {
    },
    data: function () {
      return {
        form: {
          employeeCode: '',
          employeeName: '',
          taxOrgunitCode: '',
          taxOrgunitName: '',
          taxMonth: '',
          taxableIncome: '',
          personalIncomeTax: ''
        }
      }
    },
    created () {
      this.form = this.showData
    }
  }
</script>
<style lang="scss">
  .laborhour-tranfer-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
  .title{
      line-height:30px;
      font-weight:bold;
  }
</style>