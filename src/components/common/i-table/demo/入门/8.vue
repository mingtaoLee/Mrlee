<template>
  <!-- 此处绑定事件 -->
  <i-table :table="table" @loaded="handleLoaded">
    <template slot="table" slot-scope="tableScope">
      <el-table
        :data="tableScope.clone"
        v-loading="tableScope.loading"
        :element-loading-text="$loadingText">
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
        title: '1-8 万能的 loaded',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        data
      }
    }
  },
  methods: {
    handleLoaded (vm) {
      console.log('1-8', vm) // vm 为 table 实例
    }
  }
}
</script>
