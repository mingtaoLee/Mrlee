<template>
 <i-layout>
   <template slot="section">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(col, index) of tabNames" :label="col.label" :name="col.name" :key="index">
          <keep-alive>
            <component :is="col.name" v-if="activeName === col.name" :ref="col.name"></component>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
   </template>
 </i-layout>
</template>

<script>

import SummaryTable from 'components/iaf/apap-logs/summary-table'
import ReturnTable from 'components/iaf/apap-logs/return-table'
import PayBackTable from 'components/iaf/apap-logs/pay-back-table'
import PrepayTable from 'components/iaf/apap-logs/prepay-table'
import ILayout from 'components/common/i-layout'

export default {
  name: 'ApapLogs',
  components: {
    SummaryTable,
    ILayout,
    PayBackTable,
    ReturnTable,
    PrepayTable
  },
  data () {
    return {
      // 当前选择tab页名称 defaultVulue 第一个tab页名称
      activeName: 'ReturnTable',
      // 所有tab页中文标题和名称
      tabNames: [
        // {label: '补预退汇总表', name: 'SummaryTable'},
        {label: '补退表', name: 'ReturnTable'},
        {label: '补缴表', name: 'PayBackTable'},
        {label: '预缴表', name: 'PrepayTable'}
      ]
    }
  },
  methods: {
      /**
      * 保证查询表单样式保持三列显示
      *@param {String}当前tab页组件名称
      */
    handleClick ({name}) {
      this.$nextTick(() => this.$refs[name][0].initLayout())
    }
  }
}
</script>
