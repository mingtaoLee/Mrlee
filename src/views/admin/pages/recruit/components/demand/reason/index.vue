<template>
  <section class="content-follow">
    <h2 class="info-title">招聘原因</h2>

    <el-form
      :model="reasonInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
       <el-col :span="12">
          <el-form-item
            label="正常增补/储备增补"
            prop="reasonType"
            class="employItem">
            <el-radio-group v-model="reasonInfo.reasonType" :disabled="editable">
              <el-radio v-for="rad in reasonTypeList" :key="rad" :label="rad.value">{{rad.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
       <el-col :span="12">
          <el-form-item
            label="原因"
            prop="reason"
            class="employItem">
            <el-input
              type="textarea"
              :rows="3"
              v-model="reasonInfo.reason"
              :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
import { getDict } from 'utils/index'
export default {
  name: 'DemandReason',
  props: {
    // 原因数据
    reasonInfo: Object,
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 规则
      rules: {},
      // 增补选项
      reasonTypeList: []
    }
  },
  created () {
    this.getReasonTypeList()
  },
  methods: {
    // 获取增补选项
    getReasonTypeList () {
      getDict('REQUIREMENT_REASON_TYPE').then(rs => {
        this.reasonTypeList = rs
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .form-main {
//   width: 1600px
// }
</style>
<style lang="scss" scoped>
.employItem {
  margin-bottom: 20px !important;
}
</style>
