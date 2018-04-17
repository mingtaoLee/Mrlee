<template>
  <el-container class="home">
    <el-header height="60px">
      <i-header :autoSize="$route.matched[1].meta.autoSize" :waiting-for-handle-info-number='waitingForHandleInfoNumber'>
        <navbar class="navbar" slot="navbar">
          <!-- <template v-for="(item, index) in $router.options.routes[1].children">
            <nav-item v-if="!item.hidden" font-class="" :to="item.path" :label="item.name"></nav-item>
          </template> -->
          <nav-item
            v-for="(item, index) in menus"
            v-if = "!item.hidden"
            :key = "index"
            :label = "item.name"
            :to = "item.path"
            :data = "item"
          ></nav-item>
        </navbar>
      </i-header>
    </el-header>
    <router-view id="n-progress-control" class="home-content"></router-view>
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
import IHeader from 'components/common/i-header/i-header'
import Navbar from 'components/common/navbar/navbar'
import NavItem from 'components/common/navbar/nav-item'
import ILayout from 'components/common/i-layout'
import req from 'api/common/home'
import LoginForm from 'components/common/login/login-form'
export default {
  name: 'Admin',

  components: {
    IHeader,
    Navbar,
    NavItem,
    ILayout,
    LoginForm
  },

  data () {
    return {
      // 记录代办消息条数
      waitingForHandleInfoNumber: 1
    }
  },

  computed: {
    menusTree () {
      return this.$store.getters.MENUS_TREE
    },
    menus () {
      return this.$store.state.user.accessRoutes
    },
    loginFormVisible () {
      return !this.$store.state.user.hasLogin
    }
  },

  created () {
    req('getCountUserTodo')
    .then(res => {
      this.waitingForHandleInfoNumber = res
    })
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #28283C;
}
.home {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F8F8F8;
  .navbar {
    z-index:999;
  }
}
</style>
