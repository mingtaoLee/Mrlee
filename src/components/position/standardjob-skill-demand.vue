<template>
  <div :class="{'content-follow': showTitle}">
    <h2 class="info-title" v-if="showTitle">知识和技能要求</h2>
    <div class="info-content">
      <el-form :model="model"  :rules="rules" label-width="150px" label-position="right" @submit.native.prevent>
        <el-form-item label="学历要求" prop="academicRequirements" v-if="showMap.academicRequirements">
          <el-col :span="8">
            <i-select :filterable="true" v-model.trim="model.academicRequirements" parameter="EDUCATIONAL_BACKGROUND" placeholder="" :disabled="disabledMap.academicRequirements"></i-select>
          </el-col>
        </el-form-item>
        <el-form-item label="专业要求" prop="expertiseRequirements" v-if="showMap.expertiseRequirements">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.expertiseRequirements" :disabled="disabledMap.expertiseRequirements"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="技能要求" prop="skillRequirement" v-if="showMap.skillRequirement">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.skillRequirement" :disabled="disabledMap.skillRequirement"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="资格证书要求" prop="qualificationRequirement" v-if="showMap.qualificationRequirement">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.qualificationRequirement" :disabled="disabledMap.qualificationRequirement"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="其他要求" prop="otherRequirement" v-if="showMap.otherRequirement">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.otherRequirement" :disabled="disabledMap.otherRequirement"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ISelect from 'components/common/i-select/i-select'

export default {
  name: 'StandardSkillDemand',
  props: {
    model: {
      type: Object
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  components: {
    ISelect
  },
  data () {
    return {
      superOcGroup: '',
      superOcKind: '',
      warning: false,
      rules: {
        academicRequirements: [
          // { required: true, message: '请输入学历要求', trigger: 'change' },
          { max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }
        ],
        expertiseRequirements: [{ max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }],
        skillRequirement: [{ max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }],
        qualificationRequirement: [{ max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }],
        otherRequirement: [{ max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }]
      }
    }
  },
  created () {

  }
}
</script>

<style lang="scss" scoped>

</style>
