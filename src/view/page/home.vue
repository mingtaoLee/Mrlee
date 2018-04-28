<template>
  <div id="home">
    <h1>home page</h1>
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tabNames" :label="item.label" :name="item.name">
          <!-- <component :is="activeName"></component> -->
          <keep-alive>
            <component :is="activeName"></component>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import addPage from './add'
import deletePage from './delete'
import changePage from './change'
import updatePage from './update'
export default {
  name: 'home',
  data(){
    return {
      activeName: 'addPage',
      tabNames: [
        {label: '新增', name: 'addPage'},
        {label: '删除', name: 'deletePage'},
        {label: '修改', name: 'changePage'},
        {label: '更新', name: 'updatePage'}
      ]
    }
  },
  components:{
    addPage,
    deletePage,
    changePage,
    updatePage
  },
  methods:{
    handleClick(){}
  }
}
</script>

<style>

</style>
