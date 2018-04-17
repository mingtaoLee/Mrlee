<template>
  <div class="content-follow">
      <h2 class="info-title">申请信息</h2>
      <div class="info-content">
        <el-form :model="applicant" label-width="150px">
          <el-col :span="6">
            <el-form-item label="申请人：">
              <span class="bold">{{applicant.applicantName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在部门：">
              <span class="bold">{{applicant.departmentName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请日期：">
              <span class="bold">{{applicant.applicationDate}}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
  </div>
</template>

<script>
/**
 * 流程申请人信息组件
 * @event basicInfo 请求完申请人信息后将数据返回
 */
import req from 'api/position/occupation'
import moment from 'moment'
export default {
  name: 'BasicInfo',
  data () {
    return {
      applicant: {
        applicantName: '',
        departmentName: '',
        applicationDate: ''
      }
    }
  },

  methods: {
    getApplicantInfo () {
      const loginId = sessionStorage.getItem('loginId')
      req('getApplcantInfo', {loginId})
      .then(data => {
        this.applicant = data
        this.applicant.applicationDate = moment(this.applicant.applicationDate).format('YYYY-MM-DD')
        this.$emit('basicInfo', data)
      })
      .catch(() => {
        this.$emit('basicInfo', {})
      })
    }
  },

  created () {
    this.getApplicantInfo()
  }
}
</script>

<style lang="scss" scoped>

</style>
