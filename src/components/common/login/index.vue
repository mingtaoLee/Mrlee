<template>
  <div class="wrap">
    <div class="main flex-center">
      <div class="login-container flex">

        <section class="left-imgbox">
        <div class="logo">
          <img src="../../../assets/images/logo-r.png" alt="logo">
        </div>
        <div class="image">
        </div>
        </section>

        <login-form class="right-inputbox">
        </login-form>
      </div>
    </div>
    <div class="footer">
      <i-footer></i-footer>
    </div>
  </div>
</template>
<script>
  import IFooter from 'components/common/i-footer/i-footer'
  import LoginForm from './login-form/index'

  export default {
    name: 'Login',
    components: {
      IFooter,
      LoginForm
    },
    mounted () {
      this.logout()
    },
    methods: {
      logout () {
        return this.$store.dispatch('logout')
      }
    }
  }
</script>
<style lang="scss" scoped>

  $icon-size: 20px;
  .wrap{
    height:100vh;
    background: url(../../../assets/images/login-bg.png) center no-repeat;
    background-size: cover;
    .main{
      height:calc(100% - 80px);
    }
  }
  .footer{
    display: fixed;
    bottom: 0;
  }
  .login-container {
    width: 640px;
    height: 315px;
    padding: 20px 30px;
    background-color: #fff;
  }

  .left-imgbox {
    width: 303px;
    margin-right: 37px;
    img {
      width: 100px;
      height: 100%;
      background-size: cover;
    }
    .image{
      margin-top:20px;
      height:213px;
      background: url(../../../assets/images/login-mini.png) center no-repeat;
    }
  }

  .right-inputbox {
    margin-top:30px;
    text-align:center;
  }
</style>
