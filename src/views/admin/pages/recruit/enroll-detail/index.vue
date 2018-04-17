<template>
  <div class="full-screen" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="clearFix">
      <el-button
        class="fr"
        type="text"
        @click="backToPlanDetail">
        <i class="icon iconfont icon-return fs30"></i>
      </el-button>
    </div>
    <!-- 员工录用信息 -->
    <employ-info :employInfo="employForm"></employ-info>
  </div>
</template>
<script>
import EmployInfo from 'views/admin/pages/recruit/components/employ'
import req from 'api/recruit/matriclated'
export default {
  components: {
    EmployInfo
  },
  data () {
    return {
      // 全屏loading
      fullscreenLoading: false,

      employForm: {
        //  ------- 员工录用信息 ----------
        name: '',
        company: '',
        department: '',
        departmentNode: '',
        position: '',
        positionName: '',
        entryDate: '',
        contractTime: '',
        probationTime: '',
        hireType: '',
        empType: '',
        probationPay: '',
        salary: '',
        salaryType: '',
        probationPayType: '',
        otherExplain: ''
      }
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    // 返回
    backToPlanDetail () {
      this.$router.go(-1)
    },
    // 获取详情
    getDetail () {
      let interviewId = this.$route.query.interviewId
      this.fullscreenLoading = true
      req('enrollDetail', {interviewId}).then((res) => {
        console.log(res)
        this.employForm = Object.assign({}, this.employForm, res)
        this.fullscreenLoading = false
      }).catch(err => {
        console.log(err)
        this.fullscreenLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.fs30 {
  font-size: 30px;
}
.full-screen {
  padding-top: 5px;
  position: static;
}
</style>
