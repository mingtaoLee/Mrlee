<template>
  <i-table :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <!-- 动态、多级表头需要使用 tableScope.columns -->
        <el-table-column
          v-for="col of tableScope.columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align"
          :formatter="tableScope.formatter">
          <el-table-column
            v-for="son of col.children"
            :key="son.prop"
            :prop="son.prop"
            :label="son.label"
            :width="son.width"
            :align="son.align"
            :formatter="tableScope.formatter">
          </el-table-column>
        </el-table-column>
      </el-table>
    </template>
  </i-table>
</template>

<script>
// 多级表头文档：http://10.16.85.142/iHR/iHR-YongHui/tree/itable/src/components/common/i-table/demo/%E5%A4%9A%E7%BA%A7
// 动态表头数据参考：http://10.16.85.142/iHR/iHR-YongHui/blob/itable/src/components/common/i-table/demo/%E5%A4%9A%E7%BA%A7/mock-multiple-columns-data.js

import res from './mock-multiple-columns-data'
// import req from 'api/compensation/base-setting/company-rules'

export default {
  data () {
    return {
      table: {
        title: '9-5 动态多级表头',
        columns: null,
        // 用于对 columns 进行补充
        columnsExt: {
          age: {
            align: 'center'
          },
          entry: {
            display: { date: 'LONG' }, // long 大小写皆可
            align: 'center'
          },
          status: {
            display: { dict: 'EMPLOYEE_STATUS' } // 字典尽量由后端提供，不推荐在前端补充
          }
        },
        multiple: true,             // 多级模式，默认为 false
        renderColumns: true,        // 为 true 时，columns 动态更新，更新后因设为 false，防止表格反复初始化
        data: null
      }
    }
  },

  created () {
    this.fetch()
  },

  methods: {
    fetch () {
      setTimeout(() => {
        this.table.columns = res.columns // 动态插入表头
        this.table = Object.assign(this.table, res.tableData) // 设置 data、info、total、additions

        this.renderColumns = false // 防止表头信息变动，关闭动态表头
      }, 1000)
    }
  }
}
</script>
