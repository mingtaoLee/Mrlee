<template>
  <i-table :table="table" search="name">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
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
        title: '10-2 搜索',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' },
          { prop: 'birth', label: '生日', display: { date: '' } },
          { prop: 'degree', label: '学位', display: { dict: 'DEGREE' } }
        ],
        search: null,
        data: null
      }
    }
  },

  mounted () {
    setTimeout(() => (this.table.data = data), 0)
  }
}
</script>
