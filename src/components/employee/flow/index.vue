<template>
  <el-table :data="flowData" v-if="flowData && list">
    <el-table-column v-for="(item, idx) in list" :key="idx" :label="item.label" :prop="item.prop"/>
  </el-table>
</template>
<script>
  import req from 'api/employee/flow'
  const {table} = require('./config.js')

  export default {
    name: 'flowTable',
    props: {
      flowId: {
        type: String
      },
      tableType: {
        type: String
      }
    },

    data () {
      return {
        table,
        flowData: null,
        list: null
      }
    },

    methods: {
      getFlowData (reqc) {
        let taskId = this.flowId
        req(`get${reqc}`, {taskId})
        .then(data => {
          this.flowData = data
        })
        .catch(err => console.log(err))
      }
    },

    created () {
      this.list = this.table[this.tableType]
      this.getFlowData(this.tableType)
    }
  }
</script>
<style>

</style>