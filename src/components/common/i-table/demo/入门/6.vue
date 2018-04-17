<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <!-- 监听单击？通过 el-table 提供的 @row-click 实现 -->
      <el-table
        :data="tableScope.clone"
        @row-click="rowClickHandler(tableScope, $event)">
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
        title: '1-6 监听单击（v2.0 废弃）',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        data
      }
    }
  },
  methods: {
    /** 监听行点击事件，并返回被点击的行对象 */
    rowClickHandler ({ rowClickHandler }, row) {
      // 将行对象 row 传入 i-table 内部的 rowClickHandler 中
      rowClickHandler(row)

      // demo:
      this.$message({
        message: { name: row.name, age: row.age }
      })
    }
  }
}
</script>
