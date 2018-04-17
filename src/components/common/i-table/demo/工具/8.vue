<!-- 不合规范 -->

<template>
  <i-table :table="table">
    <el-button @click="test" slot="toolbar">模</el-button>
    <div slot="toolbar">
      <div>
        <el-button @click="test" type="primary">式</el-button>
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
        title: '2-8 混合模式',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        setting: {
          toolbar: [{
            text: '混',
            type: 'default',
            func: () => this.test()
          }, {
            text: '合',
            func: () => this.test()
          }]
        },
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
