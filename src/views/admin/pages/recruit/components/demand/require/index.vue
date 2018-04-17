<template>
  <section class="content-follow">
    <h2 class="info-title">任职要求</h2>
    <el-form
      :model="requireInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="学历" prop="educationBackground" class="employItem" >
             <i-select
              :filterable="true"
              v-model.trim="requireInfo.educationBackground"
              parameter="EDUCATIONAL_BACKGROUND"
              placeholder=""
              :disabled="editable"></i-select>
          </el-form-item>
        </el-col>
       <el-col :span="6">
          <el-form-item label="性别" prop="gender" class="employItem">
            <i-select
              :filterable="true"
              v-model.trim="requireInfo.gender"
              :disabled="editable"
              parameter="GENDER_REQUIRE"
              placeholder=""></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工作经验" prop="experienceType" class="employItem">
           <i-select
              :filterable="true"
              v-model.trim="requireInfo.experienceType"
              :disabled="editable"
              parameter="EXPERIENCE_TYPE"
              placeholder=""></i-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="最小年龄" prop="floorAge" class="employItem" >
           <el-input v-model.trim="requireInfo.floorAge" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item label="最大年龄" prop="ceilAge" class="employItem" >
           <el-input v-model.trim="requireInfo.ceilAge" :disabled="editable"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="特殊技能" prop="specialSkill" class="employItem" >
           <el-input v-model.trim="requireInfo.specialSkill" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item label="专业" prop="major" class="employItem" >
           <el-input v-model.trim="requireInfo.major" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任职资格" prop="workRequirement" class="employItem">
            <el-input 
             type="textarea"
             :rows="3"
             :disabled="editable"
             v-model.trim="requireInfo.workRequirement"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他任职要求" prop="otherRequirement" class="employItem" >
           <el-input
            type="textarea"
            :rows="3"
            :disabled="editable"
            v-model.trim="requireInfo.otherRequirement"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
export default {
  name: 'DemandRequire',
  props: {
    // 要求数据
    requireInfo: Object,
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 校验规则
      rules: {}
    }
  }
}
</script>
<style lang="scss" scoped>
.employItem {
  margin-bottom: 20px !important;
}
</style>
