<!-- http://element-cn.eleme.io/1.4/#/zh-CN/component/form -->

<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column type="selection"/>
        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label"
          :width="col.width">
          <template slot-scope="scope">
            <i-table-cell
              :row="scope.row"
              :col="col.prop"
              :table="tableScope"
              @change="changeData"
              ref="cell">
              <el-switch
                v-if="col.prop === 'whether'"
                v-model="scope.row['whether']"
                active-value="Y"
                inactive-value="N">
              </el-switch>
            </i-table-cell>
          </template>
        </el-table-column>
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
        title: '6-11 单元格校验',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄', width: 150 },
          { prop: 'email', label: '邮箱', width: 200 },
          { prop: 'degree', label: '学位', display: { dict: 'DEGREE' }, width: 160 },
          { prop: 'birth', label: '生日', display: { date: 'default' }, width: 160 },
          { prop: 'entry', label: '入职', display: { date: 'default' }, width: 160 },
          { prop: 'whether', label: '是否加薪', display: { dict: 'WHETHER_TYPE' } }
        ],
        setting: {
          editor: {
            name: {
              rules: [
                { required: true, message: '请输入姓名', trigger: 'blur' },
                { min: 2, max: 4, message: '字段为 2 到 4 个字符', trigger: 'blur' }
              ]
            },
            email: {
              rules: [
                { type: 'email', message: '请输入正确的邮箱地址', required: true, trigger: 'blur' }
              ]
            },
            age: {
              type: 'number',
              // rules: [
              //   { type: 'number', required: true, message: '年龄不能为空' },
              //   { type: 'number', message: '年龄必须为数字' }
              // ]
              rules: [{                                        // 自定义规则
                validator: (rule, value, callback) => {
                  if (value === undefined) {
                    return callback(new Error('年龄不能为空'))
                  }
                  if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'))
                  } else {
                    if (value < 18) {
                      callback(new Error('必须年满18岁'))
                    } else {
                      callback()
                    }
                  }
                }
              }]
            },
            degree: {
              type: 'select',
              rules: [
                { required: true, message: '请选择学位' }
              ]
            },
            birth: {
              type: 'date',
              options: {
                disabledDate (time) {
                  return time > Date.now() || time > this.row.entry // 生日不得晚于今天并且早于入职时间
                }
              },
              rules: [
                { required: true, message: '请选择生日' }
              ]
            },
            entry: {
              type: 'date',
              options: {
                disabledDate (time) {
                  return time < this.row.birth // 入职的时间比生日晚
                }
              },
              rules: [
                { required: true, message: '请选择日期' }
              ]
            },
            whether: {
              rules: [{                                        // 自定义规则
                validator: (rule, value, callback) => {
                  if (value === 'N') {
                    callback(new Error('所有员工必须加薪'))
                  } else {
                    callback()
                  }
                }
              }]
            }
          },
          toolbar: [{
            text: '增加',
            func: vm => vm.createData()
          }, {
            text: '删除',
            type: 'danger',
            func: vm => vm.deleteData()
          }, {
            text: '保存',
            func: vm => {
              this.$refs.cell.map(el => el.validate()) // 触发 i-table-cell 校验

              // saveData 用于提取处理后的数据，内部执行 checkError 返回未通过校验的单元格数量，为 0 则表示无错误
              // 若未通过校验，saveData 返回 false
              // 若不需要提取内部数据，可直接执行 vm.checkError()，将返回值作为判断依据即可
              vm.saveData()
                ? this.$message({ type: 'success', message: '保存成功' })
                : this.$message({ type: 'error', message: '保存失败' })
            }
          }]
        },
        editable: true,
        dev: true,
        data
      }
    }
  },
  methods: {
    /** 查看数据的变动 */
    changeData (val) {
      console.log(val)
    }
  }
}
</script>
