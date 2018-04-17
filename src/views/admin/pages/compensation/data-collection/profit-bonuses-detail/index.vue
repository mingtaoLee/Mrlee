<template>
  <i-layout class="profit-bonuses-detail">
    <template slot="section">
      <el-tabs class="table-tab" v-model="currentTabIndex" @tab-click="handleTabClick">
        <el-tab-pane v-for="(tab, index) in tabs" :key="index" :label="tab.name" :name="tab.index">
          <component v-if="judgeShowComponent(currentTabIndex, index)" :is="tab.component"></component>
        </el-tab-pane>
      </el-tabs>
    </template>
  </i-layout>
</template>

<script>
  import TabMixin from '../../mixins/tab-mixin'
//  import ILayout from 'components/common/i-layout'

  const AreaManager = () => import('./area-manager')
  const CategoryCoach = () => import('./category-coach')
  const Partner = () => import('./partner')
  const StoreCoach = () => import('./store-coach')
  // const TwoClusters = () => import('./two-clusters')
  export default {
    mixins: [TabMixin],
    components: {
//      ILayout
    },
    data () {
      return {
        // 导航栏
        currentTabIndex: 1,
        tabs: [
          {
            name: '区总/区助',
            index: 1,
            component: AreaManager
          },
          {
            name: '品类教练',
            index: 2,
            component: CategoryCoach
          },
          {
            name: '门店教练',
            index: 3,
            component: StoreCoach
          },
          {
            name: '合伙人',
            index: 4,
            component: Partner
          }
        ]
      }
    },
    created () {
    },
    methods: {
      /** tab点击事件监听 */
      handleTabClick ({index}) {
        this.$nextTick(() => {
          this.$eventBus.$emit(`initLayout${index}`)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
<style lang="scss">
  .profit-bonuses-detail {
    .i-form {
      margin: 4.5px 0
    }
  }
</style>

