<template>
  <el-container>

    <!-- <el-header>
      <self-header></self-header>
      <crumbs @showSidebar="toggleSidebar" :isShow="isHidden"></crumbs>
    </el-header> -->

    <el-main class="two-main">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="招聘数据统计" :name="1"></el-tab-pane>
        <el-tab-pane label="招聘需求" :name="2"></el-tab-pane>
        <el-tab-pane label="我是面试官" :name="3"></el-tab-pane>
      </el-tabs>

      <!-- 页面主要内容由activeTab字段控制 1:招聘数据统计，2：招聘需求， 3：我是面试官-->
      <recruit-statistics v-if="activeTab === 1"></recruit-statistics>
      <recruit-requirement v-else-if="activeTab === 2"></recruit-requirement>
      <interviewer v-else></interviewer>

    </el-main>
 </el-container>
</template>

<script>

import SelfHeader from 'components/common/i-header/i-header'
import Crumbs from 'components/common/layout/crumbs'
import interviewer from './interviewer'
import recruitRequirement from './recruit-requirement'
import recruitStatistics from './recruit-statistics'

export default {
  name: 'self-recruit',

  components: {
    SelfHeader,
    Crumbs,
    interviewer,
    recruitRequirement,
    recruitStatistics
  },

  props: {},

  data () {
    return {
      isHidden: false,
      activeTab: 1
    }
  },

  computed: {

  },

  created () {

  },

  methods: {

    toggleSidebar () {
      this.isHidden = !this.isHidden
    }

  }
}
</script>
<style lang="scss" scoped>


</style>
<style lang="scss">
.el-main {
  background: #f8f8f8;
}
.two-main {
  background: #fff;
}
</style>
