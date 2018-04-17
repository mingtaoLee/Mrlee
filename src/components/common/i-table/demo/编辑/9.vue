<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label">
          <template slot-scope="scope">
            <i-table-cell
              :row="scope.row"
              :col="col.prop"
              :table="tableScope"
              @change="handleChange"
              @blur="handleBlur"
            />
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
        title: '6-9 监听表单数据变动',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' },
          { prop: 'degree', label: '学位', display: { dict: 'DEGREE' } },
          { prop: 'birth', label: '生日', display: { date: 'default' } }
        ],
        setting: {
          editor: {
            age: {
              type: 'number'
            },
            degree: {
              type: 'select',
              options: {
                // options 环境在进入 i-table 后 this 被绑定，因此，若需要访问页面自身的属性，需使用箭头函数。回调返回：行对象 row，和列属性 col
                change: (row, col) => this.sayHi()

                // 写法根据自身业务而定
                // change: (row, col) => {
                //   console.log('正在调用自定义事件，并且返回页面属性 msg: ', this.msg)
                // }
              }
            },
            birth: {
              type: 'date'
            }
          }
        },
        editable: true,
        data
      },
      msg: 'hi'
    }
  },
  methods: {
    handleChange (val) {
      console.log('change', val)
    },

    handleBlur (val) {
      console.log('blur', val)
    },

    sayHi () {
      console.log('正在调用自定义事件，并且返回页面属性 msg:', this.msg)
    }
  }
}
</script>
