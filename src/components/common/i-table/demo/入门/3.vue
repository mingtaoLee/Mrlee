<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <!-- 混合写法同样滋瓷 -->
        <el-table-column prop="name" label="姓名"/>
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
        title: '1-3 混合',
        columns: [
          { prop: 'age', label: '年龄' }
        ],
        data
      }
    }
  }
}
</script>
