<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
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
        title: '9-2 编辑',
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
              { prop: 'entry', label: '入职时间', display: { date: 'default' }, width: 120 },
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
              type: 'date'
            },
            status: {
              type: 'select'
            },
            level: {
              type: 'select'
            },
            'bussinessId_0--level': { // 可通过此设置，让其优先相应
              type: 'select',
              disable: true
            }
          }
        },
        editable: true,
        multiple: true,
        dev: true,
        data
      }
    }
  }
}
</script>
