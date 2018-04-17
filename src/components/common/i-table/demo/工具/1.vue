<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
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
        title: '2-1 添加',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        // 配置在 setting 中
        setting: {
          toolbar: [{
            text: '添加空行',
            func: vm => vm.createData() // vm 为 i-table 的实例，也就意味着，可以通过 vm 拿到 i-table 内部的方法，比如此处的 createData 进行表格的增操作
          }, {
            text: '添加默认值',
            func: vm => vm.createData({ name: 'Test' })
          }]
        },
        data
      }
    }
  }
}
</script>
