<template>
  <div>
    <i-layout>

      <!-- 高级搜索栏 -->
      <template-manage-search @search="search" slot="header"/>

      <!-- 编制模板表格列表 -->
        <template-manage-home-table ref="homeTable" @new="newTemp"
        @check="checkTemp" @modify="modifyTemp" slot="section"/>

    </i-layout>

    <!-- 新建或修改编制模板弹窗 -->
    <edite-template ref="editeTemp" />

    <!-- 查看编制模板弹窗 -->
    <check-template ref="checkTemp" />
    
  </div>
</template>

<script>
import ILayout from 'components/common/i-layout'
import TemplateManageSearch from 'components/compile/search/template-manage-search'
import TemplateManageHomeTable from 'components/compile/table/template-manage-home-table'
import EditeTemplate from './edite-template'
import CheckTemplate from './check-template'

export default {
  name: 'TemplateManageHome',
  components: {
    ILayout,
    TemplateManageSearch,
    TemplateManageHomeTable,
    EditeTemplate,
    CheckTemplate
  },
  data () {
    return {

    }
  },

  methods: {
    // 打开新建模板窗口
    newTemp () {
      this.$refs.editeTemp.openDialog(true)
    },
    // 打开修改模板窗口
    modifyTemp (row) {
      this.$refs.editeTemp.openDialog(true, row)
    },
    // 打开查看模板窗口
    checkTemp (row) {
      this.$refs.checkTemp.openDialog(true, row)
    },
    // 高级搜索
    search (params) {
      this.$refs.homeTable.showTempList(params)
    }
  },

  mounted () {
    this.$refs.homeTable.showTempList()
  },

  created () {
  }
}
</script>

<style lang="scss" scoped>

</style>