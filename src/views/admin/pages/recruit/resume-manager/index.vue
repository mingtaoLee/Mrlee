 <template>
   <div>
    <el-tabs v-model="select" @tab-click="onTabClick">
        <el-tab-pane label="全部简历" name="TOTAL" class="flow-tab">
            <total-resume v-if="select === 'TOTAL'"></total-resume>
        </el-tab-pane>
        <el-tab-pane label="我收藏的简历" name="COLLECTION" class="flow-tab">
            <collection-resume v-if="select === 'COLLECTION'"></collection-resume>
        </el-tab-pane>
        <el-tab-pane label="推荐给我的简历" name="RECOMMEND" class="flow-image flow-tab">
            <recommend-resume v-if="select === 'RECOMMEND'"></recommend-resume>
        </el-tab-pane>
     </el-tabs>
    <!-- <resume-panel :pageSource="recruitPageSource"></resume-panel> -->
   </div>
 </template>
<script>
import TotalResume from './components/total'
import CollectionResume from './components/collection'
import RecommendResume from './components/recommend'
import ResumePanel from 'views/admin/pages/recruit/components/resume-panel'
import { ResumePageSource } from 'views/admin/pages/recruit/config'
export default {
  components: {
    TotalResume,
    CollectionResume,
    RecommendResume,
    ResumePanel
  },
  data () {
    return {
      // 简历列表类型
      recruitPageSource: ResumePageSource.TOTAL,
      // tab选择的值
      select: 'TOTAL'
    }
  },
  methods: {
    // 选择tab
    onTabClick (tab, event) {
      this.recruitPageSource = ResumePageSource[this.select]
    }
  }
}
</script>
