<template>
  <div class="sidebar-wrapper theme-light-background">
    <el-menu
    ref="menu"
    :default-active="activeRoute"
    class="el-menu theme-light-background"
    unique-opened>
      <li v-for="(menu, index) in menus" v-if="!menu.hide" :key="menu.name">
        <submenu v-if="menu.children" :menu="menu"></submenu>
        <el-menu-item v-else :index="menu.path">
          <router-link :to="menu.path">{{menu.name}}</router-link>
        </el-menu-item>
      </li>
    </el-menu>
  </div>
</template>
<script>
  import Submenu from './submenu.vue'
  export default {
    name: 'Sidebar',
    components: {
      Submenu
    },
    props: {
      menus: Array
    },
    data () {
      return {
        activeRoute: this.$route.path
      }
    },
    watch: {
      $route (val) {
        // 等待子菜单都挂载完再更新menu的activeIndex
        this.$nextTick(() => {
          this.activeRoute = val.path
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .sidebar-wrapper {
    height: calc(100% - 51px);
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
    .el-menu{
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
