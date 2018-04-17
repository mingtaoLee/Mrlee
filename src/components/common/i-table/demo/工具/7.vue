<!-- 不合规范 -->

<template>
  <i-table :table="table">
    <el-button @click="test" slot="toolbar">向</el-button>
    <el-button @click="test" slot="toolbar" type="primary">下</el-button>
    <div slot="toolbar">
      <el-button @click="test">兼</el-button>
    </div>
    <div slot="toolbar">
      <div>
        <el-button @click="test" type="primary">容</el-button>
      </div>
    </div>

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
        title: '2-7 向下兼容',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        data
      }
    }
  },
  methods: {
    test () {
      this.$message({ message: '方法绑定' })
    }
  }
}
</script>
