<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <!-- 绑定 el-table 提供的 @selection-change，让 i-table 也可以在表格进行选择的时候，监听并执行相应的回调 -->
      <el-table
        :data="tableScope.clone"
        @selection-change="selectionChangeHandler(tableScope, $event)">
        <el-table-column type="selection"/>
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
        title: '1-5 监听多选（v2.0 废弃）',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        data
      }
    }
  },
  methods: {
    /** 监听选择的变动 */
    selectionChangeHandler ({ selectionChangeHandler }, selection) {
      // 执行 i-table 中的函数 selectionChangeHandler，并传入“已选对象” selection
      selectionChangeHandler(selection)

      // demo:
      this.$message({
        message: selection.map(el => ({ name: el.name, age: el.age }))
      })
    }
  }
}
</script>
