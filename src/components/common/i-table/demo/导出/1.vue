// 规范2.7 http://10.16.85.133:8090/pages/viewpage.action?pageId=692311

// 参考如下实例，api 配置如下：
// postRoster: {
//   url: '/employee/employees/roster',
//   method: 'post',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }
// }

<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <!-- 若需要导出多选的数据，需要绑定 @selection-change 事件用于告知 i-table 选中的值 -->
        <el-table-column type="selection"/>
        <el-table-column
          v-for="(col, idx) of tableScope.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align"
          :formatter="tableScope.formatter"
        />
      </el-table>
    </template>
  </i-table>
</template>

<script>
import req, { config } from 'api/employee/personal'         // 获取 api 的配置信息: config

export default {
  data () {
    return {
      table: {
        title: '7-1 常规',
        columns: [
          { prop: 'fullName', label: '姓名' },
          { prop: 'mobile', label: '手机', width: 180, align: 'center' },
          { prop: 'idType', label: '证件类型', width: 150, display: { dict: 'DOCUMENT_TYPE' } },
          { prop: 'idNumber', label: '证件号码', width: 200, align: 'center' },
          { prop: 'birthDate', label: '出生日期', width: 200, display: { date: 'long' }, align: 'center' },
          { prop: 'gender', label: '性别', width: 100, display: { dict: 'GENDER' }, align: 'center' },
          { prop: 'nation', label: '民族', width: 140 }
        ],
        setting: {
          export: {
            text: '导出花名册',                // 不合规范，以自身业务为准【可选】
            show: () => ({ empty: false }),  // 是否显示【可选】
            config: {                        // 【可选】
              fileName: '花名册'              // 默认文件名
              // version: '',                // 默认后缀
              // range: ''                  // 默认范围 page/all/select
              // sync: true                  // 默认方式（同步/异步）
            },
            handleBeforeSend: (data) => {
              console.log(data) // 用于发送请求的数据集合
              return true // 若为 false 则阻断导出请求
            },
            req: config.postRoster          // api 配置信息（参数名以自身业务为准）【必填】
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
    // 该处以“花名册”的接口为例（请求接口以自身业务为准）
    fetch (options = {}) {
      req('postRoster', options)
        .then(res => {
          this.table = Object.assign(this.table, res)
        })
    }
  }
}
</script>
