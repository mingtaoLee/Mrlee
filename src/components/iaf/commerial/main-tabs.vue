<template>
  <div class="content-card">
    
    <el-tabs v-model="startTabPage" @tab-click="handleClick">
      <!-- 参保查询 -->
      <el-tab-pane name="all" label="参保查询">
        <search-header-search ref="search"></search-header-search>
      </el-tab-pane>
      <!-- 增员申请列表 -->
      <el-tab-pane name="addList" label="增员申请列表">
        <add-header-search ref="add" v-if="addList"></add-header-search>

      </el-tab-pane>
      <!-- 减员申请列表 -->
      <el-tab-pane name="reduceList" label="减员申请列表">
        <delete-header-search ref="delete" v-if="reduceList"></delete-header-search>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SearchHeaderSearch from './search-header-search'
import AddHeaderSearch from './add-header-search'
import DeleteHeaderSearch from './delete-header-search'
// import req from 'api/iaf/insured-insurance'
export default {
  data () {
    return {
      startTabPage: 'all', // tab页开始的页面
      addList: false,
      reduceList: false
    }
  },
  created () {

  },
  methods: {
    handleClick (tab) {
      tab.name === 'addList' && (this.addList = true)
      tab.name === 'reduceList' && (this.reduceList = true)
      this.$nextTick(() => {
        tab.$children[0].setTabsSearchForm()
      })
    }
  },
  components: {
    SearchHeaderSearch,
    AddHeaderSearch,
    DeleteHeaderSearch
  }
}
</script>
<style lang="scss" scoped>
.content-card{
  padding:15px;
}
</style>
