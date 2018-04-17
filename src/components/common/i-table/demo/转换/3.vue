<template>
  <i-table :table="table">
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
        title: '3-3 时间转换',
        columns: [
          { prop: 'name', label: '姓名' },
          // 更多时间格式：http://10.16.85.142/iHR/iHR-YongHui/blob/itable/src/config/constants.js
          { prop: 'birth', label: '生日', display: { date: 'long' } }
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
