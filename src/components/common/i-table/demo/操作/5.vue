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
        title: '5-5 类型',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        setting: {
          operator: [{
            text: '查岁数',
            type: 'primary', // 默认
            func: row => this.$message(`${row.name} 同志今年 ${row.age} 岁`)
          }, {
            text: '增一岁',
            type: 'success',
            func: row => row.age++
          }, {
            text: '减一岁',
            type: 'danger',
            func: row => {
              row.age = Math.max(0, row.age - 1)
            }
          }]
        },
        data
      }
    }
  }
}
</script>
