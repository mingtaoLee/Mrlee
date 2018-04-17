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
  import SearchHeaderSearch from 'components/iaf/commerial/search-header-search'
  import AddHeaderSearch from 'components/iaf/commerial/add-header-search'
  import DeleteHeaderSearch from 'components/iaf/commerial/delete-header-search'
  import ChangeManagementSearch from 'components/iaf/commerial/change-management-search'

  import ILayout from 'components/common/i-layout'

  export default {
    components: {
      SearchHeaderSearch,
      AddHeaderSearch,
      DeleteHeaderSearch,
      ChangeManagementSearch,
      ILayout
    },
    data () {
      return {
        // 当前选择tab页名称 defaultVulue 第一个tab页名称
        activeName: 'SearchHeaderSearch',
        // 所有tab页中文标题和名称 如果添加新的tab页只需要增加一个新的数组对象
        tabNames: [
          {label: '参保查询', name: 'SearchHeaderSearch'},
          {label: '增员管理', name: 'AddHeaderSearch'},
          {label: '减员管理', name: 'DeleteHeaderSearch'},
          {label: '变更管理', name: 'ChangeManagementSearch'}
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
