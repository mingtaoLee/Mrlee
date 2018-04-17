<template>
  <section class="content-follow">
    <h2 class="info-title">岗位详情</h2>
    <el-form
      :model="detailInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="岗位职责"
            prop="positionStatement"
            class="employItem">
           <el-input
            type="textarea"
            :rows="3"
            v-model.trim="detailInfo.positionStatement"
            :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="目标行业"
            prop="targetProfession"
            class="employItem">
             <el-input v-model.trim="detailInfo.targetProfession" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="目标企业"
            prop="targetEnterprise"
            class="employItem">
             <el-input v-model.trim="detailInfo.targetEnterprise" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="目标职位"
            prop="targetPosition"
            class="employItem">
            <el-input v-model.trim="detailInfo.targetPosition" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
export default {
  name: 'DemandDetail',
  props: {
    // 详情数据
    detailInfo: Object,
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
