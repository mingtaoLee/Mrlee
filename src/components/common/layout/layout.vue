<template>
  <el-container>
    <el-aside :width="asideWidth">
      <div :class="['sidebar-container', 'theme-light-background']">
        <div class="controlbar theme-light-background">
          <div class="controller-left" @click="toggleSidebar" v-show="!isHidden">
            <span class="el-icon-arrow-left"></span>
          </div>
        </div>
        <sidebar :menus="menus" class="sidebar"></sidebar>
      </div>
    </el-aside>
    <el-main>
      <div class="wrapper">
        <div class="main">
          <crumbs @showSidebar="toggleSidebar" :isShow="isHidden"></crumbs>
          <div style="paddingBottom:15px;">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import Sidebar from './sidebar'
  import Crumbs from './crumbs'
  // import IFooter from 'components/common/i-footer/i-footer'
  export default {
    name: 'Layout',
    components: {
      Sidebar,
      Crumbs
      // IFooter
    },
    data () {
      return {
        isHidden: false
      }
    },
    computed: {
      accessRoutes () {
        return this.$store.state.user.accessRoutes
      },
      asideWidth () {
        return this.isHidden ? '0px' : '200px'
      }
    },
    watch: {
      $route () {
        this.getRoutesMap()
      },
      accessRoutes () {
        this.getRoutesMap()
      }
    },
    created () {
      this.getRoutesMap()
    },
    methods: {
      toggleSidebar () {
        this.isHidden = !this.isHidden
      },
      getRouteChildren (key, map = []) {
        if (Array.isArray(map) && map.length) {
          for (let route of map) {
            if (route.name === key) {
              return route.children
            }
          }
        }
        return []
      },
      getRoutesMap () {
        const type = this.$route.matched[1].name
        this.menus = this.getRouteChildren(type, this.accessRoutes)
      }
    }
  }
</script>
<style lang="scss" scoped>
  %controller {
    display: inline-block;
    position: absolute;
    top: 5px;
    width: 15px;
    height: 30px;
    line-height: 30px;
    background-color: #44445b;
    color: #A8A8C3;
    cursor: pointer;
  }
  .el-aside {
    transition: width 0.3s ease;
  }
  .el-main {
    padding: 0;
  }
  .sidebar-container {
    height: 100%;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 1;
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
    height:100%;
  }
  .main {
    min-width: 900px;
    min-height: calc(100vh - 236px);
    padding:0 15px;
    overflow-x: auto;
  }
  // .sidebar-toggle-enter-active{
  //   transition: all .3s ease;
  // }
  // .sidebar-toggle-leave-active{
  //   transition: all .3s ease;
  // }
  // .sidebar-toggle-enter, .sidebar-toggle-leave-to{
  //   transform: translateX(-200px);
  //   opacity: 0;
  // }
</style>
