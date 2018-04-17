<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column
          v-for="col of tableScope.columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :formatter="tableScope.formatter">
          <template slot-scope="scope">
            <i-table-cell :row="scope.row" :col="col.prop" :table="tableScope" ref="cell"/>
          </template>
          <el-table-column
            v-for="son of col.children"
            :key="son.prop"
            :prop="son.prop"
            :label="son.label"
            :width="son.width"
            :formatter="tableScope.formatter">
            <template slot-scope="scope">
              <i-table-cell :row="scope.row" :col="son.prop" :table="tableScope" ref="cell"/>
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
        title: '9-3 校验',
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
          toolbar: [{
            text: '校验并保存',
            func: vm => {
              this.$refs.cell.map(el => el.validate())

              vm.saveData()
                ? this.$message({ type: 'success', message: '保存成功' })
                : this.$message({ type: 'error', message: '未通过校验' })
            }
          }],
          editor: {
            // 通用配置
            name: {
              rules: [
                { min: 2, max: 5, message: '名字为 2-5 个字符' }
              ]
            },
            // 特定配置（优先级大于通用）
            'partner--name': {
              rules: [
                { min: 2, max: 4, message: '配偶名字为 2-4 个字符' }
              ]
            },
            entry: {
              type: 'date',
              rules: [
                { required: true, message: '请选择日期' }
              ]
            },
            status: {
              type: 'select',
              rules: [
                { required: true, message: '请选择状态' }
              ]
            },
            level: {
              type: 'select',
              rules: [
                { required: true, message: '请选择等级' }
              ]
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
