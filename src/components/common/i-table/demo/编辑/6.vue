<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label">
          <template slot-scope="scope">
            <i-table-cell
              :row="scope.row"
              :col="col.prop"
              :table="tableScope"
            />
          </template>
        </el-table-column>
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
        title: '6-6 列不可编辑',
        columns: [
          { prop: 'name', label: '姓名（可编辑）' },
          { prop: 'age', label: '年龄（不可编辑）' },
          { prop: 'birth', label: '生日（不可编辑）', display: { date: 'default' } }
        ],
        setting: {
          editor: {
            birth: {
              type: 'date',
              disable: true
            },
            age: {
              type: 'number',
              disable: true
            }
          }
        },
        editable: true,
        data
      }
    }
  }
}
</script>
