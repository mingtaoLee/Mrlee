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
  import RemoteInsuranceList from 'components/iaf/remote-insurance/remote-insurance-list'
  import InsuranceAdvanceList from 'components/iaf/remote-insurance/insurance-advance-list'
  import SummaryList from 'components/iaf/remote-insurance/summary-list'

  import ILayout from 'components/common/i-layout'

  export default {
    components: {
      RemoteInsuranceList,
      InsuranceAdvanceList,
      SummaryList,
      ILayout
    },
    data () {
      return {
        // 当前选择tab页名称 defaultVulue 第一个tab页名称
        activeName: 'RemoteInsuranceList',
        // 所有tab页中文标题和名称 如果添加新的tab页只需要增加一个新的数组对象
        tabNames: [
          {label: '异地参保明细表', name: 'RemoteInsuranceList'},
          {label: '社保代垫明细表', name: 'InsuranceAdvanceList'},
          {label: '汇总表', name: 'SummaryList'}
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
