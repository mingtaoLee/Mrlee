<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="degree" label="学位" :formatter="tableScope.formatter"/>
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
        title: '3-2 向下兼容',
        columns: [
          { prop: 'degree', display: { dict: 'DEGREE' } }
        ],
        data: null
      }
    }
  },
  created () {
    // 模拟异步场景
    setTimeout(() => (this.table.data = data), 0)
  }
}
</script>
