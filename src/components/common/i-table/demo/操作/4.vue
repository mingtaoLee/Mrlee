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

        <i-table-operator :table="tableScope"/>
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
        title: '5-4 图标',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        setting: {
          operator: [{
            text: '查看',
            icon: 'el-icon-warning',
            func: this.showDetail
          }]
        },
        data
      }
    }
  },
  methods: {
    showDetail (row) {
      this.$message({
        message: row
      })
    }
  }
}
</script>
