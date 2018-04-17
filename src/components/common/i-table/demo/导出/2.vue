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
import req, { config } from 'api/performance/plan-manage.js'         // 获取 api 的配置信息: config

// 一个模拟的假参数
const mockReq = {
  schemeId: '40285a825feb9010015febc0b48e0000',
  period: 19
}

export default {
  data () {
    return {
      table: {
        title: '7-2 带有参数的 url',
        columns: [
          { prop: 'employeeName', label: '姓名' },
          { prop: 'orgName', label: '组织' }
        ],
        setting: {
          export: {
            req: config.getPlanList,        // api 配置信息（参数名以自身业务为准）【必填】
            param: () => mockReq            // url 中的参数信息，该例：url 为'/performance/schemes/{schemeId}/periods/{period}/plans'（根据需求添加该配置）【可选】
          }
        },
        data: null
      }
    }
  },
  created () {
    this.fetch()                           // 发起请求（函数名以自身业务为准）
  },
  methods: {
    // 该处以“计划列表”的接口为例（请求接口以自身业务为准）
    fetch (options = {}) {
      req('getPlanList', {
        ...options,
        ...mockReq // 由于业务需要，该接口在请求时需要携带参数（根据自身业务而定）
      })
      .then(res => (this.table = Object.assign(this.table, res)))
      .catch(err => console.log(err))
    }
  }
}
</script>
