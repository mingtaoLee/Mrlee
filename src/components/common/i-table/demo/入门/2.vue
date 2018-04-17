<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <!-- 想一行一行写也是可以的 -->
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="age" label="年龄"/>
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
        title: '1-2 向下兼容',
        data
      }
    }
  }
}
</script>
