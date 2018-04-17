<template>
  <i-table :table="table" sift>
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column type="selection"/>
        <el-table-column
          v-for="col of tableScope.siftColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :formatter="tableScope.formatter">
          <el-table-column
            v-for="son of col.children"
            :key="son.prop"
            :prop="son.prop"
            :label="son.label"
            :width="son.width"
            :formatter="tableScope.formatter"/>
        </el-table-column>

        <i-table-operator :table="tableScope"/>
      </el-table>
    </template>
  </i-table>
</template>

<script>
import data from './mock-multiple-data'

export default {
  data () {
    return {
      table: {
        title: '9-1 扁平化渲染',
        columns: [
          // 常规一级表头
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' },

          // 常规多级表头
          {
            prop: 'partner',
            label: '配偶',
            children: [
              { prop: 'name', label: '姓名' },
              { prop: 'age', label: '年龄' },
              { prop: 'status', label: '员工状态', display: { dict: 'EMPLOYEE_STATUS' } }
            ]
          },

          // 数量不固定、子集固定的多级表头
          {
            // 需要定义 parent，告知表头从 data 中的哪个字段找对应的数组数据
            // 若 parent 与 prop 同名，也需要显式地写出
            parent: 'work',
            prop: 'bussinessId',
            label: '{bussinessName}',
            children: [
              { prop: 'entry', label: '入职时间', display: { date: 'default' }, width: 150 },
              { prop: 'level', label: '技工等级', display: { dict: 'ARTISAN_LEVEL' }, width: 150 },
              { prop: 'status', label: '员工状态', display: { dict: 'EMPLOYEE_STATUS' }, width: 150 }
            ]
          }
        ],
        setting: {
          operator: [{
            text: '查看',
            func: () => {}
          }]
        },
        multiple: true,
        renderColumns: true,
        data: null
      }
    }
  },
  created () {
    // this.table.header = data
    setTimeout(() => (this.table.data = data), 0) // 模拟异步场景
  }
}
</script>
