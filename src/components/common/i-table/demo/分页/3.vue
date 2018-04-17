<template>
  <div>
    <i-table
      :table="table"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange">
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="tableScope.clone"
          v-loading="tableScope.loading"
          :element-loading-text="$loadingText">
          <el-table-column
            v-for="(col, idx) of tableScope.columns"
            :key="idx"
            :prop="col.prop"
            :label="col.label"
          />
        </el-table>
      </template>
    </i-table>

    <!-- demo -->
    <el-form
      class="form"
      @submit.native.prevent>
      <el-input placeholder="姓名" v-model="search" @keyup.native.enter="searchHandler"/>
      <el-button size="small" type="primary" @click.native.prevent="searchHandler">搜索</el-button>
    </el-form>
  </div>
</template>

<script>
import req from 'api/employee/personal'

export default {
  data () {
    return {
      table: {
        title: '4-3 携带搜索条件',
        columns: [
          { prop: 'fullName', label: '姓名' },
          { prop: 'mobile', label: '手机' }
        ],
        data: null,                       // 用于挂载数据
        info: null,                       // 用于存放后端返回的分页信息（无需自行维护 pageIndex 或者 pageSize 了）
        search: null,                     // 用于挂载搜索条件
        total: 0,                         // 用于存放后端返回的数据总量
        showPagebar: true                 // 用于控制分页控件显示与否
      },

      search: ''                          // 搜索条件
    }
  },
  created () {
    this.fetch()                          // 模拟业务场景中的数据请求【函数名、具体行为依据自己业务而定】
  },
  methods: {
    // 将获取数据的函数捆绑在监听页面大小的回调中
    handleSizeChange (options) {
      this.fetch(options)
    },
    // 将获取数据的函数捆绑在监听页数的回调中
    handleCurrentChange (options) {
      this.fetch(options)
    },

    searchHandler () {
      // 若为多个搜索条件，可在遍历后，再解构赋值到 table.search 中
      const search = { fullName: this.search }

      this.table.search = { ...search }
    },

    fetch (options = {}) {
      req('postRoster', options).then(
        res => (this.table = Object.assign(this.table, res))
      )
    }
  }
}
</script>

<style lang="scss" scoped>
// demo
.form {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  .el-input {
    margin-right: 10px;
  }
}
</style>
