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
            v-if="showMap['positionStatement']"
            prop="positionStatement">
           <el-input
            type="textarea"
            :rows="3"
            v-model.trim="detailInfo.positionStatement"
            :disabled="disabledMap['positionStatement']"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="目标行业"
            v-if="showMap['targetProfession']"
            prop="targetProfession">
             <el-input v-model.trim="detailInfo.targetProfession" :disabled="disabledMap['targetProfession']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="目标企业"
            prop="targetEnterprise"
            v-if="showMap['targetEnterprise']">
             <el-input v-model.trim="detailInfo.targetEnterprise" :disabled="disabledMap['targetEnterprise']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="目标职位"
            prop="targetPosition"
            v-if="showMap['targetPosition']">
             <el-input
              v-model.trim="detailInfo.targetPositionName"
              :disabled="disabledMap['targetPosition']"
              @focus="showJobHandler"></el-input>
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
    detailInfo: Object
  },
  data () {
    return {
      // 校验规则
      rules: {
        positionStatement: [{ required: true, message: '请输入岗位职责', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 显示职位弹窗
    showJobHandler () {
      this.$emit('showJob', 'detail')
    }
  }
}
</script>
