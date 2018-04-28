<template>
  <div id="home">
    <header id="header" class="header">
      <el-menu 
        :default-active="activeIndex" 
        class="el-menu-demo" 
        mode="horizontal" 
        active-text-color="black"
        @select="handleSelect">
        <el-menu-item v-for="(item,index) in menuList" :index="index + ''">{{item}}</el-menu-item>
      </el-menu>
    </header>
    <section>
      <aside>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <main>
        <router-view/>
      </main>
    </section>
  </div>
</template>

<script>
export default {
  name: 'index',
  data(){
    return {
      menuList:['处理中心','工作台','消息中心','订单管理'],
      activeIndex: '1'
    }
  },
  methods:{
    handleClose(){},
    handleSelect (val) {
      console.log(val)
    },
    handleOpen(){}
  }
}
</script>

<style>
.el-menu-demo{
  background:-webkit-linear-gradient(0deg, #8a92f5, #09fff4)
}
aside .el-menu-vertical-demo{
  height: calc(100vh);
  width:250px;
}
section{
  margin-top: 4px;
  display: flex;
}
main{
  height: auto;
  width: 100%;
  border: 1px solid red
}
</style>
