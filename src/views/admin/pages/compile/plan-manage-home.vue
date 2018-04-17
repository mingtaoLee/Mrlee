<template>
  <div class="wrap">

    <i-layout>

    <!-- 高级搜索栏 -->
    <plan-search  @search="search" slot="header" ref="planSearch"/>

    <!-- 编制计划表格列表 -->
    <plan-home-table ref="homeTable" :editable.sync="editable"
    @new="newPlan" @modify="modifyPlan" @managePlan="managePlan"
    @checkPlan="checkPlan" @checkTemp="checkTemp" slot="section" v-if="controlTable"/>

    </i-layout>

    <!-- 新建或修改编制计划 -->
    <edite-plan ref="editePlan"  />

    <!-- 查看模板窗口 -->
    <check-template ref="checkTemp" />
  </div>
</template>

<script>
import ILayout from 'components/common/i-layout'
import PlanSearch from 'components/compile/search/plan-search'
import PlanHomeTable from 'components/compile/table/plan-home-table'
import EditePlan from './edite-plan'
import CheckTemplate from './check-template'

export default {
  name: 'PlanManageHome',
  components: {
    ILayout,
    PlanSearch,
    PlanHomeTable,
    EditePlan,
    CheckTemplate
  },
  data () {
    return {
      editable: false,
      controlTable: true
    }
  },

  methods: {
    // 新增计划
    newPlan (row) {
      this.$refs.editePlan.openDialog(true)
    },
    // 修改计划
    modifyPlan (row) {
      this.$refs.editePlan.openDialog(true, row, false)
    },
    // 跳转到编制计划管理页面
    managePlan (row) {
      this.$router.push({path: 'check', query: {scaPlan: JSON.stringify(row), editable: this.editable}})
    },
    // 查看编制模板
    checkTemp (row) {
      this.$refs.checkTemp.openDialog(true, row)
    },
    // 查看计划模板
    checkPlan (row) {
      this.$refs.editePlan.openDialog(true, row, true)
    },
    // 高级搜索
    search (params) {
      this.$refs.homeTable.showPlanList(params)
    },
    // 检查权限
    checkJurisdiction () {
      // todo:这里需要使用权限验证，这里暂时使用路由来判断
      this.editable = this.$route.name === '计划管理'
    },
    // 重置组件函数
    reload (mounted) {
      this.checkJurisdiction()
      if (mounted) {
        // 重置高级搜索框及重置搜索
        this.$refs.planSearch.reset()
        // todo:重置下拉展开的高级搜索
        this.$children[0].$children[0].$children[0].isCollapse = false
        this.search()
      }
    }
  },

  mounted () {
    // 页面进来加载所有列表数据
    this.search()
  },

  watch: {
    '$route' (to, from) {
      this.reload(true)
    }
  },

  created () {
    this.reload()
  }

}
</script>

<style lang="scss" scoped>

</style>
