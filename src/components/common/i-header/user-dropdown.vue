<template>
  <div class="user-dropdown">
    <header>
      <div class="avatar">
        <img :src="photoPath" v-if="photoPath">
        <i class="iconfont icon-user-c" v-else></i>
      </div>
      <div class="information">
        <p class="title">{{username}}</p>
        <p class="desc">{{orgUnitName}}</p>
      </div>
    </header>
    <section>
      <!-- /flow.html -->
      <div class="i-cell-wrapper">
        <i-cell v-if="showAdminLink" content="业务首页" to="/">
        </i-cell>
        <!-- <i-cell v-if="showWaiting" content="流程中心" to="/flow.html">
        </i-cell> -->
        <i-cell content="员工自助" to="/self.html">
        </i-cell>
        <i-cell v-if="!showWaiting" content="待办消息" :waiting-for-handle-info-number="waitingForHandleInfoNumber" warn to="/watingForHandleInfo"></i-cell>
        <i-cell content="修改密码" :to="EDIT_PASSWORD_LINK" new-tab>
        </i-cell>
        <i-cell content="退出" @handleClick="logout" fixedWarnColor>
        </i-cell>
      </div>
    </section>
  </div>
</template>
<script>
  import iCell from './i-cell'
  import { BASE_URL } from 'config/api'
  export default {
    name: 'userDropdown',
    components: {
      iCell
    },
    props: {
      // 记录代办消息条数
      waitingForHandleInfoNumber: {
        // type: Number,
        default: 0
      }
    },
    computed: {
      username () {
        return this.$store.state.user.info.fullName
      },
      orgUnitName () {
        return this.$store.state.user.info.orgUnitName
      },
      photoPath () {
        const path = this.$store.state.user.info.photoPath
        return path ? `${BASE_URL}/system/attachments/image/${path}` : null
      },
      empSelfAuth () {
        return this.$store.state.user.info.empSelfAuth
      },
      showAdminLink () {
        return /watingForHandleInfo/.test(window.location.href) && !this.empSelfAuth
      },
      showWaiting () {
        return /watingForHandleInfo/.test(window.location.href)
      },
      EDIT_PASSWORD_LINK () {
        return this.$store.state.user.EDIT_PASSWORD_LINK
      }
    },
    mounted () {
      this.$store.dispatch('GET_EDITPASSWORDLINK')
    },
    methods: {
      logout () {
        this.$store.dispatch('logout').then(() => {
          // this.$router.push({ path: '/login' })
          window.location.href = '/#/login'
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .user-dropdown{
    width:100%;
    header{
      display:flex;
      padding:10px;
      align-items:center;
      .avatar{
        width:36px;
        height:36px;
        overflow: hidden;
        border-radius:50%;
        background:#eee;
        box-shadow: 0 1px 6px 0 rgba(0,0,0,0.3);
        img{
          width: 100%;
          height: 100%;
        }
      }
      .information{
        padding-left:20px;
        flex:1;
        .title{
          font-size:14px;
        }
        .desc{
          font-size:12px;
          color: #999;
        }
      }
    }
    section{
      border-top:1px solid #ddd;
    }
    .btn-wrapper{
      background:#eee;
      display:flex;
      justify-content: center;
      border-top:1px solid #ddd;
      padding:10px;
      .btn{
        width:96%;
        font-weight:bold;
      }
    }
  }
</style>
