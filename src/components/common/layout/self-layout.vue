<template>
  <el-container class="wrapper">
    <el-header height="50px">
      <self-header></self-header>
    </el-header>
    <el-container>
      <el-aside class="self-aside" :width="asideWidth">
        <sidebar :menus="accessRoutes"></sidebar>
        <div class="controller">
          <div class="btn-control" @click="toggleSidebarWidth">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-main>
          <crumbs v-if="$route.path !== '/home'"></crumbs>
          <router-view></router-view>
        </el-main>
        <el-footer height="40px" style="line-height:40px">
          Copyright © 深圳美云智数科技有限公司 版权所有
        </el-footer>
      </el-container>
    </el-container>
    <i-dialog 
      v-model="loginFormVisible" 
      size="small"
      @close="$store.commit('SET_HASLOGIN', true)"
    >
      <login-form :jump-url="false"></login-form>
    </i-dialog>
  </el-container>
</template>

<script>
/**
 * 员工自助的整体布局
 */
// import req from 'api/self/user'
import SelfHeader from 'components/common/i-header/self-header'
import Sidebar from 'components/common/layout/sidebar'
import Crumbs from 'components/common/layout/crumbs'
import LoginForm from 'components/common/login/login-form'
export default {
  name: 'Admin',
  components: {
    SelfHeader,
    Sidebar,
    Crumbs,
    LoginForm
  },
  data () {
    return {
      menus: [],
      sidebarVisible: true
    }
  },
  computed: {
    asideWidth () {
      return this.sidebarVisible ? '200px' : '50px'
    },
    accessRoutes () {
      return [
        {
          name: '首页',
          path: '/home'
        },
        ...this.$store.state.self.accessRoutes,
        {
          name: '流程中心',
          path: '/flow'
        }
      ]
    },
    loginFormVisible () {
      return !this.$store.state.user.hasLogin
    }
  },
  created () {
  },
  methods: {
    /* 切换侧边栏宽度 */
    toggleSidebarWidth () {
      this.sidebarVisible = !this.sidebarVisible
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper{
  position:absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.self-aside{
  position: relative;
  transition: all 0.3s;
}
.controller{
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: 40px;
  background-color: #28283C;
  .btn-control{
    width: 20px;
    margin-left: 25px;
    cursor: pointer;
    .line{
      height: 4px;
      border-radius: 3px;
      background-color: #a8a8c3;
      &+.line{
        margin-top: 2px;
      }
    }
  }
}
.el-aside {
  background-color: #3a3a53;
}
.el-footer {
  background-color: #efefef;
}
.el-main {
  padding: 0 20px;
}
</style>
