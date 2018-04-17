<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <!-- 此处的 loading 在异步获取数据前为 true，获取后为 false。
      若语义需要，也可以使用 tableScope.loaded，它为 tableScope.loading 的取反 -->
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
import data from '../mock-data'

export default {
  data () {
    return {
      table: {
        title: '1-4 异步加载数据',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        data: null
      }
    }
  },
  created () {
    // 模拟异步场景，挂载到 table.data 上，触发 i-table 的视图渲染
    setTimeout(() => (this.table.data = data), 2500)
  }
}
</script>
