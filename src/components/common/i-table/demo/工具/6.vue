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
        title: '2-6 图标',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        setting: {
          toolbar: [{
            text: '添加',
            icon: 'el-icon-plus',
            func: vm => vm.createData()
          }]
        },
        data
      }
    }
  }
}
</script>
