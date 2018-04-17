<template>
  <i-table
    :table="table"
    @pageSizeChange="handleSizeChange"
    @pageIndexChange="handleCurrentChange">
    <template slot="table" slot-scope="tableScope">
      <el-table
        :data="tableScope.clone"
        v-loading="tableScope.loading"
        :element-loading-text="$loadingText">
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
import req from 'api/employee/personal'

export default {
  data () {
    return {
      table: {
        title: '4-2 配置默认参数【beta版】',
        columns: [
          { prop: 'fullName', label: '姓名' },
          { prop: 'mobile', label: '手机' }
        ],
        data: null,                       // 用于挂载数据
        info: {                           // 设置默认分页信息【不符合规范，慎重使用】
          pageSize: 5,
          pageIndex: 2
        },
        total: 0,                         // 用于存放后端返回的数据总量
        showPagebar: true                 // 用于控制分页控件显示与否
      }
    }
  },
  created () {
    this.fetch(this.table.info)           // 模拟业务场景中的数据请求【函数名、具体行为依据自己业务而定】
  },
  methods: {
    // 将获取数据的函数捆绑在监听页面大小的回调中
    handleSizeChange (options) {
      this.fetch(options)
    },
    // 将获取数据的函数捆绑在监听页数的回调中
    handleCurrentChange (options) {
      this.fetch(options)
    },

    fetch (options = {}) {
      req('postRoster', options).then(
        res => (this.table = Object.assign(this.table, res))
      )
    }
  }
}
</script>
