<template>
  <i-table :table="table">
    <template
      slot="table"
      slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <!-- formatter 为转换器 -->
        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label"
          :formatter="tableScope.formatter"
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
        title: '3-1 字典异步获取',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'degree', label: '学位', display: { dict: 'DEGREE' } },
          { prop: 'rich', label: '壕否', display: { dict: 'WHETHER_TYPE' } }
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
