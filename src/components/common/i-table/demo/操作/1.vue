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

        <!-- 提供 i-table-operator 作为 i-table 组件的御用子组件，用于实现行操作的列，与 el-table-column 同级 -->
        <!-- 可设置：fixed(默认为 'right')、label(默认为 '操作')、align(默认为 'center')、width(默认为 'auto')、min-width(默认为 '100') -->
        <!-- VERSION: v1.9.11+ -->
        <i-table-operator
          :table="tableScope"
          width="120"
          min-width="100"
        />

        <!-- VERSION: 已弃用 -->
        <!-- <el-table-column
          v-if="operatorColumn"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <i-table-operator
              :table="tableScope"
              :row="scope.row"
              @accessControl="accessControl"
            />
          </template>
        </el-table-column> -->
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
        title: '5-1 查看行对象',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        setting: {
          operator: [{
            text: '查看',
            func: this.showDetail     // 与 toolbar 类似，在 func 绑定相应的方法
            // 默认返回行对象 row，若需要 func 返回 scope 需要在 i-table-operator 标签中添加 scope 属性：<i-table-operator :table="tableScope" scope/>
          }]
        },
        data
      }
    }
  },
  methods: {
    showDetail (row) {                // 通过 row 查看行对象
      this.$message({
        message: row
      })
    }
  }
}
</script>
