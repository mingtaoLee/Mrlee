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

        <i-table-operator :table="tableScope"/>
      </el-table>
    </template>
  </i-table>
</template>

<script>
import access from 'mixins/access'
import data from '../mock-data'

export default {
  mixins: [access],

  data () {
    return {
      table: {
        title: '5-3 文本提示',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'rich', label: '壕否', display: { dict: 'WHETHER_TYPE' } }
        ],
        setting: {
          operator: [{
            text: '买买买',
            func: this.showDetail,
            show (row) {
              if (row.rich === 'N') {
                return {
                  disable: true,
                  message: '贫穷限制了您执行此操作的能力'
                }
              }
            }
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
