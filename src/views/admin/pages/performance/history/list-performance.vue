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

    <el-tabs v-model="paneName" type="border-card" @tab-click="handleClick">

      <el-tab-pane class="tab_items" label="我的绩效计划" ref="pane">
        <performance
          req-url="getSelfSubmits"
          no-employee="true">
        </performance>
      </el-tab-pane>

      <el-tab-pane class="tab_items" label="我审批的绩效计划">
        <performance req-url="getSelfChecksPlan" v-if="isCheck"></performance>
      </el-tab-pane>

      <el-tab-pane class="tab_items" label="我评估的绩效计划">
        <performance req-url="getSelfEvaluationPlan" v-if="isPlan"></performance>
      </el-tab-pane>

    </el-tabs>
  </div>

</template>

<script>
import Performance from './table-performance'

export default {
  components: {
    Performance
  },
  data () {
    return {
      isCheck: false,
      isPlan: false,
      paneName: ''
    }
  },
  methods: {
    backToPlanDetail () {
      this.$router.push('/self_performance')
    },
    handleClick (tab) {
      console.log(this.paneName)
      if (this.paneName === '1') {
        this.isCheck = true
      } else if (this.paneName === '2') {
        this.isPlan = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.font-size__30 {
  font-size: 30px;
}
</style>
<style>
  .el-tabs__header,.el-tabs__item {
    height: 50px;
    line-height: 50px;
  }
</style>
