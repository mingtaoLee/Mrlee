<template>
  <div class="wrapper">
    <el-container>
      <el-header id="flow-header" height="60px">
        <flow-header :showEm="false">
          <span slot="link"></span>
        </flow-header>
      </el-header>
      <el-main>
        <div class="main content-card">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
    <i-dialog 
      v-model="loginFormVisible" 
      size="small"
      @close="$store.commit('SET_HASLOGIN', true)"
    >
      <login-form :jump-url="false"></login-form>
    </i-dialog>
  </div>

</template>

<script>
  import FlowHeader from 'components/common/i-header/i-header'
  import FlowFooter from 'components/common/i-footer/i-footer'
  import Blank from 'components/common/layout/blank'
  import LoginForm from 'components/common/login/login-form'
export default {
    components: {
      FlowHeader,
      FlowFooter,
      Blank,
      LoginForm
    },
    data () {
      return {

      }
    },
    computed: {
      loginFormVisible () {
        return !this.$store.state.user.hasLogin
      }
    },
    methods: {

    },

    created () {

    }
  }
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.main {
  min-width: 900px;
  overflow-x: auto;
}
</style>
<style lang="scss">
.wrapper{
  .el-main{
    flex: auto;
    -ms-flex: auto;
  }
}
</style>
