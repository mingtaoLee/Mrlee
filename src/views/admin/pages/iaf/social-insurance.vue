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
  import SearchTabPage from 'components/iaf/soical-insurance/search-tab-page'
  import SearchHistoryPage from 'components/iaf/soical-insurance/search-history-page'
  import AddApplyPage from 'components/iaf/soical-insurance/add-apply-page'
  import AddSuccessPage from 'components/iaf/soical-insurance/add-success-page'
  import DeleteApplyPage from 'components/iaf/soical-insurance/delete-apply-page'
  import DeleteSuccessPage from 'components/iaf/soical-insurance/delete-success-page'
  import RetireTabPage from 'components/iaf/soical-insurance/retire-tab-page'

  import ILayout from 'components/common/i-layout'

  export default {
    components: {
      SearchTabPage,
      AddApplyPage,
      AddSuccessPage,
      DeleteApplyPage,
      DeleteSuccessPage,
      RetireTabPage,
      SearchHistoryPage,
      ILayout
    },
    data () {
      return {
        // 当前选择tab页名称 defaultVulue 第一个tab页名称
        activeName: 'SearchTabPage',
        // 所有tab页中文标题和名称 如果添加新的tab页只需要增加一个新的数组对象
        tabNames: [
          {label: '参保查询', name: 'SearchTabPage'},
          {label: '增员申请', name: 'AddApplyPage'},
          {label: '增员完成', name: 'AddSuccessPage'},
          {label: '减员申请', name: 'DeleteApplyPage'},
          {label: '减员完成', name: 'DeleteSuccessPage'},
          {label: '参保历史记录', name: 'SearchHistoryPage'},
          {label: '退休管理', name: 'RetireTabPage'}
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
