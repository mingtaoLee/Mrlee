<template>
  <div>
    <div :class="['sidebar-container', 'theme-light-background', {'hide':isHidden}]">
      <div class="controlbar theme-light-background">
        <div class="controller-left" @click="toggleSidebar" v-show="!isHidden">
          <span class="el-icon-arrow-left"></span>
        </div>
      </div>
      <sidebar class="sidebar"></sidebar>
    </div>
    <div class="wrapper" :class="{'slide-left': isHidden}">
      <div class="main">
        <crumbs @showSidebar="toggleSidebar" :isShow="isHidden"></crumbs>
        <div style="paddingBottom:15px;">
          <router-view></router-view>
        </div>
      </div>
      <!-- <div class="footer">
        <i-footer></i-footer>
      </div> -->
    </div>
  </div>
</template>
<script>
  import Sidebar from './sidebar'
  import Crumbs from './crumbs'
  // import IFooter from 'components/common/i-footer/i-footer'
  export default {
    name: 'Layout',
    data () {
      return {
        isHidden: false
      }
    },
    components: {
      Sidebar,
      Crumbs
      // IFooter
    },
    methods: {
      toggleSidebar () {
        this.isHidden = !this.isHidden
      }
    },
    mounted () {
    }
  }
</script>
<style lang="scss" scoped>
  %controller {
    display: inline-block;
    position: absolute;
    top: 9px;
    width: 15px;
    height: 30px;
    line-height: 30px;
    background-color: #44445b;
    color: #A8A8C3;
    cursor: pointer;
  }

  .sidebar-container {
    width: 200px;
    height: 100%;
    position: fixed;
    padding-top: 60px;
    top: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 1;
    transition: width 0.5s ease;
    &.hide {
      width: 0;
    }
    .controlbar {
      position: relative;
      width: 100%;
      height: 50px;
      .controller-left {
        @extend %controller;
        right: 0;
      }
    }
  }
  .wrapper{
    padding-left:200px;
    height:100%;
    overflow: hidden;
    transition: padding-left 0.5s ease;
    &.slide-left{
      padding-left:0;
    }
  }
  .main {
    //margin-right: 20px;
    min-width: 900px;
    min-height: calc(100vh - 236px);
    padding:0 15px;
    overflow-x: auto;
  }
  .footer{
  }
</style>
