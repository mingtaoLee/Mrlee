<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label"
          :formatter="tableScope.formatter">
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
        title: '6-3 时间选择器',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'birth', label: '生日', display: { date: 'default' } },
          { prop: 'admissionDate', label: '入职时间', display: { date: '' } }
        ],
        setting: {
          editor: {
            birth: {
              type: 'date'
            },
            admissionDate: {
              type: 'date',
              options: {
                disabledDate (time) {
                  return time.getTime() > Date.now() - 8.64e7
                }
                // type: 'month'
              }
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
