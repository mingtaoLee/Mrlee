<template>
  <i-table :table="table">
    <template
      slot="table"
      slot-scope="tableScope">
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
        title: '3-4 自定义转换',
        columns: [
          {
            prop: 'name',
            label: '人员信息',
            display: {
              mixin: (row, col) => row[col] + ' 同志，芳龄 ' + row.age
            }
          }
        ],
        data
      }
    }
  }
}
</script>
