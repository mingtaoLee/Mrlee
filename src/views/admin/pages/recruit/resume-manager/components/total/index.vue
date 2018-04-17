<template>
  <div>
    <resume-panel :pageSource="recruitPageSource"></resume-panel>
  </div>
</template>
<script>
import ResumePanel from 'views/admin/pages/recruit/components/resume-panel'
import { ResumePageSource } from 'views/admin/pages/recruit/config'
export default {
  components: {
    ResumePanel
  },
  data () {
    return {
      // 简历列表类型
      recruitPageSource: ResumePageSource.TOTAL
    }
  }
}
</script>
