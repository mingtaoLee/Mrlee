<template>
  <i-table :table="table" @save="getTableData" @clone="getTableClone">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column type="selection"/>
        <el-table-column
          v-for="col of tableScope.columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width">
          <template slot-scope="scope">
            <i-table-cell :row="scope.row" :col="col.prop" :table="tableScope"/>
          </template>
          <el-table-column
            v-for="son of col.children"
            :key="son.prop"
            :prop="son.prop"
            :label="son.label"
            :width="son.width">
            <template slot-scope="scope">
              <i-table-cell :row="scope.row" :col="son.prop" :table="tableScope"/>
            </template>
          </el-table-column>
        </el-table-column>
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
        title: '9-4 反扁平化获取',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' },

          {
            prop: 'partner',
            label: '配偶',
            children: [
              { prop: 'name', label: '姓名' },
              { prop: 'age', label: '年龄' },
              { prop: 'status', label: '员工状态', display: { dict: 'EMPLOYEE_STATUS' } }
            ]
          },

          {
            parent: 'work',
            prop: 'bussinessId',
            label: '{bussinessName}',
            children: [
              { prop: 'entry', label: '入职时间', display: { date: 'short' }, width: 120 },
              { prop: 'level', label: '技工等级', display: { dict: 'ARTISAN_LEVEL' }, width: 120 },
              { prop: 'status', label: '员工状态', display: { dict: 'EMPLOYEE_STATUS' }, width: 100 }
            ]
          }
        ],
        setting: {
          editor: {
            age: {
              type: 'number'
            },
            entry: {
              type: 'date',
              options: {
                type: 'month'
              }
            },
            status: {
              type: 'select'
            },
            level: {
              type: 'select'
            }
          },
          toolbar: [{
            text: '增',
            func: vm => vm.createData()
          }, {
            text: '删',
            type: 'danger',
            func: vm => vm.deleteData()
          }, {
            text: '获取数据',
            func: vm => console.log(vm.saveData())
            // 通过 @save/@clone 分别获取“增删改集合”和“渲染层数据”，
            // 或者直接获取 saveData 的返回值: { request, clone }，对应如上的“增删改”、“渲染层”
          }]
        },
        editable: true,
        multiple: true,
        data
      }
    }
  },
  methods: {
    getTableData (data) {
      console.log(data)
    },

    getTableClone (data) {
      console.log(data)
    }
  }
}
</script>
