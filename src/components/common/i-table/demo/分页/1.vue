<template>
  <!-- 通过使用 i-table 内部的 @pageSizeChange 监听页面大小的变化 -->
  <!-- 通过使用 i-table 内部的 @pageIndexChange 监听页数的变化 -->
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
</template>

<script>
import req from 'api/employee/personal'

export default {
  data () {
    return {
      table: {
        title: '4-1 简单分页',
        columns: [
          { prop: 'fullName', label: '姓名' },
          { prop: 'mobile', label: '手机' }
        ],
        data: null,                       // 用于挂载数据
        info: null,                       // 用于存放后端返回的分页信息（无需自行维护 pageIndex 或者 pageSize 了）
        total: 0,                         // 用于存放后端返回的数据总量
        showPagebar: true                 // 用于控制分页控件显示与否
      }
    }
  },
  created () {
    this.fetch()                          // 模拟业务场景中的数据请求【函数名、具体行为依据自己业务而定】
  },
  methods: {
                                          // 如下 options 为 { pageIndex: *, pageSize: * }，这些数据都是在 i-table 内部维护的，外部直接调用即可
    handleSizeChange (options) {          // 将获取数据的函数捆绑在监听页数的回调中
      this.fetch(options)
    },
    handleCurrentChange (options) {       // 将获取数据的函数捆绑在监听页面大小的回调中
      this.fetch(options)
    },

    fetch (options = {}) {                // 数据请求（人事组提供的接口）
      // 将后端返回的数据挂载到 table 上
      req('postRoster', options).then(
        res => (this.table = Object.assign(this.table, res))
      )

      // 或
      // req('postRoster', options).then(
      //   res => Object.keys(res).map(key => (this.table[key] = res[key]))
      // )

      // 或
      // req('postRoster', options).then(res => {
      //   this.table.data = res.data
      //   this.table.info = res.info
      //   this.table.total = res.total
      // })
    }
  }
}
</script>
