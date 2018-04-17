<template>
  <section class="content-follow">
    <h2 class="info-title">岗位详情</h2>
    <el-form
      :model="detailInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="教育程度" prop="educationBackground" class="employItem" >
             <i-select
              :filterable="true"
              v-model.trim="detailInfo.educationBackground"
              parameter="EDUCATIONAL_BACKGROUND"
              placeholder=""
              :disabled="editable"></i-select>
          </el-form-item>
        </el-col>
       <el-col :span="6">
          <el-form-item label="性别" prop="gender" class="employItem">
            <i-select
              :filterable="true"
              v-model.trim="detailInfo.gender"
              :disabled="editable"
              parameter="GENDER_REQUIRE"
              placeholder=""></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工作经验" prop="experienceType" class="employItem">
           <i-select
              :filterable="true"
              v-model.trim="detailInfo.experienceType"
              parameter="EXPERIENCE_TYPE"
              placeholder=""></i-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="最小年龄" prop="floorAge" class="employItem" >
           <el-input v-model.trim="detailInfo.floorAge" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item label="最大年龄" prop="ceilAge" class="employItem" >
           <el-input v-model.trim="detailInfo.ceilAge" :disabled="editable"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="任职资格" prop="workRequirement" class="employItem">
            <el-input 
             type="textarea"
             :rows="3"
             v-model.trim="detailInfo.workRequirement"
             :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="特殊技能" prop="specialSkill" class="employItem" >
           <el-input v-model.trim="detailInfo.specialSkill" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item label="专业" prop="major" class="employItem" >
           <el-input v-model.trim="detailInfo.major" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="其他任职要求" prop="otherRequirement" class="employItem" >
           <el-input
            type="textarea"
            :rows="3"
            :disabled="editable"
            v-model.trim="detailInfo.otherRequirement"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="岗位职责"
            prop="positionStatement">
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
            prop="targetProfession">
             <el-input v-model.trim="detailInfo.targetProfession" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="目标企业"
            prop="targetEnterprise">
             <el-input v-model.trim="detailInfo.targetEnterprise" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="isFlow">
          <el-form-item
            label="目标职位"
            prop="targetPosition">
             <el-input
              v-model.trim="detailInfo.targetPositionName"
              :disabled="editable"
              @focus="showJobHandler"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-else>
          <el-form-item
            label="目标职位"
            prop="targetPosition">
            <el-input v-model.trim="detailInfo.targetPosition" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
export default {
  name: 'DemandNewDetail',
  props: {
    // 详情数据
    detailInfo: Object,
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 是否是流程
    isFlow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 校验规则
      rules: {
        educationBackground: [{ required: true, message: '教育程度', trigger: 'change' }],
        gender: [{ required: true, message: '性别', trigger: 'change' }],
        floorWorkYear: [{ required: true, validator: (rule, value, callback) => this.checkNum(rule, value, callback, '工作经验'), trigger: 'blur' }],
        // floorAge: [{ required: true, validator: this.checkMinAge, trigger: 'blur' }],
        // ceilAge: [{ required: true, validator: this.checkMaxAge, trigger: 'blur' }],
        workRequirement: [{required: true, message: '请输入任职资格', trigger: 'change'}],
        positionStatement: [{ required: true, message: '请输入岗位职责', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    // console.log(this.employInfo)
    if (!this.isFlow) {
      this.rules = {}
    }
  },
  methods: {
    // 显示职位弹窗
    showJobHandler () {
      this.$emit('showJob', 'detail')
    },
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
