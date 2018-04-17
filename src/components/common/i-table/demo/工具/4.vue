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
        title: '2-4 自定义',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        setting: {
          toolbar: [{
            text: '定制',
            func: this.diy // 可以绑定各种自定义方法，还有个需要注意的地方是，此处若需要使用本组件内的 this，需要使用箭头函数或者使用本例中的挂载方式
          }]
        },
        data
      }
    }
  },
  methods: {
    diy (vm) {
      this.$message({
        message: '调用方法'
      })
    }
  }
}
</script>
