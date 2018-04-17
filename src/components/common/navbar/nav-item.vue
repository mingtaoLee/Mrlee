<template>
  <div :class="['wrap', {active}]" :style="navItemStyle">
    <router-link :to="to" class="router-link-style">
      <!-- <span :class="['iconfont', `icon-${fontClass}`]"></span> -->
      <span class="label">{{label}}</span>
    </router-link>
  </div>
</template>
<script>
export default {
  computed: {
    active () {
      return this.$route.matched && (this.$route.matched[1].path === this.to)
    },
    navItemStyle () {
      return {
        padding: window.innerWidth <= 1366 ? '0 15px' : '0 22px'
      }
    },
    link () {
      return {
        path: this.data.menuAddress
      }
    }
  },
  props: {
    fontClass: String,
    label: String,
    to: String,
    data: Object
  },
  methods: {
    /**
     * 获取跳转的路径
     */
    getLink (data) {
      if (data.children && data.children.length) {
        return this.getLink(data.children[0])
      }
      return data.menuAddress || '/'
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap{
  width:64px;
  height:58px;
  font-family: Microsoft YaHei;
  font-size: 14px;
  line-height: 14px;
  text-align:center;
  color: #A8A8C3;
  display: flex;
  align-items: center;
  .router-link-style{
    width: 100%;
    display: inline-block;
  }
  // .iconfont{
  //   font-size:18px;
  // }
  &.active{
    color: #3DA5FE;
    border-bottom: 2px solid #3DA5FE;
    // background-color: rgb(119, 192, 254);
  }
  &:hover{
    color: #3DA5FE;
  }
}
</style>

