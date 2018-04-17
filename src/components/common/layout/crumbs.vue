<template>
  <div class="crumbs-wrapper">
    <div class="controller-right" @click="showSidebar" :class="{'hide': !isShow}">
      <span class="el-icon-arrow-right"></span>
    </div>
    <el-breadcrumb class="crumb">
      <el-breadcrumb-item v-for="item in items" :to="item.path ? item.path : item.redirect ? item.redirect : '/'" :key="item.name">
        {{item.name}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
  export default {
    name: 'Crumbs',
    data () {
      return {
        items: []
      }
    },
    props: {
      isShow: {
        type: Boolean,
        require: true
      }
    },
    computed: {
      parentRoute () {
        return this.$store.state.base.parentRoute
      }
    },
    mounted () {
      this.getCrumbItems()
    },
    methods: {
      showSidebar () {
        this.$emit('showSidebar')
      },
      getCrumbItems () {
        let items = this.$route.matched.filter((item) => item.name)

        // 处理隐藏菜单的路由
        let parentRoute = this.parentRoute ? this.parentRoute : JSON.parse(sessionStorage.getItem('PARENT_ROUTE'))
        if (this.$route.meta.subPage && parentRoute) {
          items.splice(items.length - 1, 0, parentRoute)
        }
        this.items = items
      }
    },
    watch: {
      $route () {
        this.getCrumbItems()
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

  .crumbs-wrapper {
    height: 40px;
    padding: 14px 0;
    box-sizing: border-box;
    position: relative;
      .controller-right {
        @extend %controller;
        left: -15px;
        transition: left 0.3s ease;
        &.hide {
          display: none;
        }
      }
  }

  .crumb {
    float: left;
    height: 12px;
    font-family: Microsoft YaHei;
    line-height: 12px;
    font-size: 12px;
    letter-spacing: 0;
  }
</style>

<style lang="scss">
.crumb{
  .el-breadcrumb__inner, .el-breadcrumb__inner a{
    color: #8D8D8D;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a{
    color: #333333;
    cursor: default;
  }
  .el-breadcrumb__inner:hover, .el-breadcrumb__inner a:hover,
  // .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover,
  // .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover
  {
    color: #3DA5FE;
  }
  .el-breadcrumb__separator{
    margin: 0 10px;
  }
}
</style>

