<template>
  <div :class="{'content-follow': showTitle}">
    <h2 class="info-title" v-if="showTitle">经验要求</h2>
    <div class="info-content">
      <el-form :model="model"   :rules="rules" label-width="150px" label-position="right" @submit.native.prevent>
        <el-form-item label="工作经验" prop="experienceRequirement" v-if="showMap.experienceRequirement">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.experienceRequirement" :disabled="disabledMap.experienceRequirement"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="行业要求" prop="industryRequirement" v-if="showMap.industryRequirement">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.industryRequirement" :disabled="disabledMap.industryRequirement"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="企业要求" prop="enterpriseRequirement" v-if="showMap.enterpriseRequirement">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.enterpriseRequirement" :disabled="disabledMap.enterpriseRequirement"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StandardjobExperienceDemand',
    props: {
      model: {
        type: Object
      },
      showTitle: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        superOcGroup: '',
        superOcKind: '',
        warning: false,
        rules: {
          experienceRequirement: [{ max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }],
          industryRequirement: [{ max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }],
          enterpriseRequirement: [{ max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }]
        }
      }
    },
    created () {
    }
  }
</script>

<style lang="scss" scoped>

</style>
