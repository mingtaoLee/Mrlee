<template>
  <div>
    <div class="clearFix mt-20">
      <el-button
        class="fr"
        type="text"
        @click="backToPlanDetail">
        <i class="icon iconfont icon-return font-size__30"></i>
      </el-button>
    </div>
    <resume-panel :pageSource="recruitPageSource"></resume-panel>
  </div>
</template>
<script>
  import ResumePanel from 'views/admin/pages/recruit/components/resume-panel'
  export default {
    components: {
      ResumePanel
    },
    data () {
      return {
        // 简历列表类型
        recruitPageSource: this.$route.query.source
      }
    },
    created () {
      let searchParam = {
        name: '',
        education: '',
        mobile: '',
        positionId: '',
        resumeStatus: [],
        // 简历来源
        resumeSource: this.$route.query.resumeSource || '',
        // 需求id
        requirementId: this.$route.query.requirementId || '',

        inBeginDate: null,
        inEndDate: null,
        minAge: '',
        maxAge: '',
        labels: []
      }
      this.$store.commit('MODIFY_RESUMEFORM', searchParam)
    },
    methods: {
      // 返回上一级
      backToPlanDetail () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
.font-size__30 {
  font-size: 30px;
}
</style>
