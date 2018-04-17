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
        title: '6-5 表格不可编辑',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' },
          { prop: 'comment', label: '标注' }
        ],
        setting: {
          editor: {
            age: {
              type: 'number',
              options: {
                min: 10
              }
            },
            comment: {
              type: 'textarea'
            }
          }
        },
        disable: true,
        editable: true,
        data
      }
    }
  }
}
</script>
