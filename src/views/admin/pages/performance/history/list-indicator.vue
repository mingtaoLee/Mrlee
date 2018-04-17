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

    <el-tabs type="border-card">

      <el-tab-pane label="我收集的指标数据">
        <indicator req-url="getSelfCollections"></indicator>
      </el-tab-pane>

      <el-tab-pane label="我审批的指标数据">
        <indicator req-url="getSelfChecks"></indicator>
      </el-tab-pane>

    </el-tabs>

  </div>

</template>

<script>
import Indicator from './table-indicator'

export default {
  components: {
    Indicator
  },

  methods: {
    backToPlanDetail () {
      this.$router.push('/self_performance')
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


