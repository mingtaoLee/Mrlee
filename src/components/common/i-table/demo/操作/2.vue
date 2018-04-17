<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label"
          :formatter="tableScope.formatter"
        />

        <i-table-operator
          :table="tableScope"
          width="300"
        />
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
        title: '5-2 操作状态',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' },
          { prop: 'rich', label: '壕否', display: { dict: 'WHETHER_TYPE' } }
        ],
        setting: {
          operator: [{
            text: '都可用(1)',
            func: this.showDetail
          }, {
            text: '壕可用(2)',
            func: this.showDetail,
            show (row) {
              if (row.rich === 'N') {
                return {
                  disable: true
                }
              }
            }
          }, {
            text: '青年可见(3)',
            func: this.showDetail,
            show (row) {
              if (row.age > 28) {
                return {
                  hidden: true
                }
              }
            }
          }, {
            text: '成年可见(4)',
            func: this.showDetail,
            show (row) {
              if (row.age < 18) {
                return {
                  empty: true
                }
              }
            }
          }]
        },
        data
      }
    }
  },

  methods: {
    showDetail (row) {
      this.$message({
        message: row
      })
    }
  },

  mounted () {
    // 如下是一个岁数增长的 demo，勿慌
    /* eslint-disable no-unused-vars */
    const timer = setInterval(() => {
      this.table.data = this.table.data.map(el => {
        if (el.age === 39) { clearInterval(timer) }
        return { ...el, age: el.age + 1 }
      })
    }, 2000)
  }
}
</script>
