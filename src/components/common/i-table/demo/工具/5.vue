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
        title: '2-5 状态控制',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        // 通过配置 show 控制按钮的状态
        setting: {
          toolbar: [{
            text: '可见可用',
            func: vm => vm.createData()     // 无 show 时，默认为可见并可用，或者 { empty: false }、{ disable: false } 效果一致
          }, {
            text: '不可见',                  // 不可见，当然，也就不可用了
            func: vm => vm.createData(),
            show () {
              return { empty: true }
            }
          }, {
            text: '不可用【beta版】',         // 虽可见，但不可用（不太符合规范，请慎重使用）
            func: vm => vm.createData(),
            show () {
              return { disable: true }
            }
          }]
        },
        data
      }
    }
  }
}
</script>
