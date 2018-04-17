<template>
 <div>
   <i-table :table="table" ref="table" @save="getTableData" @clone="getTableClone">
     <template slot="table" slot-scope="tableScope">
       <el-table :data="tableScope.clone">
          <el-table-column type="selection"/>
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
              />
            </template>
          </el-table-column>
       </el-table>
     </template>
   </i-table>

   <el-button @click.native="sendAll" class="btn">保存</el-button>
 </div>
</template>

<script>
import data from '../mock-data'

export default {
  data () {
    return {
      table: {
        title: '6-8 组件外层触发事件抛出数据',
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄' }
        ],
        setting: {
          toolbar: [{
            text: '增加',
            func: vm => vm.createData()
          }, {
            text: '删除',
            type: 'danger',
            func: vm => vm.deleteData()
          }]
        },
        editable: true,
        dev: true,
        data
      }
    }
  },
  methods: {
    sendAll () {
      this.$refs.table.saveData()
    },
    // 获取 request 数据（增删改集合）
    getTableData (data) {
      this.$message({
        message: data
      })
    },
    // 获取内部所有数据
    getTableClone (data) {
      console.info('clone', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  margin-top: 10px;
}
</style>
