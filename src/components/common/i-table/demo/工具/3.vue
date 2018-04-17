<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column type="selection"/>
        <el-table-column type="index" label="序号" width="150"/>
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
        title: '2-3 查看',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        setting: {
          toolbar: [{
            text: '查看',
            func: vm => this.showSelection(vm) // 查看选中的行
          }]
        },
        data
      }
    }
  },
  methods: {
    showSelection (vm) {
      this.$message({
        message: vm.getMultipleSelection() // i-table 提供的查操作
      })
    }
  }
}
</script>
