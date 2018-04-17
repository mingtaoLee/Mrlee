<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <!-- 与常规表格相比，在编辑表格中 :formatter="tableScope.formatter" 需要在 i-table-cell 中引用 -->
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
              :formatter="tableScope.formatter"
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
        title: '6-2 字典、下拉选择器',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'degree', label: '学位' }
        ],
        setting: {
          editor: {
            degree: {
              type: 'select',
            //   向下兼容
              options: {
                option: {
                //   value: label
                  1: 'A',
                  2: 'B'
                }
              }
            }
          }
        },
        editable: true,
        data: null
      }
    }
  },
  created () {
    setTimeout(() => (this.table.data = data), 2000)
  }
}
</script>
