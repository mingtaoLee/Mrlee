<template>
  <el-submenu :index="menu.path" v-if="menu.children">
    <template class="title" slot="title" v-if="!menu.hideIcon">
      <i class="iconfont icon-menu"></i>
      {{menu.name}}
    </template>
    <template v-else slot="title">{{menu.name}}</template>
    <template v-for="(child, index) in menu.children">
      <submenu :key="child.name" v-if="hasValidChildren(child)" :menu="child"></submenu>
      <template v-else>
        <router-link v-if="!child.hide" :to="getMenuPath(child,menu)" :key="child.name">
          <el-menu-item :index="menu.path + '/' + child.path" class="sub-item">{{child.name}}</el-menu-item>
        </router-link>
      </template>
    </template>
  </el-submenu>
</template>

<script>
  export default {
    name: 'Submenu',
    props: {
      menu: Object
    },
    methods: {
      hasValidChildren (menu) {
        if (Array.isArray(menu.children)) {
          return menu.children.some((element) => {
            return !element.hide
          })
        }
        return false
      },
      getMenuPath (menu, parent) {
        if (Array.isArray(menu.children)) {
          return menu.path
        } else {
          return `${parent.path}/${menu.path}`
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .iconfont{
    font-size: 12px;
    line-height: 14px;
    margin-right: 10px;
  }
  .sub-item{
    font-size: 13px;
    &:before{
      content: '';
      display: inline-block;
      width: 13px;
      height: 13px;
    }
    &:hover{
      color: #3DA5FE;
    }
  }
</style>
