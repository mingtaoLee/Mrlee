<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone" :cell-class-name="color">
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
        title: '1-1 常规',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        data // 静态挂载
      }
    }
  },

  methods: {
    // 业务场景
    color ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'age') {
        if (row.age > 18) {
          return 'blue'
        } else {
          return 'red'
        }
      }
    }
  }
}
</script>

