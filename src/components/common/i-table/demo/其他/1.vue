<template>
  <i-table :table="table" sift>
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column type="selection"/>
        <el-table-column
          v-for="(col, idx) of tableScope.siftColumns"
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
        title: '10-1 筛选',
        columns: [],
        data: null,
        sift: {
          exclude: ['name']
        },
        renderColumns: true
      }
    }
  },

  mounted () {
    // 模拟异步
    setTimeout(() => (this.table.data = data), 0)
    setTimeout(() => (this.table.columns = [
      { prop: 'name', label: '姓名' },
      { prop: 'age', label: '年龄' },
      { prop: 'birth', label: '生日', display: { date: '' } },
      { prop: 'degree', label: '学位', display: { dict: 'DEGREE' } }
    ]), 0)
  }
}
</script>
