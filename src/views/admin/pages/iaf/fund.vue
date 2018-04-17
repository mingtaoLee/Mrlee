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
  import QueryFund from 'components/iaf/fund/queryFund'
  import QueryHistoryFund from 'components/iaf/fund/queryHistoryFund'
  import addApplyFund from 'components/iaf/fund/addApplyFund'
  import addSuccessFund from 'components/iaf/fund/addSuccessFund'
  import deleteApplyFund from 'components/iaf/fund/deleteApplyFund'
  import deleteSuccessFund from 'components/iaf/fund/deleteSuccessFund'

  import ILayout from 'components/common/i-layout'

  export default {
    components: {
      QueryFund,
      addApplyFund,
      addSuccessFund,
      deleteApplyFund,
      deleteSuccessFund,
      QueryHistoryFund,
      ILayout
    },
    data () {
      return {
        // 当前选择tab页名称 defaultVulue 第一个tab页名称
        activeName: 'QueryFund',
        // 所有tab页中文标题和名称 如果添加新的tab页只需要增加一个新的数组对象
        tabNames: [
          {label: '参保查询', name: 'QueryFund'},
          {label: '增员申请', name: 'addApplyFund'},
          {label: '增员完成', name: 'addSuccessFund'},
          {label: '减员申请', name: 'deleteApplyFund'},
          {label: '减员完成', name: 'deleteSuccessFund'},
          {label: '参保历史记录', name: 'QueryHistoryFund'}
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
