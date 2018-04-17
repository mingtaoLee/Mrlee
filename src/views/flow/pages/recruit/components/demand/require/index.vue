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
          <el-form-item label="学历" v-if="showMap['educationBackground']" prop="educationBackground">
             <i-select
              :filterable="true"
              v-model.trim="requireInfo.educationBackground"
              parameter="EDUCATIONAL_BACKGROUND"
              placeholder=""
              :disabled="disabledMap['educationBackground']"></i-select>
          </el-form-item>
        </el-col>
       <el-col :span="6">
          <el-form-item label="性别" prop="gender" v-if="showMap['gender']">
            <i-select
              :filterable="true"
              v-model.trim="requireInfo.gender"
              :disabled="disabledMap['gender']"
              parameter="GENDER_REQUIRE"
              placeholder=""></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工作经验" prop="experienceType">
           <i-select
              :filterable="true"
              v-model.trim="requireInfo.experienceType"
              :disabled="disabledMap['experienceType']"
              parameter="EXPERIENCE_TYPE"
              placeholder=""></i-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="最小年龄" prop="floorAge" v-if="showMap['floorAge']">
           <el-input v-model.trim="requireInfo.floorAge" :disabled="disabledMap['floorAge']"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item label="最大年龄" prop="ceilAge" v-if="showMap['ceilAge']">
           <el-input v-model.trim="requireInfo.ceilAge" :disabled="disabledMap['ceilAge']"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="特殊技能" prop="specialSkill" v-if="showMap['specialSkill']">
           <el-input v-model.trim="requireInfo.specialSkill" :disabled="disabledMap['specialSkill']"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item label="专业" prop="major" v-if="showMap['major']">
           <el-input v-model.trim="requireInfo.major" :disabled="disabledMap['major']"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="任职资格" prop="workRequirement" v-if="showMap['workRequirement']">
          <el-input
          type="textarea"
          :rows="3"
          v-model.trim="requireInfo.workRequirement"
          :disabled="disabledMap['workRequirement']">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他任职要求" prop="otherRequirement" v-if="showMap['otherRequirement']">
           <el-input
            type="textarea"
            :rows="3"
            :disabled="disabledMap['otherRequirement']"
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
    requireInfo: Object
  },
  data () {
    return {
      // 校验规则
      rules: {
        educationBackground: [{ required: true, message: '教育程度', trigger: 'change' }],
        gender: [{ required: true, message: '性别', trigger: 'change' }],
        // floorWorkYear: [{ required: true, validator: (rule, value, callback) => this.checkNum(rule, value, callback, '工作经验'), trigger: 'blur' }],
        // floorAge: [{ required: true, validator: this.checkMinAge, trigger: 'blur' }],
        // ceilAge: [{ required: true, validator: this.checkMaxAge, trigger: 'blur' }]
        workRequirement: [{required: true, message: '请填写任职资格', trigger: 'change'}]
      }
    }
  },
  methods: {
    // 验证正整数
    checkNum (rule, value, callback, name) {
      if (value) {
        let regu = /^[1-9]\d*$/
        if (regu.test(value)) {
          callback()
        } else {
          callback(new Error(name + '为正整数'))
        }
      } else {
        callback(new Error('请输入' + name))
      }
    }
    // // 验证最小年龄
    // checkMinAge (rule, value, callback) {
    //   if (value) {
    //     let regu = /^[1-9]\d*$/
    //     if (regu.test(value)) {
    //       let ceilAge = parseInt(this.requireInfo.ceilAge)
    //       if (parseInt(value) > ceilAge) {
    //         callback(new Error('最小年龄不能大于最大年龄'))
    //       } else {
    //         callback()
    //       }
    //     } else {
    //       callback(new Error('最小年龄为正整数'))
    //     }
    //   } else {
    //     callback(new Error('请输入最小年龄'))
    //   }
    // },
    // // 验证最大年龄
    // checkMaxAge (rule, value, callback) {
    //   if (value) {
    //     let regu = /^[1-9]\d*$/
    //     if (regu.test(value)) {
    //       let floorAge = parseInt(this.requireInfo.floorAge)
    //       if (parseInt(value) < floorAge) {
    //         callback(new Error('最大年龄不能小于最小年龄'))
    //       } else {
    //         callback()
    //       }
    //     } else {
    //       callback(new Error('最大年龄为正整数'))
    //     }
    //   } else {
    //     callback(new Error('请输入最大年龄'))
    //   }
    // }
  }
}
</script>
